import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const memory = await prisma.memory.findUnique({ where: { userId: session.userId } })
  return Response.json({ memory })
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { fullName, profession, interests, tone, customInstructions } = body as {
    fullName?: string
    profession?: string
    interests?: string
    tone?: string
    customInstructions?: string
  }

  const memory = await prisma.memory.upsert({
    where: { userId: session.userId },
    update: {
      ...(fullName !== undefined ? { fullName } : {}),
      ...(profession !== undefined ? { profession } : {}),
      ...(interests !== undefined ? { interests } : {}),
      ...(tone !== undefined ? { tone } : {}),
      ...(customInstructions !== undefined ? { customInstructions } : {}),
    },
    create: {
      userId: session.userId,
      fullName: fullName ?? null,
      profession: profession ?? null,
      interests: interests ?? null,
      tone: tone ?? 'balanced',
      customInstructions: customInstructions ?? null,
    },
  })

  return Response.json({ memory })
}

export async function DELETE() {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.memory.deleteMany({ where: { userId: session.userId } })
  return Response.json({ ok: true })
}
