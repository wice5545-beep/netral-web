import { NextRequest } from 'next/server'
import { SignJWT } from 'jose'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { verifyApiToken } from '@/lib/api-token'
import { randomBytes } from 'crypto'

const API_TOKEN_SECRET = new TextEncoder().encode(process.env.API_TOKEN_SECRET || process.env.SESSION_SECRET || 'fallback')

async function signApiToken(userId: string, tokenId: string): Promise<string> {
  const jwt = await new SignJWT({ userId, tokenId, type: 'api' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('365d')
    .sign(API_TOKEN_SECRET)
  return `ntrl_${jwt}`
}

// Lazy-create ApiToken table if it doesn't exist
async function ensureApiTokenTable() {
  try {
    await db.query(
      `CREATE TABLE IF NOT EXISTS "ApiToken" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "name" TEXT DEFAULT 'API',
        "createdAt" TIMESTAMP DEFAULT now(),
        "revokedAt" TIMESTAMP
      )`
    )
    await db.query(`CREATE INDEX IF NOT EXISTS "ApiToken_userId_idx" ON "ApiToken" ("userId")`).catch(() => {})
  } catch (e) {
    console.error('[api-token] Failed to ensure table:', e)
  }
}

// POST: Generate a new API token for the current user
export async function POST() {
  try {
    const session = await getSession()
    if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    await ensureApiTokenTable()

    const tokenId = randomBytes(16).toString('hex')

    await db.query(
      `INSERT INTO "ApiToken" (id, "userId", "createdAt") VALUES ($1, $2, now())`,
      [tokenId, session.userId]
    )

    const token = await signApiToken(session.userId, tokenId)
    return Response.json({ token })
  } catch (e: any) {
    console.error('[POST /api/auth/token]', e)
    return Response.json({ error: 'Failed to generate token', detail: e?.message }, { status: 500 })
  }
}

// GET: Verify a token (used by VS Code extension)
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) return Response.json({ error: 'Missing token' }, { status: 401 })

    const payload = await verifyApiToken(token)
    if (!payload) return Response.json({ error: 'Invalid or revoked token' }, { status: 401 })

    const { rows } = await db.query(
      `SELECT id, email, name, plan, "messagesUsed", "messagesResetAt" FROM "User" WHERE id = $1`,
      [payload.userId]
    )
    if (!rows[0]) return Response.json({ error: 'User not found' }, { status: 401 })

    return Response.json({ user: rows[0] })
  } catch (e: any) {
    console.error('[GET /api/auth/token]', e)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}

// DELETE: Revoke a token (or all tokens for the user)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    await ensureApiTokenTable()

    const { tokenId } = await req.json().catch(() => ({ tokenId: null }))
    if (tokenId) {
      await db.query(`UPDATE "ApiToken" SET "revokedAt" = now() WHERE id = $1 AND "userId" = $2`, [tokenId, session.userId])
    } else {
      await db.query(`UPDATE "ApiToken" SET "revokedAt" = now() WHERE "userId" = $1 AND "revokedAt" IS NULL`, [session.userId])
    }

    return Response.json({ ok: true })
  } catch (e: any) {
    console.error('[DELETE /api/auth/token]', e)
    return Response.json({ error: 'Failed to revoke', detail: e?.message }, { status: 500 })
  }
}
