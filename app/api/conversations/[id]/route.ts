import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/conversations/[id]'>) {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const conv = await prisma.conversation.findFirst({
    where: { id, userId: session.userId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        select: { id: true, role: true, content: true, model: true, createdAt: true },
      },
    },
  })

  if (!conv) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ conversation: conv })
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/conversations/[id]'>) {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const conv = await prisma.conversation.findFirst({ where: { id, userId: session.userId } })
  if (!conv) return Response.json({ error: 'Not found' }, { status: 404 })

  await prisma.conversation.delete({ where: { id } })
  return Response.json({ ok: true })
}

export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/conversations/[id]'>) {
  const session = await getSession()
  if (!session?.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const body = await req.json().catch(() => ({}))
  const { title, pinned } = body as { title?: string; pinned?: boolean }

  const conv = await prisma.conversation.findFirst({ where: { id, userId: session.userId } })
  if (!conv) return Response.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.conversation.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(pinned !== undefined ? { pinned } : {}),
    },
  })

  return Response.json({ conversation: updated })
}
