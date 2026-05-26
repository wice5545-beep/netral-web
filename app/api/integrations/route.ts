import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session?.userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { rows } = await db.query(
    `SELECT id, provider, service, scope, "createdAt", "updatedAt" FROM "Integration" WHERE "userId" = $1`,
    [session.userId]
  )

  return NextResponse.json({ integrations: rows })
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { service } = await req.json().catch(() => ({}))
  if (!service) return NextResponse.json({ error: 'service requis' }, { status: 400 })

  await db.query(
    `DELETE FROM "Integration" WHERE "userId" = $1 AND service = $2`,
    [session.userId, service]
  )

  return NextResponse.json({ ok: true })
}
