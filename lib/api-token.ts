import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { db } from '@/lib/db'

const API_TOKEN_SECRET = new TextEncoder().encode(process.env.API_TOKEN_SECRET || process.env.SESSION_SECRET || 'fallback')

export async function verifyApiToken(token: string): Promise<{ userId: string; tokenId: string } | null> {
  if (!token.startsWith('ntrl_')) return null
  try {
    const jwt = token.slice(5)
    const { payload } = await jwtVerify(jwt, API_TOKEN_SECRET, { algorithms: ['HS256'] })
    if (payload.type !== 'api' || !payload.userId || !payload.tokenId) return null

    // Check not revoked
    const { rows } = await db.query(
      `SELECT id FROM "ApiToken" WHERE id = $1 AND "userId" = $2 AND "revokedAt" IS NULL`,
      [payload.tokenId, payload.userId]
    )
    if (!rows[0]) return null

    return { userId: payload.userId as string, tokenId: payload.tokenId as string }
  } catch {
    return null
  }
}
