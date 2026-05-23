'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Settings, LogOut, MessageSquare, Trash2,
  X, Menu, PanelLeftClose, PanelLeft
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

  for (const c of convs) {
    const diff = (now.getTime() - new Date(c.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    if (diff < 1) today.push(c)
    else if (diff < 2) yesterday.push(c)
    else if (diff < 7) week.push(c)
    else if (diff < 30) month.push(c)
    else older.push(c)
  }
  return { today, yesterday, week, month, older }
}

export function Sidebar({ user, onOpenSettings }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { conversations, conversationId, sidebarOpen, setSidebarOpen, removeConversation, setConversations, conversationsLoaded } = useChatStore()
  const [search, setSearch] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
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

  // Keyboard shortcut: ⌘B to toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        setSidebarOpen(!sidebarOpen)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sidebarOpen, setSidebarOpen])

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
        <p className="px-3 mb-1 text-[11px] font-medium text-[var(--fg-subtle)]">{label}</p>
        <div className="space-y-px">
          {items.map((c) => {
            const isActive = pathname === `/chat/${c.id}` || conversationId === c.id
            return (
              <Link
                key={c.id}
                href={`/chat/${c.id}`}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={cn(
                  'group flex items-center gap-2 px-3 py-1.5 mx-1.5 rounded-md text-[13px] transition-colors',
                  isActive
                    ? 'bg-[var(--bg)] text-[var(--fg)] shadow-[var(--shadow-xs)] border border-[var(--border)]'
                    : 'text-[var(--fg-soft)] hover:bg-[var(--bg)]'
                )}
              >
                <span className="flex-1 truncate">{c.title}</span>
                <button
                  onClick={(e) => handleDelete(c.id, e)}
                  aria-label="Supprimer"
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-all"
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
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{
          x: sidebarOpen ? 0 : isMobile ? '-100%' : 0,
          width: sidebarOpen ? 260 : isMobile ? 260 : 0,
        }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'fixed md:relative top-0 left-0 z-50 h-screen flex flex-col shrink-0 overflow-hidden',
          'border-r border-[var(--border)] bg-[var(--sidebar-bg)]'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-12 px-3 shrink-0">
          <Link href="/chat" className="flex items-center gap-2 px-1.5">
            <NetralLogo size={22} />
            <span className="font-semibold text-[14px]">Netral</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md hover:bg-[var(--bg)] text-[var(--fg-muted)] transition-colors"
            aria-label="Fermer"
          >
            {isMobile ? <X size={15} /> : <PanelLeftClose size={15} />}
          </button>
        </div>

        {/* New chat */}
        <div className="px-3 pb-2">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[13px] font-medium text-[var(--fg)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] transition-all shadow-[var(--shadow-xs)] group"
          >
            <span className="flex items-center gap-2">
              <Plus size={14} strokeWidth={2.2} />
              Nouvelle conversation
            </span>
            <span className="kbd opacity-60 group-hover:opacity-100 transition-opacity">⌘N</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-md bg-transparent border border-transparent text-[13px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] hover:bg-[var(--bg)] focus:outline-none focus:border-[var(--border)] focus:bg-[var(--bg)] transition-all"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto pb-2">
          {!conversationsLoaded ? (
            <div className="space-y-1 px-3 pt-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-7" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-3 py-12 text-center">
              <MessageSquare size={16} className="text-[var(--fg-subtle)] mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-[12px] text-[var(--fg-muted)]">Aucune conversation</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-12 text-center">
              <p className="text-[12px] text-[var(--fg-muted)]">Aucun résultat</p>
            </div>
          ) : (
            <>
              {renderGroup("Aujourd'hui", groups.today)}
              {renderGroup('Hier', groups.yesterday)}
              {renderGroup('7 derniers jours', groups.week)}
              {renderGroup('30 derniers jours', groups.month)}
              {renderGroup('Plus ancien', groups.older)}
            </>
          )}
        </div>

        {/* Profile */}
        <div className="border-t border-[var(--border)] shrink-0 relative p-2">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-[var(--bg)] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-[var(--bg)] flex items-center justify-center text-[12px] font-semibold shrink-0">
              {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-medium text-[var(--fg)] truncate">{user.name ?? 'Utilisateur'}</p>
              <p className="text-[11px] text-[var(--fg-muted)] truncate">{user.email}</p>
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-2 right-2 mb-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md py-1 shadow-[var(--shadow-md)] z-50"
              >
                <button
                  onClick={() => { setProfileOpen(false); onOpenSettings() }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--fg-soft)] hover:bg-[var(--bg-soft)] transition-colors"
                >
                  <Settings size={13} strokeWidth={1.8} className="opacity-60" />
                  Paramètres
                  <span className="ml-auto kbd">⌘,</span>
                </button>
                <div className="h-px bg-[var(--border)] my-1 mx-2" />
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={13} strokeWidth={1.8} className="opacity-60" />
                  Déconnexion
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Toggle button when sidebar closed */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(true)}
            className="fixed top-3 left-3 z-40 p-2 rounded-md bg-[var(--bg-elevated)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
            aria-label="Ouvrir"
          >
            {isMobile ? <Menu size={15} /> : <PanelLeft size={15} />}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
