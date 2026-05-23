import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { rows } = await db.query(
    `SELECT id, title, model, pinned, "updatedAt", "createdAt" FROM "Conversation" WHERE "userId" = $1 ORDER BY "updatedAt" DESC LIMIT 100`,
    [session.userId]
  )

  return Response.json({ conversations: rows })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { title, model } = body as { title?: string; model?: string }

  const { rows } = await db.query(
    `INSERT INTO "Conversation" ("id", "userId", "title", "model", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, now(), now()) RETURNING *`,
    [session.userId, (title ?? 'Nouvelle conversation').slice(0, 200), (model ?? 'ntrl-1.3').slice(0, 50)]
  )

  return Response.json({ conversation: rows[0] })
}

export async function DELETE() {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await db.query(`DELETE FROM "Conversation" WHERE "userId" = $1`, [session.userId])
  return Response.json({ ok: true })
}
