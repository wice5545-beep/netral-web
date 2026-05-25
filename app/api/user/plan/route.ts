import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

// GET: current plan info
export async function GET() {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { rows } = await db.query(
    `SELECT plan, "messagesUsed", "messagesResetAt", "planExpiresAt" FROM "User" WHERE id = $1`,
    [session.userId]
  )
  return Response.json({ plan: rows[0] ?? null })
}

// POST: upgrade plan — requires admin or payment verification
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // Check if user is admin (only admins can change plans for now)
  const { rows: userRows } = await db.query(`SELECT role FROM "User" WHERE id = $1`, [session.userId])
  if (userRows[0]?.role !== 'admin' && userRows[0]?.role !== 'ceo') {
    return Response.json({ error: 'Contactez-nous pour changer de plan : support@netral.app' }, { status: 403 })
  }

  const { plan, userId } = await req.json().catch(() => ({ plan: null, userId: null }))
  const targetUser = userId || session.userId
  const VALID_PLANS = ['free', 'plus', 'pro', 'pro_plus']

  if (!plan || !VALID_PLANS.includes(plan)) {
    return Response.json({ error: 'Plan invalide' }, { status: 400 })
  }

  const expiresAt = plan === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  await db.query(
    `UPDATE "User" SET plan = $1, "planExpiresAt" = $2, "messagesUsed" = 0 WHERE id = $3`,
    [plan, expiresAt, targetUser]
  )

  return Response.json({ ok: true, plan, expiresAt })
}
