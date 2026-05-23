import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ChatInterface } from '@/components/chat/ChatInterface'

export default async function ChatPage() {
  const session = await getSession()
  if (!session?.userId) redirect('/login')

  const { rows } = await db.query(`SELECT name, email FROM "User" WHERE id = $1`, [session.userId])
  const user = rows[0]

  return (
    <ChatInterface
      userInitial={user?.name?.[0] ?? user?.email[0]}
      userName={user?.name ?? undefined}
    />
  )
}
