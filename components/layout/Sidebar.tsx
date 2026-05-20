'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Settings, LogOut, ChevronLeft, ChevronRight,
  MessageSquare, Trash2, Pin, MoreHorizontal, X, Menu
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
    if (c.pinned) {
      pinned.push(c)
      continue
    }
    const date = new Date(c.updatedAt)
    const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
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
    if (!confirm('Delete this conversation?')) return
    await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
    removeConversation(id)
    if (conversationId === id) router.push('/chat')
  }

  const renderGroup = (label: string, items: typeof conversations) => {
    if (items.length === 0) return null
    return (
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] px-3 mb-1.5">
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
                  'group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                  isActive
                    ? 'bg-[var(--border)] text-[var(--foreground)]'
                    : 'text-[var(--foreground-muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]'
                )}
              >
                {c.pinned && <Pin size={11} className="shrink-0 text-[var(--accent)]" />}
                <span className="flex-1 truncate">{c.title}</span>
                <button
                  onClick={(e) => handleDelete(c.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 hover:text-red-500 transition-all"
                  aria-label="Delete"
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

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{
          x: sidebarOpen ? 0 : isMobile ? '-100%' : 0,
          width: sidebarOpen ? 280 : isMobile ? 280 : 56,
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'fixed md:relative top-0 left-0 z-50 h-screen flex flex-col',
          'glass-strong border-r border-[var(--border)]',
          'shrink-0 overflow-hidden'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-3 shrink-0">
          {sidebarOpen ? (
            <>
              <Link href="/chat" className="flex items-center gap-2 px-2">
                <NetralLogo size={22} />
                <span className="font-semibold tracking-tight">Netral</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--border)] text-[var(--foreground-muted)]"
              >
                {isMobile ? <X size={16} /> : <ChevronLeft size={16} />}
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="mx-auto p-1.5 rounded-lg hover:bg-[var(--border)] text-[var(--foreground-muted)]"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {sidebarOpen && (
          <>
            {/* Actions */}
            <div className="px-3 space-y-1.5 shrink-0">
              <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity"
              >
                <Plus size={14} />
                New chat
              </button>

              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" />
                <input
                  type="text"
                  placeholder="Search conversations…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-2 h-9 rounded-lg bg-[var(--background-elevated)] border border-[var(--border)] text-sm placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto px-2 mt-3">
              {!conversationsLoaded ? (
                <div className="space-y-1.5 px-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton h-8 rounded-lg" />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <MessageSquare size={20} className="mx-auto text-[var(--foreground-subtle)] mb-2" />
                  <p className="text-xs text-[var(--foreground-muted)]">No conversations yet.</p>
                  <p className="text-xs text-[var(--foreground-subtle)] mt-1">Start chatting to see them here.</p>
                </div>
              ) : (
                <>
                  {renderGroup('Pinned', groups.pinned)}
                  {renderGroup('Today', groups.today)}
                  {renderGroup('Yesterday', groups.yesterday)}
                  {renderGroup('Previous 7 days', groups.week)}
                  {renderGroup('Previous 30 days', groups.month)}
                  {renderGroup('Older', groups.older)}
                </>
              )}
            </div>

            {/* Profile */}
            <div className="p-2 border-t border-[var(--border)] shrink-0 relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[var(--border)] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--gradient-1)] to-[var(--gradient-2)] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate">{user.name ?? 'User'}</p>
                  <p className="text-xs text-[var(--foreground-muted)] truncate">{user.email}</p>
                </div>
                <MoreHorizontal size={14} className="text-[var(--foreground-muted)] shrink-0" />
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-2 right-2 mb-1 glass-strong rounded-xl py-1 border border-[var(--border-strong)] shadow-2xl"
                  >
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false)
                        onOpenSettings()
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--border)] transition-colors"
                    >
                      <Settings size={14} />
                      Settings
                    </button>
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--border)] text-red-500 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </motion.aside>

      {/* Mobile toggle */}
      {!sidebarOpen && isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-3 left-3 z-40 p-2 rounded-lg glass-strong"
        >
          <Menu size={18} />
        </button>
      )}
    </>
  )
}
