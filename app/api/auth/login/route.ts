import { NextRequest } from 'next/server'
import { createSession } from '@/lib/session'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({ email: '', password: '' }))
  if (!email || !password) return Response.json({ error: 'Email et mot de passe requis' }, { status: 400 })

  const rl = rateLimit(`login:${email.toLowerCase()}`, 5, 15 * 60 * 1000)
  if (!rl.allowed) return Response.json({ error: 'Trop de tentatives' }, { status: 429 })

  const { rows } = await db.query(
    `SELECT id, password FROM "User" WHERE email = $1`,
    [email.toLowerCase()]
  )

  if (!rows[0]) return Response.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })

  const user = rows[0]

  // If no password stored, set it (first login after migration)
  if (!user.password) {
    const hash = await bcrypt.hash(password, 12)
    await db.query(`UPDATE "User" SET password = $1 WHERE id = $2`, [hash, user.id])
    await createSession(user.id)
    return Response.json({ ok: true })
  }

  // Constant-time comparison via bcrypt
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return Response.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })

  await createSession(user.id)
  return Response.json({ ok: true })
}
