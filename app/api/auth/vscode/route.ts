import { NextRequest } from 'next/server'
import { SignJWT } from 'jose'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'

const API_TOKEN_SECRET = new TextEncoder().encode(process.env.API_TOKEN_SECRET || process.env.SESSION_SECRET || 'fallback')

// Ensure the table exists (idempotent)
async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS "VscodeLink" (
      "code" TEXT PRIMARY KEY,
      "token" TEXT,
      "userId" TEXT,
      "expiresAt" TIMESTAMP NOT NULL,
      "createdAt" TIMESTAMP DEFAULT now()
    )
  `).catch(() => {})
}

// POST: Extension initiates a link request (creates a code)
export async function POST() {
  await ensureTable()
  const code = randomBytes(16).toString('hex')
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await db.query(
    `INSERT INTO "VscodeLink" ("code", "expiresAt") VALUES ($1, $2)`,
    [code, expiresAt]
  )

  // Cleanup expired
  await db.query(`DELETE FROM "VscodeLink" WHERE "expiresAt" < now()`).catch(() => {})

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://netral-web.vercel.app'
  return Response.json({ code, url: `${baseUrl}/auth/vscode?code=${code}` })
}

// PUT: Web app confirms the link (user authenticated, approves)
export async function PUT(req: NextRequest) {
  await ensureTable()
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await req.json().catch(() => ({ code: null }))
  if (!code) return Response.json({ error: 'Code manquant' }, { status: 400 })

  const { rows } = await db.query(
    `SELECT "expiresAt" FROM "VscodeLink" WHERE "code" = $1`,
    [code]
  )
  if (!rows[0]) return Response.json({ error: 'Code invalide' }, { status: 400 })

  if (new Date(rows[0].expiresAt) < new Date()) {
    await db.query(`DELETE FROM "VscodeLink" WHERE "code" = $1`, [code])
    return Response.json({ error: 'Code expiré' }, { status: 410 })
  }

  // Ensure ApiToken table
  await db.query(`
    CREATE TABLE IF NOT EXISTS "ApiToken" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "name" TEXT DEFAULT 'API',
      "createdAt" TIMESTAMP DEFAULT now(),
      "revokedAt" TIMESTAMP
    )
  `).catch(() => {})

  // Generate token
  const tokenId = randomBytes(16).toString('hex')
  await db.query(
    `INSERT INTO "ApiToken" ("id", "userId", "createdAt", "name") VALUES ($1, $2, now(), $3)`,
    [tokenId, session.userId, 'VS Code']
  )

  const jwt = await new SignJWT({ userId: session.userId, tokenId, type: 'api' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('365d')
    .sign(API_TOKEN_SECRET)

  const token = `ntrl_${jwt}`

  await db.query(
    `UPDATE "VscodeLink" SET "token" = $1, "userId" = $2 WHERE "code" = $3`,
    [token, session.userId, code]
  )

  return Response.json({ ok: true })
}

// GET: Extension polls for the token
export async function GET(req: NextRequest) {
  await ensureTable()
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return Response.json({ status: 'pending' })

  const { rows } = await db.query(
    `SELECT "token", "expiresAt" FROM "VscodeLink" WHERE "code" = $1`,
    [code]
  )

  if (!rows[0]) return Response.json({ status: 'pending' })

  if (new Date(rows[0].expiresAt) < new Date()) {
    await db.query(`DELETE FROM "VscodeLink" WHERE "code" = $1`, [code])
    return Response.json({ status: 'expired' })
  }

  if (rows[0].token) {
    const token = rows[0].token
    // Delete the entry now that token is consumed
    await db.query(`DELETE FROM "VscodeLink" WHERE "code" = $1`, [code])
    return Response.json({ status: 'ready', token })
  }

  return Response.json({ status: 'pending' })
}
