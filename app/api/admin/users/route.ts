import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

const UserIdSchema = z.string().uuid()
const UpdateUserSchema = z.object({
  userId: UserIdSchema,
  plan: z.enum(['free', 'pro', 'business', 'enterprise']).optional(),
  role: z.enum(['user', 'admin', 'ceo', 'banned']).optional(),
  banned: z.boolean().optional(),
  messagesUsed: z.number().int().min(0).max(1_000_000).optional(),
}).strict()
const DeleteUserSchema = z.object({ userId: UserIdSchema }).strict()

async function requireAdmin(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) return null
  const { rows } = await db.query(`SELECT role FROM "User" WHERE id = $1`, [session.userId])
  if (rows[0]?.role !== 'admin' && rows[0]?.role !== 'ceo') return null
  return session.userId
}

// GET: List all users
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { rows } = await db.query(
    `SELECT id, name, email, role, plan, "messagesUsed", "planExpiresAt", "createdAt" FROM "User" ORDER BY "createdAt" DESC LIMIT 100`
  )
  return Response.json({ users: rows })
}

// PUT: Update a user (change plan, ban, change role)
export async function PUT(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const parsed = UpdateUserSchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return Response.json({ error: 'Invalid payload' }, { status: 400 })
  const { userId, plan, role, banned, messagesUsed } = parsed.data

  if (userId === admin && (banned === true || role === 'banned')) {
    return Response.json({ error: 'Cannot ban yourself' }, { status: 400 })
  }

  const updates: string[] = []
  const values: any[] = []
  let idx = 1

  if (plan) { updates.push(`plan = $${idx}`); values.push(plan); idx++ }
  if (role) { updates.push(`role = $${idx}`); values.push(role); idx++ }
  if (banned !== undefined) { updates.push(`role = $${idx}`); values.push(banned ? 'banned' : 'user'); idx++ }
  if (messagesUsed !== undefined) { updates.push(`"messagesUsed" = $${idx}`); values.push(messagesUsed); idx++ }
  if (plan && plan !== 'free') {
    updates.push(`"planExpiresAt" = $${idx}`)
    values.push(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
    idx++
  }

  if (!updates.length) return Response.json({ error: 'Nothing to update' }, { status: 400 })

  values.push(userId)
  await db.query(`UPDATE "User" SET ${updates.join(', ')} WHERE id = $${idx}`, values)
  return Response.json({ ok: true })
}

// DELETE: Delete a user
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const parsed = DeleteUserSchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return Response.json({ error: 'Invalid payload' }, { status: 400 })
  const { userId } = parsed.data

  if (userId === admin) {
    return Response.json({ error: 'Cannot delete yourself' }, { status: 400 })
  }

  await db.query(`DELETE FROM "User" WHERE id = $1`, [userId])
  return Response.json({ ok: true })
}
