import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

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

  const { userId, plan, role, banned, messagesUsed } = await req.json().catch(() => ({}))
  if (!userId) return Response.json({ error: 'userId required' }, { status: 400 })

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

  const { userId } = await req.json().catch(() => ({}))
  if (!userId) return Response.json({ error: 'userId required' }, { status: 400 })

  await db.query(`DELETE FROM "User" WHERE id = $1`, [userId])
  return Response.json({ ok: true })
}
