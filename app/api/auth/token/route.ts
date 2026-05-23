import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { createSession } from '@/lib/session'
import { randomBytes } from 'crypto'

// Generate a token for the current user (used by VS Code extension)
export async function POST() {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // Generate a simple token (userId encoded)
  const token = `ntrl_${Buffer.from(session.userId).toString('base64url')}`
  return Response.json({ token })
}

// Verify a token (used by VS Code extension API calls)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token?.startsWith('ntrl_')) {
    return Response.json({ error: 'Invalid token' }, { status: 401 })
  }

  try {
    const userId = Buffer.from(token.replace('ntrl_', ''), 'base64url').toString()
    const { rows } = await db.query('SELECT id, email, plan FROM "User" WHERE id = $1', [userId])
    if (!rows[0]) return Response.json({ error: 'User not found' }, { status: 401 })
    return Response.json({ user: rows[0] })
  } catch {
    return Response.json({ error: 'Invalid token' }, { status: 401 })
  }
}
