import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

const CreateConversationSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  model: z.string().trim().regex(/^[a-zA-Z0-9._:-]{1,50}$/).optional(),
}).strict()

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

  const parsed = CreateConversationSchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return Response.json({ error: 'Invalid payload' }, { status: 400 })
  const { title, model } = parsed.data

  const { rows } = await db.query(
    `INSERT INTO "Conversation" ("id", "userId", "title", "model", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, now(), now()) RETURNING *`,
    [session.userId, title ?? 'Nouvelle conversation', model ?? 'ntrl-1.3']
  )

  return Response.json({ conversation: rows[0] })
}

export async function DELETE() {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await db.query(`DELETE FROM "Conversation" WHERE "userId" = $1`, [session.userId])
  return Response.json({ ok: true })
}
