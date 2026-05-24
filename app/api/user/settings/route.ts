import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

// GET: list user's active API tokens
export async function GET() {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { rows } = await db.query(
    `SELECT id, "createdAt" FROM "ApiToken" WHERE "userId" = $1 AND "revokedAt" IS NULL ORDER BY "createdAt" DESC`,
    [session.userId]
  )

  return Response.json({ tokens: rows })
}

// DELETE: revoke a specific token or all tokens
export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { tokenId } = body

  if (tokenId) {
    await db.query(
      `UPDATE "ApiToken" SET "revokedAt" = now() WHERE id = $1 AND "userId" = $2`,
      [tokenId, session.userId]
    )
  } else {
    await db.query(
      `UPDATE "ApiToken" SET "revokedAt" = now() WHERE "userId" = $1 AND "revokedAt" IS NULL`,
      [session.userId]
    )
  }

  return Response.json({ ok: true })
}
