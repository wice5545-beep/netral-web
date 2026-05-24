import { NextRequest } from 'next/server'
import { SignJWT } from 'jose'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'

const API_TOKEN_SECRET = new TextEncoder().encode(process.env.API_TOKEN_SECRET || process.env.SESSION_SECRET || 'fallback')

// In-memory store for pending link requests (code → token)
// In production, use Redis or DB
const pendingLinks = new Map<string, { token: string | null; userId: string | null; expiresAt: number }>()

// POST: Extension initiates a link request (creates a code)
export async function POST() {
  const code = randomBytes(16).toString('hex')
  pendingLinks.set(code, { token: null, userId: null, expiresAt: Date.now() + 5 * 60 * 1000 })

  // Cleanup expired
  for (const [k, v] of pendingLinks) {
    if (v.expiresAt < Date.now()) pendingLinks.delete(k)
  }

  return Response.json({ code, url: `${process.env.NEXT_PUBLIC_URL || 'https://netral-web.vercel.app'}/auth/vscode?code=${code}` })
}

// PUT: Web app confirms the link (user is authenticated, approves the code)
export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await req.json().catch(() => ({ code: null }))
  if (!code || !pendingLinks.has(code)) return Response.json({ error: 'Invalid or expired code' }, { status: 400 })

  const pending = pendingLinks.get(code)!
  if (pending.expiresAt < Date.now()) {
    pendingLinks.delete(code)
    return Response.json({ error: 'Code expired' }, { status: 410 })
  }

  // Generate API token
  const tokenId = randomBytes(16).toString('hex')
  await db.query(
    `INSERT INTO "ApiToken" (id, "userId", "createdAt", "name") VALUES ($1, $2, now(), $3)`,
    [tokenId, session.userId, 'VS Code']
  )

  const jwt = await new SignJWT({ userId: session.userId, tokenId, type: 'api' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('365d')
    .sign(API_TOKEN_SECRET)

  const token = `ntrl_${jwt}`
  pending.token = token
  pending.userId = session.userId

  return Response.json({ ok: true })
}

// GET: Extension polls for the token
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code || !pendingLinks.has(code)) return Response.json({ status: 'pending' })

  const pending = pendingLinks.get(code)!
  if (pending.expiresAt < Date.now()) {
    pendingLinks.delete(code)
    return Response.json({ status: 'expired' })
  }

  if (pending.token) {
    const token = pending.token
    pendingLinks.delete(code)
    return Response.json({ status: 'ready', token })
  }

  return Response.json({ status: 'pending' })
}
