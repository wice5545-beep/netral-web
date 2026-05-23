import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { rows } = await db.query(
    `SELECT id, name, email, role, plan, "messagesUsed" FROM "User" WHERE id = $1`, [session.userId]
  )
  return Response.json({ user: rows[0] ?? null })
}
