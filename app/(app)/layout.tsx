import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.userId) redirect('/login')

  const { rows } = await db.query(
    `SELECT id, name, email, onboarded FROM "User" WHERE id = $1`,
    [session.userId]
  )
  if (!rows[0]) redirect('/login')

  return <>{children}</>
}
