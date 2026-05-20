import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.userId) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, onboarded: true },
  })

  if (!user) redirect('/login')
  if (!user.onboarded) redirect('/onboarding')

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      <Sidebar userName={user.name ?? undefined} userEmail={user.email} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar userName={user.name ?? undefined} />
        <main className="flex-1 overflow-y-auto p-6 bg-[var(--background-secondary)]">
          {children}
        </main>
      </div>
    </div>
  )
}
