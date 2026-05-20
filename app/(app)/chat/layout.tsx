import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { AppShell } from '@/components/layout/AppShell'

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.userId) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, onboarded: true },
  })

  if (!user) redirect('/login')
  if (!user.onboarded) redirect('/onboarding')

  return <AppShell user={user}>{children}</AppShell>
}
