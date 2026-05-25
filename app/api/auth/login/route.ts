import { NextRequest } from 'next/server'
import { createSession } from '@/lib/session'
import { getSupabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({ email: '', password: '' }))
  if (!email || !password) return Response.json({ error: 'Email et mot de passe requis' }, { status: 400 })

  // Brute-force protection
  const rl = rateLimit(`login-api:${email.toLowerCase()}`, 5, 15 * 60 * 1000)
  if (!rl.allowed) return Response.json({ error: 'Trop de tentatives' }, { status: 429 })

  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    // Fallback: create in Supabase if user exists in DB
    const { rows } = await db.query(`SELECT id, name FROM "User" WHERE email = $1`, [email.toLowerCase()])
    if (rows[0]) {
      const { createClient } = await import('@supabase/supabase-js')
      const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name: rows[0].name } }).catch(() => {})
      await admin.auth.admin.updateUserById(rows[0].id, { password }).catch(() => {})
      const { data: retry, error: retryErr } = await getSupabase().auth.signInWithPassword({ email, password })
      if (retryErr || !retry.user) return Response.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
      await createSession(retry.user.id)
      return Response.json({ ok: true })
    }
    return Response.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
  }

  // Ensure user in DB
  await db.query(
    `INSERT INTO "User" (id, name, email, password, onboarded, "preferredModel", plan, "messagesUsed", "messagesResetAt", "createdAt") VALUES ($1, $2, $3, '', true, 'ntrl-1.3', 'free', 0, $4, now()) ON CONFLICT (id) DO NOTHING`,
    [data.user.id, data.user.user_metadata?.name ?? email.split('@')[0], email, new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)]
  )

  await createSession(data.user.id)
  return Response.json({ ok: true })
}
