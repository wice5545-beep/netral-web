import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { ensureTables } from '@/lib/db-init'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    await ensureTables()

    const { rows } = await db.query(
      `SELECT id, provider, service, scope, "createdAt", "updatedAt" FROM "Integration" WHERE "userId" = $1`,
      [session.userId]
    )

    return NextResponse.json({ integrations: rows })
  } catch (e: any) {
    console.error('[GET /api/integrations]', e)
    // Return empty array on error instead of 500 — better UX
    return NextResponse.json({ integrations: [], error: e?.message }, { status: 200 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { service } = await req.json().catch(() => ({}))
    if (!service) return NextResponse.json({ error: 'service requis' }, { status: 400 })

    await db.query(
      `DELETE FROM "Integration" WHERE "userId" = $1 AND service = $2`,
      [session.userId, service]
    )

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[DELETE /api/integrations]', e)
    return NextResponse.json({ error: 'Failed to delete', detail: e?.message }, { status: 500 })
  }
}
