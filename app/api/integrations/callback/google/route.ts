import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'
import { encryptToken } from '@/lib/encryption'

function cuid() {
  return 'intg_' + randomBytes(12).toString('hex')
}

async function ensureIntegrationTable(): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS "Integration" (
      id TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      provider TEXT NOT NULL DEFAULT 'google',
      service TEXT NOT NULL,
      "accessToken" TEXT NOT NULL,
      "refreshToken" TEXT,
      "expiresAt" TIMESTAMPTZ,
      scope TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "Integration_userId_provider_service_key" UNIQUE ("userId", provider, service)
    )
  `)
  await db.query(`
    CREATE INDEX IF NOT EXISTS "Integration_userId_idx" ON "Integration" ("userId")
  `)
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code = searchParams.get('code')
  const stateRaw = searchParams.get('state')
  const error = searchParams.get('error')

  // Google returns ?error=access_denied if user cancels
  if (error) {
    console.error('[OAUTH] Google returned error:', error)
    return NextResponse.redirect(
      `${origin}/integrations?error=${encodeURIComponent(error)}`
    )
  }

  if (!code || !stateRaw) {
    console.error('[OAUTH] Missing code or state', { hasCode: !!code, hasState: !!stateRaw })
    return NextResponse.redirect(
      `${origin}/integrations?error=missing_params`
    )
  }

  // Handle login state (from /api/auth/google)
  if (stateRaw === 'login') {
    return NextResponse.redirect(
      `${origin}/api/auth/callback?code=${code}&state=${stateRaw}`
    )
  }

  let state: { userId: string; services: string[] }
  try {
    state = JSON.parse(Buffer.from(stateRaw, 'base64url').toString())
  } catch (e) {
    console.error('[OAUTH] Invalid state:', e)
    return NextResponse.redirect(
      `${origin}/integrations?error=invalid_state`
    )
  }

  if (!state.userId || !state.services?.length) {
    console.error('[OAUTH] Incomplete state payload:', state)
    return NextResponse.redirect(
      `${origin}/integrations?error=invalid_state_payload`
    )
  }

  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ??
    `${origin}/api/integrations/callback/google`

  // Validate env vars
  if (!clientId || !clientSecret) {
    console.error('[OAUTH] Missing Google OAuth env vars', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
    })
    return NextResponse.redirect(
      `${origin}/integrations?error=google_not_configured`
    )
  }

  // Exchange authorization code for tokens
  let tokenRes: Response
  try {
    tokenRes = await fetch('https://oauth2.googleapis.com/token', {
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
  } catch (e) {
    console.error('[OAUTH] Token exchange network error:', e)
    return NextResponse.redirect(
      `${origin}/integrations?error=token_exchange_network`
    )
  }

  if (!tokenRes.ok) {
    const errBody = await tokenRes.text()
    console.error('[OAUTH] Token exchange failed:', tokenRes.status, errBody)
    // Google returns specific errors like redirect_uri_mismatch
    let errorCode = 'token_exchange_failed'
    try {
      const errJson = JSON.parse(errBody)
      if (errJson.error === 'redirect_uri_mismatch') {
        errorCode = 'redirect_uri_mismatch'
        console.error('[OAUTH] Redirect URI mismatch. Expected:', redirectUri)
      } else if (errJson.error === 'invalid_grant') {
        errorCode = 'invalid_grant'
      }
    } catch {}
    return NextResponse.redirect(
      `${origin}/integrations?error=${errorCode}`
    )
  }

  const tokens = (await tokenRes.json()) as {
    access_token: string
    refresh_token?: string
    expires_in: number
    scope: string
  }

  if (!tokens.access_token) {
    console.error('[OAUTH] No access_token in response:', Object.keys(tokens))
    return NextResponse.redirect(
      `${origin}/integrations?error=no_access_token`
    )
  }

  const expiresAt = new Date(Date.now() + (tokens.expires_in || 3600) * 1000)

  // Ensure the Integration table exists before inserting
  try {
    await ensureIntegrationTable()
  } catch (e) {
    console.error('[OAUTH] Failed to ensure Integration table:', e)
    return NextResponse.redirect(
      `${origin}/integrations?error=db_schema_error`
    )
  }

  // Encrypt tokens before storing in DB
  const encryptedAccessToken = encryptToken(tokens.access_token)
  const encryptedRefreshToken = tokens.refresh_token ? encryptToken(tokens.refresh_token) : null

  // Save tokens for each service
  let savedCount = 0
  for (const service of state.services) {
    try {
      await db.query(
        `INSERT INTO "Integration" (id, "userId", provider, service, "accessToken", "refreshToken", "expiresAt", scope, "createdAt", "updatedAt")
         VALUES ($1, $2, 'google', $3, $4, $5, $6, $7, now(), now())
         ON CONFLICT ("userId", provider, service)
         DO UPDATE SET
           "accessToken" = $4,
           "refreshToken" = COALESCE($5, "Integration"."refreshToken"),
           "expiresAt" = $6,
           scope = $7,
           "updatedAt" = now()`,
        [
          cuid(),
          state.userId,
          service,
          encryptedAccessToken,
          encryptedRefreshToken,
          expiresAt,
          tokens.scope,
        ]
      )
      savedCount++
    } catch (e: any) {
      console.error(
        `[OAUTH] DB error saving ${service} for user ${state.userId}:`,
        e.message
      )
    }
  }

  if (savedCount === 0) {
    console.error(
      `[OAUTH] Failed to save any integration for user ${state.userId}`
    )
    return NextResponse.redirect(
      `${origin}/integrations?error=db_save_failed`
    )
  }

  const successServices = state.services.join(',')
  return NextResponse.redirect(
    `${origin}/integrations?success=google&services=${encodeURIComponent(successServices)}`
  )
}
