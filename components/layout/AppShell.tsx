'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { SettingsModal } from '@/components/chat/SettingsModal'
import { useChatStore } from '@/lib/store/chat'
import { useEffect } from 'react'

interface AppShellProps {
  user: { id: string; name?: string | null; email: string }
  children: React.ReactNode
}

export function AppShell({ user, children }: AppShellProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { setSidebarOpen } = useChatStore()

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      <Sidebar
        user={{ name: user.name, email: user.email }}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
      />
    </div>
  )
}
