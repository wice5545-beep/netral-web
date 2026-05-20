import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const conversations = await prisma.conversation.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, model: true, pinned: true, updatedAt: true, createdAt: true },
    take: 100,
  })

  return Response.json({ conversations })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { title, model } = body as { title?: string; model?: string }

  const conv = await prisma.conversation.create({
    data: {
      userId: session.userId,
      title: title ?? 'New chat',
      model: model ?? 'ntrl-1.3',
    },
  })

  return Response.json({ conversation: conv })
}
