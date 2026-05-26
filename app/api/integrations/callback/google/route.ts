import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code = searchParams.get('code')
  const stateRaw = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !stateRaw) {
    return NextResponse.redirect(`${origin}/chat?integration_error=${error ?? 'missing_code'}`)
  }

  let state: { userId: string; services: string[] }
  try {
    state = JSON.parse(Buffer.from(stateRaw, 'base64url').toString())
  } catch {
    return NextResponse.redirect(`${origin}/chat?integration_error=invalid_state`)
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${origin}/chat?integration_error=token_exchange_failed`)
  }

  const tokens = await tokenRes.json() as {
    access_token: string
    refresh_token?: string
    expires_in: number
    scope: string
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000)

  // Upsert one row per service
  for (const service of state.services) {
    await db.query(
      `INSERT INTO "Integration" (id, "userId", provider, service, "accessToken", "refreshToken", "expiresAt", scope, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, 'google', $2, $3, $4, $5, $6, now(), now())
       ON CONFLICT ("userId", provider, service)
       DO UPDATE SET "accessToken" = $3, "refreshToken" = COALESCE($4, "Integration"."refreshToken"), "expiresAt" = $5, scope = $6, "updatedAt" = now()`,
      [state.userId, service, tokens.access_token, tokens.refresh_token ?? null, expiresAt, tokens.scope]
    )
  }

  return NextResponse.redirect(`${origin}/chat?integration_success=google`)
}
