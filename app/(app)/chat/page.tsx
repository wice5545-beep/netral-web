import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ChatInterface } from '@/components/chat/ChatInterface'

export default async function ChatPage() {
  const session = await getSession()
  if (!session?.userId) redirect('/login')
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true },
  })
  return (
    <ChatInterface
      userInitial={user?.name?.[0] ?? user?.email[0]}
      userName={user?.name ?? undefined}
    />
  )
}
