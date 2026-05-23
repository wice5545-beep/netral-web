'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  Plus, Search, Settings, LogOut, MessageSquare, Trash2,
  MoreHorizontal, X, Menu, FolderOpen, Bot, Layers, Sparkles, Globe, Zap, ChevronDown
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

const menuItemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: 'easeOut' },
  }),
}

export function Sidebar({ user, onOpenSettings }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { conversations, conversationId, sidebarOpen, setSidebarOpen, removeConversation, setConversations, conversationsLoaded } = useChatStore()
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [agentsOpen, setAgentsOpen] = useState(false)

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
        {label && (
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-subtle)] px-4 mb-2">
            {label}
          </p>
        )}
        <div className="space-y-0.5 px-2">
          {items.map((c, idx) => {
            const isActive = pathname === `/chat/${c.id}` || conversationId === c.id
            return (
              <motion.div
                key={c.id}
                custom={idx}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  href={`/chat/${c.id}`}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200',
                    isActive
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-medium'
                      : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]'
                  )}
                >
                  <MessageSquare size={13} className="shrink-0 opacity-40" />
                  <span className="flex-1 truncate">{c.title}</span>
                  <button
                    onClick={(e) => handleDelete(c.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-all"
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
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{
          x: sidebarOpen ? 0 : isMobile ? '-100%' : 0,
          width: sidebarOpen ? 280 : isMobile ? 280 : 0,
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed md:relative top-0 left-0 z-50 h-screen flex flex-col shrink-0 overflow-hidden',
          'border-r border-[var(--border)]',
          'bg-[var(--sidebar-bg)]',
        )}
      >
        {/* Decorative top line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border-accent)] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between h-[60px] px-5 shrink-0">
          <Link href="/chat" className="flex items-center gap-2.5">
            <NetralLogo size={26} />
            <span className="font-display text-[17px] text-[var(--foreground)]">Netral</span>
          </Link>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] transition-colors">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Nav items */}
        <div className="px-3 space-y-0.5 pb-4 pt-1">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)] transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow">
              <Plus size={14} />
            </div>
            <span>Nouveau chat</span>
          </motion.button>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground-secondary)] transition-all"
          >
            <Search size={15} className="opacity-50" />
            <span>Rechercher</span>
            <span className="ml-auto text-[10px] text-[var(--foreground-subtle)] bg-[var(--background-secondary)] px-1.5 py-0.5 rounded">⌘K</span>
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground-secondary)] transition-all"
          >
            <FolderOpen size={15} className="opacity-50" />
            <span>Projets</span>
          </button>

          <button
            onClick={() => setAgentsOpen(!agentsOpen)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground-secondary)] transition-all"
          >
            <Bot size={15} className="opacity-50" />
            <span>Agents</span>
            <span className="ml-auto text-[9px] font-bold uppercase tracking-wide text-[var(--accent)] bg-[var(--accent-soft)] px-1.5 py-0.5 rounded">BETA</span>
            <motion.div animate={{ rotate: agentsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={12} className="opacity-40" />
            </motion.div>
          </button>

          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground-secondary)] transition-all"
          >
            <Layers size={15} className="opacity-50" />
            <span>Plus</span>
            <motion.div animate={{ rotate: moreOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={12} className="opacity-40 ml-auto" />
            </motion.div>
          </button>
        </div>

        {/* Search input */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden px-3"
            >
              <div className="py-2">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Agents panel */}
        <AnimatePresence>
          {agentsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden px-3"
            >
              <div className="py-3 space-y-1.5 border-t border-[var(--border)] mt-2">
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-subtle)] px-1 mb-2">Agents disponibles</p>
                {[
                  { name: 'Recherche Web', desc: 'Synthèse d\'informations', icon: Globe, bg: 'bg-blue-50', fg: 'text-blue-600' },
                  { name: 'Rédacteur', desc: 'Création de contenu', icon: Sparkles, bg: 'bg-purple-50', fg: 'text-purple-600' },
                  { name: 'Analyste', desc: 'Analyse de données', icon: Zap, bg: 'bg-amber-50', fg: 'text-amber-600' },
                ].map((agent) => {
                  const Icon = agent.icon
                  return (
                    <button
                      key={agent.name}
                      onClick={() => { setAgentsOpen(false); handleNewChat() }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--background-secondary)] transition-all text-left group"
                    >
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', agent.bg, agent.fg)}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{agent.name}</p>
                        <p className="text-[11px] text-[var(--foreground-muted)] truncate">{agent.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* More panel */}
        <AnimatePresence>
          {moreOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden px-3"
            >
              <div className="py-3 space-y-0.5 border-t border-[var(--border)] mt-2">
                {[
                  { label: 'Bibliothèque de prompts' },
                  { label: 'Historique complet' },
                  { label: 'Statistiques' },
                  { label: 'Aide & FAQ' },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full text-left px-4 py-2 rounded-xl text-[12px] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground-secondary)] transition-all"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="mx-4 h-px bg-[var(--border)] my-2" />

        {/* Recent label */}
        <div className="px-4 pt-2 pb-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-subtle)]">Récents</p>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {!conversationsLoaded ? (
            <div className="space-y-1.5 px-4 pt-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-9 rounded-xl" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <div className="w-10 h-10 rounded-xl bg-[var(--background-secondary)] flex items-center justify-center mx-auto mb-3">
                <MessageSquare size={16} className="text-[var(--foreground-subtle)]" />
              </div>
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--background-secondary)] transition-all"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--gradient-3)] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[var(--sidebar-bg)]" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-medium text-[var(--foreground)] truncate">{user.name ?? 'User'}</p>
              <p className="text-[11px] text-[var(--foreground-muted)]">Free</p>
            </div>
            <span className="text-[10px] text-[var(--accent)] font-medium bg-[var(--accent-soft)] px-2 py-0.5 rounded-full">Pro</span>
          </button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-full left-3 right-3 mb-2 bg-[var(--background-elevated)] border border-[var(--border)] rounded-xl py-1.5 shadow-lg z-50"
              >
                <button
                  onClick={() => { setProfileMenuOpen(false); onOpenSettings() }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <Settings size={14} className="opacity-50" />
                  Paramètres
                </button>
                <div className="mx-3 my-1 h-px bg-[var(--border)]" />
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={14} className="opacity-50" />
                  Déconnexion
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Mobile toggle */}
      <AnimatePresence>
        {!sidebarOpen && isMobile && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-[var(--background-elevated)] border border-[var(--border)] shadow-md"
          >
            <Menu size={17} className="text-[var(--foreground-muted)]" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
