import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { AppShell } from '@/components/layout/AppShell'

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.userId) redirect('/login')

  const { rows } = await db.query(
    `SELECT id, name, email, onboarded FROM "User" WHERE id = $1`,
    [session.userId]
  )
  const user = rows[0]
  if (!user) redirect('/login')
  if (!user.onboarded) redirect('/onboarding')

  return <AppShell user={user}>{children}</AppShell>
}
