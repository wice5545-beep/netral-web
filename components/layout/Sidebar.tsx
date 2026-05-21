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
      <div className="mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[var(--foreground-subtle)] px-3 mb-1">
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
                    ? 'bg-blue-50 dark:bg-[var(--border)] text-blue-700 dark:text-[var(--foreground)]'
                    : 'text-gray-600 dark:text-[var(--foreground-muted)] hover:bg-gray-100 dark:hover:bg-[var(--border)] hover:text-gray-900 dark:hover:text-[var(--foreground)]'
                )}
              >
                {c.pinned && <Pin size={11} className="shrink-0 text-blue-500" />}
                <span className="flex-1 truncate">{c.title}</span>
                <button
                  onClick={(e) => handleDelete(c.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 hover:text-red-600 transition-all"
                >
                  <Trash2 size={11} />
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{
          x: sidebarOpen ? 0 : isMobile ? '-100%' : 0,
          width: sidebarOpen ? 272 : isMobile ? 272 : 52,
        }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'fixed md:relative top-0 left-0 z-50 h-screen flex flex-col',
          'bg-[var(--sidebar-bg)] border-r border-gray-200 dark:border-[var(--border)]',
          'shrink-0 overflow-hidden'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-3 shrink-0">
          {sidebarOpen ? (
            <>
              <Link href="/chat" className="flex items-center gap-2 px-1">
                <NetralLogo size={22} />
                <span className="font-semibold tracking-tight text-gray-900 dark:text-[var(--foreground)]">Netral</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[var(--border)] text-gray-400 transition-colors"
              >
                {isMobile ? <X size={16} /> : <ChevronLeft size={16} />}
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="mx-auto p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[var(--border)] text-gray-400 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {sidebarOpen && (
          <>
            {/* Actions */}
            <div className="px-3 space-y-2 shrink-0">
              <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm shadow-blue-500/20"
              >
                <Plus size={14} />
                Nouvelle conversation
              </button>

              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 h-8.5 py-2 rounded-lg bg-white dark:bg-[var(--background-elevated)] border border-gray-200 dark:border-[var(--border)] text-sm text-gray-700 dark:text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-0 transition-all"
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
                  <MessageSquare size={18} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400">Aucune conversation.</p>
                  <p className="text-xs text-gray-300 mt-1">Commencez à chatter !</p>
                </div>
              ) : (
                <>
                  {renderGroup('Épinglés', groups.pinned)}
                  {renderGroup("Aujourd'hui", groups.today)}
                  {renderGroup('Hier', groups.yesterday)}
                  {renderGroup('7 derniers jours', groups.week)}
                  {renderGroup('30 derniers jours', groups.month)}
                  {renderGroup('Plus ancien', groups.older)}
                </>
              )}
            </div>

            {/* Profile */}
            <div className="p-2 border-t border-gray-200 dark:border-[var(--border)] shrink-0 relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[var(--border)] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-800 dark:text-[var(--foreground)] truncate">{user.name ?? 'Utilisateur'}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <MoreHorizontal size={14} className="text-gray-400 shrink-0" />
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-2 right-2 mb-1 bg-white dark:bg-[var(--background-elevated)] rounded-xl py-1 border border-gray-200 dark:border-[var(--border-strong)] shadow-xl"
                  >
                    <button
                      onClick={() => { setProfileMenuOpen(false); onOpenSettings() }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-[var(--foreground-secondary)] hover:bg-gray-50 dark:hover:bg-[var(--border)] transition-colors"
                    >
                      <Settings size={14} />
                      Paramètres
                    </button>
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} />
                      Se déconnecter
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
          className="fixed top-3 left-3 z-40 p-2 rounded-xl bg-white border border-gray-200 shadow-md"
        >
          <Menu size={18} className="text-gray-600" />
        </button>
      )}
    </>
  )
}
