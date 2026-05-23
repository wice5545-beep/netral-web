import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  let userId: string | undefined

  const session = await getSession()
  if (session?.userId) {
    userId = session.userId
  } else {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (token?.startsWith('ntrl_')) {
      try { userId = Buffer.from(token.replace('ntrl_', ''), 'base64url').toString() } catch {}
    }
  }
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { rows } = await db.query(
    `SELECT id, name, email, role, plan, "messagesUsed" FROM "User" WHERE id = $1`, [userId]
  )
  return Response.json({ user: rows[0] ?? null })
}
