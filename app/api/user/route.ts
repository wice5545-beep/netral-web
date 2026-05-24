import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { verifyApiToken } from '@/lib/api-token'

export async function GET(req: NextRequest) {
  let userId: string | undefined

  const session = await getSession()
  if (session?.userId) {
    userId = session.userId
  } else {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (token) {
      const payload = await verifyApiToken(token)
      if (payload) userId = payload.userId
    }
  }
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { rows } = await db.query(
    `SELECT id, name, email, role, plan, "messagesUsed", "messagesResetAt", "planExpiresAt" FROM "User" WHERE id = $1`, [userId]
  )
  const user = rows[0]
  if (user && user.planExpiresAt && new Date(user.planExpiresAt) < new Date() && user.plan !== 'free') {
    user.plan = 'free'
    user.planExpiresAt = null
    await db.query(`UPDATE "User" SET plan = 'free', "planExpiresAt" = NULL WHERE id = $1`, [userId])
  }
  return Response.json({ user: user ?? null })
}
