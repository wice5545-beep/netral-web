import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

async function requireAdmin() {
  const session = await getSession()
  if (!session?.userId) return null
  const { rows } = await db.query(`SELECT role FROM "User" WHERE id = $1`, [session.userId])
  if (!['admin', 'ceo'].includes(rows[0]?.role)) return null
  return session.userId
}

// POST: Set plan by email
// Body: { email, plan, months? }
export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { email, plan, months = 12 } = await req.json().catch(() => ({}))
  if (!email || !plan) return Response.json({ error: 'email and plan required' }, { status: 400 })

  const validPlans = ['free', 'plus', 'pro', 'pro_plus']
  if (!validPlans.includes(plan)) return Response.json({ error: 'Invalid plan' }, { status: 400 })

  const planExpiresAt = plan === 'free' ? null : new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000)

  const { rows } = await db.query(
    `UPDATE "User"
     SET plan = $1, "planExpiresAt" = $2, "messagesUsed" = 0, "messagesResetAt" = NOW() + INTERVAL '2 days'
     WHERE email = $3
     RETURNING id, email, plan, "planExpiresAt"`,
    [plan, planExpiresAt, email.toLowerCase()]
  )

  if (!rows[0]) return Response.json({ error: 'User not found' }, { status: 404 })

  return Response.json({ ok: true, user: rows[0] })
}
