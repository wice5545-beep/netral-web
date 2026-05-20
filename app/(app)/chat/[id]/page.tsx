import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { ChatInterface } from '@/components/chat/ChatInterface'
import type { ChatMessage } from '@/lib/store/chat'

export default async function ChatConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  if (!session?.userId) redirect('/login')

  const conv = await prisma.conversation.findFirst({
    where: { id, userId: session.userId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        select: { id: true, role: true, content: true, createdAt: true },
      },
    },
  })

  if (!conv) notFound()

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true },
  })

  const initialMessages: ChatMessage[] = conv.messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
      createdAt: m.createdAt,
    }))

  return (
    <ChatInterface
      conversationId={conv.id}
      initialMessages={initialMessages}
      userInitial={user?.name?.[0] ?? user?.email[0]}
      userName={user?.name ?? undefined}
    />
  )
}
