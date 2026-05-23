import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { ChatInterface } from '@/components/chat/ChatInterface'
import type { ChatMessage } from '@/lib/store/chat'

export default async function ChatConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()
  if (!session?.userId) redirect('/login')

  const { rows: convRows } = await db.query(
    `SELECT * FROM "Conversation" WHERE id = $1 AND "userId" = $2`, [id, session.userId]
  )
  if (!convRows[0]) notFound()

  const { rows: msgRows } = await db.query(
    `SELECT id, role, content, "createdAt" FROM "Message" WHERE "conversationId" = $1 ORDER BY "createdAt" ASC`, [id]
  )

  const { rows: userRows } = await db.query(`SELECT name, email FROM "User" WHERE id = $1`, [session.userId])
  const user = userRows[0]

  const initialMessages: ChatMessage[] = msgRows
    .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
    .map((m: { id: string; role: string; content: string; createdAt: Date }) => ({
      id: m.id, role: m.role as 'user' | 'assistant', content: m.content, createdAt: m.createdAt,
    }))

  return (
    <ChatInterface
      conversationId={convRows[0].id}
      initialMessages={initialMessages}
      userInitial={user?.name?.[0] ?? user?.email[0]}
      userName={user?.name ?? undefined}
    />
  )
}
