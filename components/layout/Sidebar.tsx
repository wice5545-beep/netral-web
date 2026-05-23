'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  Plus, Search, Settings, LogOut, ChevronLeft, ChevronRight,
  MessageSquare, Trash2, Pin, MoreHorizontal, X, Menu, Sparkles
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

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.25, ease: 'easeOut' },
  }),
}

export function Sidebar({ user, onOpenSettings }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { conversations, conversationId, sidebarOpen, setSidebarOpen, removeConversation, setConversations, conversationsLoaded } = useChatStore()
  const [search, setSearch] = useState('')
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

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

  let globalIndex = 0
  const renderGroup = (label: string, items: typeof conversations) => {
    if (items.length === 0) return null
    return (
      <div className="mb-5">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--foreground-subtle)] px-3 mb-2 flex items-center gap-1.5"
        >
          <span className="w-3 h-px bg-[var(--foreground-subtle)]/40" />
          {label}
        </motion.p>
        <div className="space-y-0.5">
          {items.map((c) => {
            const isActive = pathname === `/chat/${c.id}` || conversationId === c.id
            const idx = globalIndex++
            return (
              <motion.div
                key={c.id}
                custom={idx}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  href={`/chat/${c.id}`}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  onMouseEnter={() => setHoveredId(c.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    'group relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 overflow-hidden',
                    isActive
                      ? 'text-[var(--accent)] font-medium'
                      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                  )}
                >
                  {/* Active/hover background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeConv"
                      className="absolute inset-0 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent)]/20"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                  {!isActive && hoveredId === c.id && (
                    <motion.div
                      layoutId="hoverConv"
                      className="absolute inset-0 rounded-xl bg-[var(--border)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2 flex-1 min-w-0">
                    {c.pinned && <Pin size={9} className="shrink-0 text-[var(--accent)]" />}
                    <span className="flex-1 truncate text-[13px]">{c.title}</span>
                  </span>

                  <button
                    onClick={(e) => handleDelete(c.id, e)}
                    className="relative z-10 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/15 hover:text-red-400 transition-all duration-150"
                  >
                    <Trash2 size={11} />
                  </button>
                </Link>
              </motion.div>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{
          x: sidebarOpen ? 0 : isMobile ? '-100%' : 0,
          width: sidebarOpen ? 268 : isMobile ? 268 : 56,
        }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'fixed md:relative top-0 left-0 z-50 h-screen flex flex-col shrink-0 overflow-hidden',
          'border-r border-[var(--glass-border)]',
          'bg-[var(--sidebar-bg)] backdrop-filter backdrop-blur-2xl',
        )}
      >
        {/* Subtle top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between h-[60px] px-3 shrink-0 border-b border-[var(--glass-border)]">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="open"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-between w-full"
              >
                <Link href="/chat" className="flex items-center gap-2.5 px-1 group">
                  <NetralLogo size={24} />
                  <span className="font-bold tracking-tight text-[var(--foreground)] text-[15px]">NTRL</span>
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-all duration-150"
                >
                  {isMobile ? <X size={15} /> : <ChevronLeft size={15} />}
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(true)}
                className="mx-auto p-1.5 rounded-lg hover:bg-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-all duration-150"
              >
                <ChevronRight size={15} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              {/* New chat + search */}
              <div className="px-3 pt-3 space-y-2 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNewChat}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-all duration-150 shadow-lg shadow-[var(--accent-glow)] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Plus size={14} />
                  New chat
                  <Sparkles size={12} className="ml-auto opacity-60" />
                </motion.button>

                <div className="relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                  <input
                    type="text"
                    placeholder="Search conversations…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 h-9 rounded-xl bg-[var(--border)]/60 border border-[var(--glass-border)] text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/30 transition-all"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto px-2 mt-4 pb-2">
                {!conversationsLoaded ? (
                  <div className="space-y-1.5 px-1">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="skeleton h-9 rounded-xl"
                      />
                    ))}
                  </div>
                ) : conversations.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-3 py-12 text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center mx-auto mb-3">
                      <MessageSquare size={18} className="text-[var(--accent)]" />
                    </div>
                    <p className="text-sm font-medium text-[var(--foreground-muted)]">No conversations yet</p>
                    <p className="text-xs text-[var(--foreground-subtle)] mt-1">Start a new chat above</p>
                  </motion.div>
                ) : (
                  <>
                    {renderGroup('Pinned', groups.pinned)}
                    {renderGroup('Today', groups.today)}
                    {renderGroup('Yesterday', groups.yesterday)}
                    {renderGroup('Last 7 days', groups.week)}
                    {renderGroup('Last 30 days', groups.month)}
                    {renderGroup('Older', groups.older)}
                  </>
                )}
              </div>

              {/* Profile */}
              <div className="p-2 border-t border-[var(--glass-border)] shrink-0 relative">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl hover:bg-[var(--border)]/60 transition-all duration-150"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[var(--sidebar-bg)]" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[13px] font-semibold text-[var(--foreground)] truncate">{user.name ?? 'User'}</p>
                    <p className="text-[11px] text-[var(--foreground-muted)] truncate">{user.email}</p>
                  </div>
                  <motion.div animate={{ rotate: profileMenuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <MoreHorizontal size={14} className="text-[var(--foreground-muted)] shrink-0" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute bottom-full left-2 right-2 mb-2 glass-panel rounded-2xl py-1.5 overflow-hidden z-50"
                    >
                      <button
                        onClick={() => { setProfileMenuOpen(false); onOpenSettings() }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-[var(--foreground-secondary)] hover:bg-[var(--border)]/60 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center">
                          <Settings size={13} className="text-[var(--accent)]" />
                        </div>
                        Settings
                      </button>
                      <div className="mx-3 my-1 h-px bg-[var(--glass-border)]" />
                      <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                          <LogOut size={13} className="text-red-400" />
                        </div>
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Mobile toggle */}
      <AnimatePresence>
        {!sidebarOpen && isMobile && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setSidebarOpen(true)}
            className="fixed top-3 left-3 z-40 p-2.5 rounded-xl glass border border-[var(--glass-border)] shadow-lg"
          >
            <Menu size={17} className="text-[var(--foreground-muted)]" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
