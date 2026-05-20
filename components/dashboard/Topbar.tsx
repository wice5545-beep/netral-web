'use client'

import { Bell, Search } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { logout } from '@/actions/auth'
import { useState } from 'react'

interface TopbarProps {
  userName?: string
  pageName?: string
}

export function Topbar({ userName, pageName = 'Dashboard' }: TopbarProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--background)] flex items-center px-6 gap-4 shrink-0">
      <h1 className="text-sm font-semibold text-[var(--foreground)] flex-1">{pageName}</h1>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
          <Search size={18} />
        </button>
        <button className="p-2 rounded-xl hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
        </button>
        <ThemeToggle />
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition-opacity"
          >
            {userName?.[0]?.toUpperCase() ?? 'U'}
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 w-48 bg-[var(--card)] border border-[var(--card-border)] rounded-xl shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-[var(--border)]">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">{userName}</p>
              </div>
              <a href="/settings" className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)]">
                Settings
              </a>
              <button
                onClick={() => logout()}
                className="w-full text-left px-4 py-2 text-sm text-[var(--danger)] hover:bg-[var(--background-secondary)]"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
