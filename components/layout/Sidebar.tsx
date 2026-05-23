'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Settings, LogOut, ChevronLeft,
  MessageSquare, Trash2, MoreHorizontal, X, Menu, FolderOpen, Bot, Layers
} from 'lucide-react'
import { useChatStore } from '@/lib/store/chat'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { logout } from '@/actions/auth'
import { cn } from '@/lib/utils'

interface SidebarProps {
  user: { name?: string | null; email: string }
  onOpenSettings: () => void
}

function groupConversations(convs: ReturnType<typeof useChatStore.getState>['conversations']) {
  const now = new Date()
  const today: typeof convs = []
  const yesterday: typeof convs = []
  const week: typeof convs = []
  const month: typeof convs = []
  const older: typeof convs = []
  const pinned: typeof convs = []

  for (const c of convs) {
    if (c.pinned) { pinned.push(c); continue }
    const diff = (now.getTime() - new Date(c.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    if (diff < 1) today.push(c)
    else if (diff < 2) yesterday.push(c)
    else if (diff < 7) week.push(c)
    else if (diff < 30) month.push(c)
    else older.push(c)
  }
  return { pinned, today, yesterday, week, month, older }
}

export function Sidebar({ user, onOpenSettings }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { conversations, conversationId, sidebarOpen, setSidebarOpen, removeConversation, setConversations, conversationsLoaded } = useChatStore()
  const [search, setSearch] = useState('')
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (conversationsLoaded) return
    fetch('/api/conversations')
      .then((r) => r.json())
      .then((d) => setConversations(d.conversations ?? []))
      .catch(() => {})
  }, [conversationsLoaded, setConversations])

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )
  const groups = groupConversations(filtered)

  const handleNewChat = () => {
    router.push('/chat')
    if (isMobile) setSidebarOpen(false)
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Supprimer cette conversation ?')) return
    await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
    removeConversation(id)
    if (conversationId === id) router.push('/chat')
  }

  const renderGroup = (label: string, items: typeof conversations) => {
    if (items.length === 0) return null
    return (
      <div className="mb-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--foreground-subtle)] px-3 mb-1.5">
          {label}
        </p>
        <div className="space-y-0.5">
          {items.map((c) => {
            const isActive = pathname === `/chat/${c.id}` || conversationId === c.id
            return (
              <Link
                key={c.id}
                href={`/chat/${c.id}`}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={cn(
                  'group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors',
                  isActive
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-medium'
                    : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]'
                )}
              >
                <MessageSquare size={14} className="shrink-0 opacity-50" />
                <span className="flex-1 truncate">{c.title}</span>
                <button
                  onClick={(e) => handleDelete(c.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  const navItems = [
    { icon: Plus, label: 'Nouveau chat', onClick: handleNewChat },
    { icon: Search, label: 'Rechercher dans les chats', onClick: () => {} },
    { icon: FolderOpen, label: 'Projets', onClick: () => {} },
    { icon: Bot, label: 'Agents', onClick: () => {}, badge: 'BETA' },
    { icon: Layers, label: 'Plus', onClick: () => {} },
  ]

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{
          x: sidebarOpen ? 0 : isMobile ? '-100%' : 0,
          width: sidebarOpen ? 260 : isMobile ? 260 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'fixed md:relative top-0 left-0 z-50 h-screen flex flex-col shrink-0 overflow-hidden',
          'border-r border-[var(--border)]',
          'bg-[var(--sidebar-bg)]',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 shrink-0">
          <Link href="/chat" className="flex items-center gap-2">
            <NetralLogo size={24} />
            <span className="font-bold text-[15px] text-[var(--foreground)]">Netral</span>
          </Link>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-[var(--border)] text-[var(--foreground-muted)]">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Nav items */}
        <div className="px-3 space-y-0.5 pb-3 border-b border-[var(--border)]">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] transition-colors"
              >
                <Icon size={15} className="opacity-60" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[9px] font-bold uppercase tracking-wide text-[var(--accent)] bg-[var(--accent-soft)] px-1.5 py-0.5 rounded">{item.badge}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Recent label */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--foreground-subtle)]">Récents</p>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-2">
          {!conversationsLoaded ? (
            <div className="space-y-1 px-1 pt-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-8 rounded-lg" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-xs text-[var(--foreground-muted)]">Aucune conversation</p>
            </div>
          ) : (
            <>
              {renderGroup('', groups.pinned)}
              {renderGroup('', groups.today)}
              {renderGroup('', groups.yesterday)}
              {renderGroup('', groups.week)}
              {renderGroup('', groups.month)}
              {renderGroup('', groups.older)}
            </>
          )}
        </div>

        {/* Profile */}
        <div className="p-3 border-t border-[var(--border)] shrink-0 relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-medium text-[var(--foreground)] truncate">{user.name ?? 'User'}</p>
              <p className="text-[11px] text-[var(--foreground-muted)] truncate">Free</p>
            </div>
            <span className="text-[11px] text-[var(--accent)] font-medium">Mettre à niveau</span>
          </button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-2 right-2 mb-1 bg-[var(--background-elevated)] border border-[var(--border)] rounded-xl py-1 shadow-lg z-50"
              >
                <button
                  onClick={() => { setProfileMenuOpen(false); onOpenSettings() }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <Settings size={14} className="opacity-60" />
                  Paramètres
                </button>
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={14} className="opacity-60" />
                  Déconnexion
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Mobile toggle */}
      {!sidebarOpen && isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-3 left-3 z-40 p-2 rounded-lg bg-[var(--background-elevated)] border border-[var(--border)] shadow-sm"
        >
          <Menu size={18} className="text-[var(--foreground-muted)]" />
        </button>
      )}
    </>
  )
}
