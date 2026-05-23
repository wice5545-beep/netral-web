import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/conversations/[id]'>) {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const { rows: convRows } = await db.query(
    `SELECT * FROM "Conversation" WHERE id = $1 AND "userId" = $2`,
    [id, session.userId]
  )
  if (!convRows[0]) return Response.json({ error: 'Not found' }, { status: 404 })

  const { rows: messages } = await db.query(
    `SELECT id, role, content, model, "createdAt" FROM "Message" WHERE "conversationId" = $1 ORDER BY "createdAt" ASC`,
    [id]
  )

  return Response.json({ conversation: { ...convRows[0], messages } })
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/conversations/[id]'>) {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const { rowCount } = await db.query(
    `DELETE FROM "Conversation" WHERE id = $1 AND "userId" = $2`,
    [id, session.userId]
  )
  if (!rowCount) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ ok: true })
}

export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/conversations/[id]'>) {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const body = await req.json().catch(() => ({}))
  const { title, pinned } = body as { title?: string; pinned?: boolean }

  const sets: string[] = []
  const vals: unknown[] = []
  let idx = 1

  if (title !== undefined) { sets.push(`title = $${idx++}`); vals.push(title) }
  if (pinned !== undefined) { sets.push(`pinned = $${idx++}`); vals.push(pinned) }
  if (!sets.length) return Response.json({ error: 'Nothing to update' }, { status: 400 })

  vals.push(id, session.userId)
  const { rows } = await db.query(
    `UPDATE "Conversation" SET ${sets.join(', ')} WHERE id = $${idx++} AND "userId" = $${idx} RETURNING *`,
    vals
  )
  if (!rows[0]) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ conversation: rows[0] })
}
