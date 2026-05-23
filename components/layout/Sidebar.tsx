'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, X, Menu, PanelLeftClose, PanelLeft, MoreHorizontal, Pencil, Copy
} from 'lucide-react'
import { SearchIcon } from '@/components/ui/search'
import { SettingsIcon } from '@/components/ui/settings'
import { LogoutIcon } from '@/components/ui/logout'
import { MessageSquareIcon } from '@/components/ui/message-square'
import { useChatStore } from '@/lib/store/chat'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { useI18n } from '@/lib/i18n'
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
  const { t } = useI18n()
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
    const onClick = () => setMenuOpen(null)
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onClick)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('click', onClick) }
  }, [sidebarOpen, setSidebarOpen])

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )
  const groups = groupConversations(filtered)

  const handleNewChat = () => {
    router.push('/chat')
    if (isMobile) setSidebarOpen(false)
  }

  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const handleDelete = async (id: string) => {
    if (!confirm(t.chat.deleteConfirm)) return
    await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
    removeConversation(id)
    if (conversationId === id) router.push('/chat')
    setMenuOpen(null)
  }

  const handleRename = async (id: string) => {
    if (!renameValue.trim()) return
    await fetch(`/api/conversations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: renameValue.trim() }),
    })
    const convs = useChatStore.getState().conversations
    setConversations(convs.map(c => c.id === id ? { ...c, title: renameValue.trim() } : c))
    setRenaming(null)
    setMenuOpen(null)
  }

  const handleRemix = (id: string) => {
    const conv = conversations.find(c => c.id === id)
    if (conv) {
      router.push('/chat')
      // Will start a new chat with the same topic
      setTimeout(() => {
        const input = document.querySelector<HTMLTextAreaElement>('textarea')
        if (input) { input.value = conv.title; input.focus() }
      }, 300)
    }
    setMenuOpen(null)
    if (isMobile) setSidebarOpen(false)
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
              <div key={c.id} className="relative">
                {renaming === c.id ? (
                  <div className="flex items-center gap-1 px-3 py-1.5 mx-1.5">
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleRename(c.id); if (e.key === 'Escape') setRenaming(null) }}
                      className="flex-1 h-7 px-2 text-[13px] rounded border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:border-[var(--accent)]"
                    />
                    <button onClick={() => handleRename(c.id)} className="text-[11px] text-[var(--fg-muted)] hover:text-[var(--fg)]">✓</button>
                  </div>
                ) : (
                  <Link
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
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(menuOpen === c.id ? null : c.id) }}
                      aria-label="Options"
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[var(--bg-soft)] transition-all"
                    >
                      <MoreHorizontal size={13} />
                    </button>
                  </Link>
                )}

                {/* 3-dot menu dropdown */}
                <AnimatePresence>
                  {menuOpen === c.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-2 top-full mt-1 z-50 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg py-1 shadow-[var(--shadow-md)] min-w-[140px]"
                    >
                      <button
                        onClick={() => { setRenameValue(c.title); setRenaming(c.id); setMenuOpen(null) }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-[var(--fg-soft)] hover:bg-[var(--bg-soft)] transition-colors"
                      >
                        <Pencil size={11} /> {t.chat.rename}
                      </button>
                      <button
                        onClick={() => handleRemix(c.id)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-[var(--fg-soft)] hover:bg-[var(--bg-soft)] transition-colors"
                      >
                        <Copy size={11} /> {t.chat.remix}
                      </button>
                      <div className="h-px bg-[var(--border)] my-1 mx-2" />
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={11} /> {t.chat.delete}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
              {t.chat.newConversation}
            </span>
            <span className="kbd opacity-60 group-hover:opacity-100 transition-opacity">⌘N</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <div className="relative">
            <SearchIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] pointer-events-none" />
            <input
              type="text"
              placeholder={t.chat.search}
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
              <MessageSquareIcon size={16} className="text-[var(--fg-subtle)] mx-auto mb-2" />
              <p className="text-[12px] text-[var(--fg-muted)]">{t.chat.noConversations}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-12 text-center">
              <p className="text-[12px] text-[var(--fg-muted)]">{t.chat.noResults}</p>
            </div>
          ) : (
            <>
              {renderGroup(t.chat.today, groups.today)}
              {renderGroup(t.chat.yesterday, groups.yesterday)}
              {renderGroup(t.chat.last7days, groups.week)}
              {renderGroup(t.chat.last30days, groups.month)}
              {renderGroup(t.chat.older, groups.older)}
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
                  <SettingsIcon size={13} className="opacity-60" />
                  {t.chat.settings}
                  <span className="ml-auto kbd">⌘,</span>
                </button>
                <div className="h-px bg-[var(--border)] my-1 mx-2" />
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogoutIcon size={13} className="opacity-60" />
                  {t.chat.logout}
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
