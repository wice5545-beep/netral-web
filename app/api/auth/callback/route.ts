import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSession } from '@/lib/session'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const { user } = data
  const email = user.email!.toLowerCase()
  const name = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0]

  // Upsert user in our DB
  const { rows } = await db.query(`SELECT id, onboarded FROM "User" WHERE email = $1`, [email])

  let userId: string
  let onboarded: boolean

  if (rows[0]) {
    userId = rows[0].id
    onboarded = rows[0].onboarded
  } else {
    userId = randomBytes(12).toString('hex')
    await db.query(
      `INSERT INTO "User" (id, name, email, onboarded, "preferredModel", plan, "messagesUsed", "messagesResetAt", "createdAt")
       VALUES ($1, $2, $3, false, 'ntrl-1.3', 'free', 0, $4, now())`,
      [userId, name, email, new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)]
    )
    onboarded = false
  }

  await createSession(userId)

  return NextResponse.redirect(`${origin}${onboarded ? '/chat' : '/onboarding'}`)
}
