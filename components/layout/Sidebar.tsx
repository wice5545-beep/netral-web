'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Settings, LogOut, MessageSquare, Trash2,
  X, Menu, FolderOpen, Bot, Layers, Globe, Sparkles, Zap, ChevronRight
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
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
      <div className="mb-5">
        {label && (
          <p className="label-num px-4 mb-2">{label}</p>
        )}
        <div className="space-y-px px-2">
          {items.map((c, idx) => {
            const isActive = pathname === `/chat/${c.id}` || conversationId === c.id
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.025, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/chat/${c.id}`}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={cn(
                    'group flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all duration-150',
                    isActive
                      ? 'bg-[var(--bg)] text-[var(--fg)] shadow-[var(--shadow-page)] border border-[var(--rule)]'
                      : 'text-[var(--fg-muted)] hover:bg-[var(--bg)] hover:text-[var(--fg)]'
                  )}
                >
                  <span className={cn(
                    'w-1 h-4 rounded-full transition-colors',
                    isActive ? 'bg-[var(--jewel)]' : 'bg-transparent group-hover:bg-[var(--rule-strong)]'
                  )} />
                  <span className="flex-1 truncate">{c.title}</span>
                  <button
                    onClick={(e) => handleDelete(c.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-all"
                    aria-label="Supprimer"
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
          width: sidebarOpen ? 280 : isMobile ? 280 : 0,
        }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed md:relative top-0 left-0 z-50 h-screen flex flex-col shrink-0 overflow-hidden',
          'border-r border-[var(--rule)] bg-[var(--bg-soft)]'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-[60px] px-5 shrink-0 border-b border-[var(--rule)]">
          <Link href="/chat" className="flex items-center gap-2.5">
            <NetralLogo size={22} />
            <span className="font-display text-[17px] tracking-tight">Netral</span>
          </Link>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-md hover:bg-[var(--bg)] text-[var(--fg-muted)]">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Primary actions */}
        <div className="px-3 py-3 space-y-px">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium text-[var(--fg)] hover:bg-[var(--bg)] transition-all group"
          >
            <span className="w-7 h-7 rounded-md bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center group-hover:bg-[var(--jewel)] transition-colors">
              <Plus size={14} strokeWidth={2.5} />
            </span>
            <span>Nouvelle conversation</span>
          </button>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-[var(--fg-muted)] hover:bg-[var(--bg)] hover:text-[var(--fg)] transition-all"
          >
            <Search size={14} strokeWidth={2} className="opacity-60" />
            <span>Rechercher</span>
            <span className="ml-auto kbd">⌘K</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-[var(--fg-muted)] hover:bg-[var(--bg)] hover:text-[var(--fg)] transition-all">
            <FolderOpen size={14} strokeWidth={2} className="opacity-60" />
            <span>Projets</span>
          </button>

          <button
            onClick={() => setAgentsOpen(!agentsOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-[var(--fg-muted)] hover:bg-[var(--bg)] hover:text-[var(--fg)] transition-all"
          >
            <Bot size={14} strokeWidth={2} className="opacity-60" />
            <span>Agents</span>
            <span className="ml-auto text-[9px] font-medium uppercase tracking-wider text-[var(--jewel)]">Beta</span>
          </button>
        </div>

        {/* Search input */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden px-3 pb-3"
            >
              <input
                type="text"
                placeholder="Rechercher dans les conversations…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="input h-9 text-[13px]"
              />
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
              className="overflow-hidden border-t border-[var(--rule)]"
            >
              <div className="px-3 py-3 space-y-px">
                <p className="label-num px-3 mb-2">Agents</p>
                {[
                  { name: 'Web', desc: 'Recherche & synthèse', icon: Globe },
                  { name: 'Rédacteur', desc: 'Écriture & reformulation', icon: Sparkles },
                  { name: 'Analyste', desc: 'Données & insights', icon: Zap },
                ].map((agent) => {
                  const Icon = agent.icon
                  return (
                    <button
                      key={agent.name}
                      onClick={() => { setAgentsOpen(false); handleNewChat() }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--bg)] transition-all text-left group"
                    >
                      <Icon size={14} className="text-[var(--fg-muted)] group-hover:text-[var(--jewel)] transition-colors" strokeWidth={1.8} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-[var(--fg)]">{agent.name}</p>
                        <p className="text-[10px] text-[var(--fg-subtle)] truncate">{agent.desc}</p>
                      </div>
                      <ChevronRight size={12} className="text-[var(--fg-subtle)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rule mx-4 my-1" />

        {/* Recent label */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          <p className="label-num">Récents</p>
          <Layers size={11} className="text-[var(--fg-subtle)]" />
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto pb-2">
          {!conversationsLoaded ? (
            <div className="space-y-1.5 px-3 pt-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-8" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <MessageSquare size={16} className="text-[var(--fg-subtle)] mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-[12px] text-[var(--fg-muted)]">Aucune conversation</p>
            </div>
          ) : (
            <>
              {renderGroup('Épinglés', groups.pinned)}
              {renderGroup("Aujourd'hui", groups.today)}
              {renderGroup('Hier', groups.yesterday)}
              {renderGroup('Semaine', groups.week)}
              {renderGroup('Mois', groups.month)}
              {renderGroup('Plus ancien', groups.older)}
            </>
          )}
        </div>

        {/* Profile */}
        <div className="border-t border-[var(--rule)] shrink-0 relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg)] transition-all"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-md bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center text-xs font-bold">
                {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[var(--jewel)] border-2 border-[var(--bg-soft)]" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-medium text-[var(--fg)] truncate">{user.name ?? 'Utilisateur'}</p>
              <p className="text-[11px] text-[var(--fg-muted)] truncate">{user.email}</p>
            </div>
          </button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-full left-3 right-3 mb-2 card-float py-1.5 z-50"
              >
                <button
                  onClick={() => { setProfileMenuOpen(false); onOpenSettings() }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-[var(--fg-soft)] hover:bg-[var(--bg-soft)] transition-colors rounded-md"
                >
                  <Settings size={13} className="opacity-60" strokeWidth={1.8} />
                  Paramètres
                </button>
                <div className="rule mx-3 my-1" />
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors rounded-md"
                >
                  <LogOut size={13} className="opacity-60" strokeWidth={1.8} />
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
            className="fixed top-4 left-4 z-40 p-2.5 rounded-md card-float"
          >
            <Menu size={16} className="text-[var(--fg-muted)]" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
