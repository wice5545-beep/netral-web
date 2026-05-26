import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ensureTables } from '@/lib/db-init'
import { randomBytes } from 'crypto'

function cuid() {
  return 'intg_' + randomBytes(12).toString('hex')
}

// Always redirect back to /integrations with success or detailed error
function redirectWith(origin: string, params: Record<string, string>) {
  const u = new URL(`${origin}/integrations`)
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v))
  return NextResponse.redirect(u.toString())
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code = searchParams.get('code')
  const stateRaw = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) return redirectWith(origin, { error: `google_${error}` })
  if (!code || !stateRaw) return redirectWith(origin, { error: 'missing_code' })

  // Handle login state (from /api/auth/google) — different flow
  if (stateRaw === 'login') {
    return NextResponse.redirect(`${origin}/api/auth/callback?code=${code}&state=${stateRaw}`)
  }

  let state: { userId: string; services: string[] }
  try {
    state = JSON.parse(Buffer.from(stateRaw, 'base64url').toString())
  } catch {
    return redirectWith(origin, { error: 'invalid_state' })
  }

  if (!state.userId || !Array.isArray(state.services) || !state.services.length) {
    return redirectWith(origin, { error: 'invalid_state_data' })
  }

  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? `${origin}/api/integrations/callback/google`

  if (!clientId || !clientSecret) {
    return redirectWith(origin, { error: 'google_not_configured' })
  }

  // Ensure Integration table exists before insert
  await ensureTables()

  // Exchange authorization code for tokens
  let tokens: { access_token: string; refresh_token?: string; expires_in: number; scope: string }
  try {
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
      const errBody = await tokenRes.text()
      console.error('[OAuth] Token exchange failed:', tokenRes.status, errBody)
      return redirectWith(origin, { error: 'token_exchange_failed', detail: String(tokenRes.status) })
    }
    tokens = await tokenRes.json()
  } catch (e) {
    console.error('[OAuth] Token fetch error:', e)
    return redirectWith(origin, { error: 'token_fetch_failed' })
  }

  if (!tokens.access_token) {
    return redirectWith(origin, { error: 'no_access_token' })
  }

  const expiresAt = new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000)
  const savedServices: string[] = []
  const errors: string[] = []

  // Save each service — use SELECT+UPDATE/INSERT to avoid ON CONFLICT issues
  for (const service of state.services) {
    try {
      const { rows: existing } = await db.query(
        `SELECT id FROM "Integration" WHERE "userId" = $1 AND provider = 'google' AND service = $2`,
        [state.userId, service]
      )

      if (existing.length > 0) {
        await db.query(
          `UPDATE "Integration"
           SET "accessToken" = $1, "refreshToken" = COALESCE($2, "refreshToken"),
               "expiresAt" = $3, scope = $4, "updatedAt" = now()
           WHERE id = $5`,
          [tokens.access_token, tokens.refresh_token ?? null, expiresAt, tokens.scope, existing[0].id]
        )
      } else {
        await db.query(
          `INSERT INTO "Integration" (id, "userId", provider, service, "accessToken", "refreshToken", "expiresAt", scope, "createdAt", "updatedAt")
           VALUES ($1, $2, 'google', $3, $4, $5, $6, $7, now(), now())`,
          [cuid(), state.userId, service, tokens.access_token, tokens.refresh_token ?? null, expiresAt, tokens.scope]
        )
      }
      savedServices.push(service)
    } catch (e: any) {
      const errMsg = e?.message || String(e)
      console.error(`[OAuth] DB error for service ${service}:`, errMsg)
      errors.push(`${service}:${errMsg.slice(0, 50)}`)
    }
  }

  if (savedServices.length === 0) {
    return redirectWith(origin, {
      error: 'db_error',
      detail: errors.join(';').slice(0, 200) || 'no_services_saved'
    })
  }

  return redirectWith(origin, { success: 'google', services: savedServices.join(',') })
}
