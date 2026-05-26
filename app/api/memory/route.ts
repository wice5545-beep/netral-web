import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

// Strip HTML tags and limit length
function sanitize(input: string | undefined, maxLen: number): string | undefined {
  if (input === undefined) return undefined
  return input.replace(/<[^>]*>/g, '').trim().slice(0, maxLen)
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { rows } = await db.query(`SELECT * FROM "Memory" WHERE "userId" = $1`, [session.userId])
    return Response.json({ memory: rows[0] ?? null })
  } catch (e: any) {
    console.error('[GET /api/memory]', e)
    return Response.json({ memory: null, error: e?.message }, { status: 200 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const raw = body as { fullName?: string; profession?: string; interests?: string; tone?: string; customInstructions?: string }

    const fullName = sanitize(raw.fullName, 100)
    const profession = sanitize(raw.profession, 200)
    const interests = sanitize(raw.interests, 300)
    const tone = raw.tone && ['balanced', 'concise', 'friendly', 'technical', 'creative'].includes(raw.tone) ? raw.tone : undefined
    const customInstructions = sanitize(raw.customInstructions, 2000)

    const { rows: existing } = await db.query(`SELECT id FROM "Memory" WHERE "userId" = $1`, [session.userId])
    let memory
    if (existing[0]) {
      const sets: string[] = []
      const vals: unknown[] = []
      let idx = 1
      if (fullName !== undefined) { sets.push(`"fullName" = $${idx++}`); vals.push(fullName) }
      if (profession !== undefined) { sets.push(`profession = $${idx++}`); vals.push(profession) }
      if (interests !== undefined) { sets.push(`interests = $${idx++}`); vals.push(interests) }
      if (tone !== undefined) { sets.push(`tone = $${idx++}`); vals.push(tone) }
      if (customInstructions !== undefined) { sets.push(`"customInstructions" = $${idx++}`); vals.push(customInstructions) }
      if (sets.length) {
        sets.push(`"updatedAt" = now()`)
        vals.push(session.userId)
        const { rows } = await db.query(`UPDATE "Memory" SET ${sets.join(', ')} WHERE "userId" = $${idx} RETURNING *`, vals)
        memory = rows[0]
      } else {
        memory = existing[0]
      }
    } else {
      const { rows } = await db.query(
        `INSERT INTO "Memory" (id, "userId", "fullName", profession, interests, tone, "customInstructions", "updatedAt") VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, now()) RETURNING *`,
        [session.userId, fullName ?? null, profession ?? null, interests ?? null, tone ?? 'balanced', customInstructions ?? null]
      )
      memory = rows[0]
    }

    return Response.json({ memory })
  } catch (e: any) {
    console.error('[PATCH /api/memory]', e)
    return Response.json({ error: 'Failed to save', detail: e?.message }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await getSession()
    if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    await db.query(`DELETE FROM "Memory" WHERE "userId" = $1`, [session.userId])
    return Response.json({ ok: true })
  } catch (e: any) {
    console.error('[DELETE /api/memory]', e)
    return Response.json({ error: 'Failed to delete', detail: e?.message }, { status: 500 })
  }
}
