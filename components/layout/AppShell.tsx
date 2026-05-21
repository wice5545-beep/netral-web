'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { SettingsModal } from '@/components/chat/SettingsModal'
import { ModelSelector } from '@/components/chat/ModelSelector'
import { useChatStore } from '@/lib/store/chat'
import { useEffect } from 'react'

interface AppShellProps {
  user: { id: string; name?: string | null; email: string }
  children: React.ReactNode
}

export function AppShell({ user, children }: AppShellProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { sidebarOpen, setSidebarOpen } = useChatStore()

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
        <header className="h-12 flex items-center justify-between px-3 md:px-4 border-b border-orange-100/60 dark:border-[var(--border)] shrink-0 bg-white/90 dark:bg-[var(--background-elevated)]/90 backdrop-blur-md">
          <div className="flex items-center gap-2 ml-10 md:ml-0">
            <ModelSelector />
          </div>
        </header>
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
