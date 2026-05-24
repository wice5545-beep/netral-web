import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

const VALID_PLANS = ['free', 'plus', 'pro', 'pro_plus']

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

// POST: upgrade/downgrade plan
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await req.json().catch(() => ({ plan: null }))
  if (!plan || !VALID_PLANS.includes(plan)) {
    return Response.json({ error: 'Plan invalide' }, { status: 400 })
  }

  // For now: direct plan change (no payment — manual/admin managed)
  // In production: integrate Stripe here
  const expiresAt = plan === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  await db.query(
    `UPDATE "User" SET plan = $1, "planExpiresAt" = $2, "messagesUsed" = 0, "messagesResetAt" = $3 WHERE id = $4`,
    [plan, expiresAt, new Date(Date.now() + (plan === 'free' ? 30 : 2) * 24 * 60 * 60 * 1000), session.userId]
  )

  return Response.json({ ok: true, plan, expiresAt })
}
