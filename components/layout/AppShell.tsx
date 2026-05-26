'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Sidebar } from '@/components/layout/Sidebar'

const SettingsModal = dynamic(() => import('@/components/chat/SettingsModal').then(m => ({ default: m.SettingsModal })), { ssr: false })
import { useChatStore } from '@/lib/store/chat'

interface AppShellProps {
  user: { id: string; name?: string | null; email: string }
  children: React.ReactNode
}

export function AppShell({ user, children }: AppShellProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { setSidebarOpen } = useChatStore()

  // Keyboard shortcuts
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false)
    }
    onResize()
    window.addEventListener('resize', onResize)

    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault()
        setSettingsOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex h-screen bg-[var(--bg)] overflow-hidden">
      <div className="grain-paper" />
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
