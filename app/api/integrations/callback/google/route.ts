import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'

function cuid() {
  return 'intg_' + randomBytes(12).toString('hex')
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code = searchParams.get('code')
  const stateRaw = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !stateRaw) {
    return NextResponse.redirect(`${origin}/chat?integration_error=${encodeURIComponent(error ?? 'missing_code')}`)
  }

  // Handle login state (from /api/auth/google)
  if (stateRaw === 'login') {
    return NextResponse.redirect(`${origin}/api/auth/callback?code=${code}&state=${stateRaw}`)
  }

  let state: { userId: string; services: string[] }
  try {
    state = JSON.parse(Buffer.from(stateRaw, 'base64url').toString())
  } catch {
    return NextResponse.redirect(`${origin}/chat?integration_error=invalid_state`)
  }

  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? `${origin}/api/integrations/callback/google`

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/chat?integration_error=google_not_configured`)
  }

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
    console.error('Token exchange failed:', err)
    return NextResponse.redirect(`${origin}/chat?integration_error=token_exchange_failed`)
  }

  const tokens = await tokenRes.json() as {
    access_token: string
    refresh_token?: string
    expires_in: number
    scope: string
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000)

  try {
    for (const service of state.services) {
      await db.query(
        `INSERT INTO "Integration" (id, "userId", provider, service, "accessToken", "refreshToken", "expiresAt", scope, "createdAt", "updatedAt")
         VALUES ($1, $2, 'google', $3, $4, $5, $6, $7, now(), now())
         ON CONFLICT ("userId", provider, service)
         DO UPDATE SET "accessToken" = $4, "refreshToken" = COALESCE($5, "Integration"."refreshToken"), "expiresAt" = $6, scope = $7, "updatedAt" = now()`,
        [cuid(), state.userId, service, tokens.access_token, tokens.refresh_token ?? null, expiresAt, tokens.scope]
      )
    }
  } catch (e) {
    console.error('DB error saving integration:', e)
    return NextResponse.redirect(`${origin}/integrations?error=db_error`)
  }

  return NextResponse.redirect(`${origin}/integrations?success=google`)
}
