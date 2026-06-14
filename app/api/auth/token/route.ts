import { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'

// CRITICAL: API_TOKEN_SECRET must be set in production (falls back to SESSION_SECRET)
const API_TOKEN_SECRET = new TextEncoder().encode(
  process.env.API_TOKEN_SECRET || process.env.SESSION_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: API_TOKEN_SECRET or SESSION_SECRET is required in production')
    }
    console.warn('⚠️ No API_TOKEN_SECRET — using insecure dev key')
    return 'dev-only-insecure-api-key-do-not-use-in-prod'
  })()
)

// Token expiration: 30 days (reduced from 365d for security)
const API_TOKEN_EXPIRY = '30d'

async function signApiToken(userId: string, tokenId: string): Promise<string> {
  const jwt = await new SignJWT({ userId, tokenId, type: 'api' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(API_TOKEN_EXPIRY)
    .sign(API_TOKEN_SECRET)
  return `ntrl_${jwt}`
}

async function verifyApiToken(token: string): Promise<{ userId: string; tokenId: string } | null> {
  if (!token.startsWith('ntrl_')) return null
  try {
    const jwt = token.slice(5)
    const { payload } = await jwtVerify(jwt, API_TOKEN_SECRET, { algorithms: ['HS256'] })
    if (payload.type !== 'api' || !payload.userId || !payload.tokenId) return null
    return { userId: payload.userId as string, tokenId: payload.tokenId as string }
  } catch {
    return null
  }
}

// Generate a new API token for the current user
export async function POST() {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const tokenId = randomBytes(16).toString('hex')

  await db.query(`CREATE TABLE IF NOT EXISTS "ApiToken" ("id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL, "name" TEXT DEFAULT 'API', "createdAt" TIMESTAMP DEFAULT now(), "revokedAt" TIMESTAMP)`).catch(() => {})

  await db.query(
    `INSERT INTO "ApiToken" (id, "userId", "createdAt") VALUES ($1, $2, now())`,
    [tokenId, session.userId]
  )

  const token = await signApiToken(session.userId, tokenId)
  return Response.json({ token, expiresIn: API_TOKEN_EXPIRY })
}

// Verify a token
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return Response.json({ error: 'Missing token' }, { status: 401 })

  const payload = await verifyApiToken(token)
  if (!payload) return Response.json({ error: 'Invalid token' }, { status: 401 })

  // Check token exists in DB (not revoked)
  const { rows: tokenRows } = await db.query(
    `SELECT id FROM "ApiToken" WHERE id = $1 AND "userId" = $2 AND "revokedAt" IS NULL`,
    [payload.tokenId, payload.userId]
  )
  if (!tokenRows[0]) return Response.json({ error: 'Token revoked' }, { status: 401 })

  const { rows } = await db.query(
    `SELECT id, email, name, plan, "messagesUsed", "messagesResetAt" FROM "User" WHERE id = $1`,
    [payload.userId]
  )
  if (!rows[0]) return Response.json({ error: 'User not found' }, { status: 401 })

  return Response.json({ user: rows[0] })
}

// DELETE: Revoke a token
export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { tokenId } = await req.json().catch(() => ({ tokenId: null }))
  if (tokenId) {
    await db.query(`UPDATE "ApiToken" SET "revokedAt" = now() WHERE id = $1 AND "userId" = $2`, [tokenId, session.userId])
  } else {
    // Revoke all tokens
    await db.query(`UPDATE "ApiToken" SET "revokedAt" = now() WHERE "userId" = $1 AND "revokedAt" IS NULL`, [session.userId])
  }

  return Response.json({ ok: true })
}

// Export for use in other routes
export { verifyApiToken }
