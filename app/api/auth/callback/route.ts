import { NextRequest, NextResponse } from 'next/server'
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

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? `${origin}/api/auth/callback`

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/login?error=google_not_configured`)
  }

  // Exchange code for tokens directly with Google
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.text()
    console.error('Google token exchange failed:', err)
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const tokens = await tokenRes.json() as { access_token: string; id_token?: string }

  // Get user info from Google
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  if (!userRes.ok) {
    return NextResponse.redirect(`${origin}/login?error=userinfo_failed`)
  }

  const googleUser = await userRes.json() as { email: string; name?: string; given_name?: string }
  const email = googleUser.email.toLowerCase()
  const name = googleUser.name || googleUser.given_name || email.split('@')[0]

  // Upsert user in DB
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
