'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore, type ChatMessage } from '@/lib/store/chat'
import { Message } from './Message'
import { ChatComposer } from './ChatComposer'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { Lightbulb, Code2, BookOpen, Sparkles, Globe, FileSearch, Brain } from 'lucide-react'

interface ChatInterfaceProps {
  initialMessages?: ChatMessage[]
  conversationId?: string
  userInitial?: string
  userName?: string
}

export type SearchStatus = null | 'searching' | 'reading' | 'thinking'

const suggestions = [
  { icon: Lightbulb, text: "Explique l'informatique quantique simplement", label: 'Expliquer', color: 'text-amber-500' },
  { icon: Code2, text: 'Écris une fonction debounce en TypeScript', label: 'Code', color: 'text-orange-500' },
  { icon: BookOpen, text: 'Résume les principes du stoïcisme', label: 'Résumer', color: 'text-rose-500' },
  { icon: Sparkles, text: 'Génère des noms créatifs pour une startup IA', label: 'Brainstorm', color: 'text-violet-500' },
]

const statusConfig = {
  searching: { icon: Globe, label: 'Recherche en cours…' },
  reading: { icon: FileSearch, label: 'Lecture des sources…' },
  thinking: { icon: Brain, label: 'Analyse et synthèse…' },
}

const spring = { type: 'spring', stiffness: 500, damping: 35 }

export function ChatInterface({ initialMessages = [], conversationId: initialConversationId, userInitial, userName }: ChatInterfaceProps) {
  const router = useRouter()
  const { messages, setMessages, appendMessage, updateLastMessage, setStreaming, isStreaming, currentModel, conversationId, setConversationId, upsertConversation } = useChatStore()
  const [input, setInput] = useState('')
  const [webSearchEnabled, setWebSearchEnabled] = useState(false)
  const [searchStatus, setSearchStatus] = useState<SearchStatus>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const [didInit, setDidInit] = useState(false)

  useEffect(() => {
    setMessages(initialMessages)
    setConversationId(initialConversationId ?? null)
    setDidInit(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialConversationId])

  useEffect(() => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200
    if (isNearBottom || isStreaming) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, isStreaming])

  const handleSubmit = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text || isStreaming) return

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text, createdAt: new Date() }
    const assistantMessage: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: '', createdAt: new Date(), isStreaming: true }

    appendMessage(userMessage)
    appendMessage(assistantMessage)
    setInput('')
    setStreaming(true)

    const abort = new AbortController()
    abortRef.current = abort

    try {
      const history = [...messages, userMessage].map((m) => ({ role: m.role, content: m.content }))
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, modelId: currentModel, conversationId, webSearch: webSearchEnabled }),
        signal: abort.signal,
      })

      if (!response.ok || !response.body) {
        const errText = await response.text().catch(() => 'unknown')
        updateLastMessage(`\n\n⚠️ Erreur : ${errText.slice(0, 200)}`)
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let newConversationId: string | null = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n\n')
        buffer = parts.pop() ?? ''
        for (const part of parts) {
          if (!part.startsWith('data:')) continue
          const data = part.slice(5).trim()
          if (!data) continue
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'meta') {
              if (parsed.conversationId && parsed.conversationId !== conversationId) {
                newConversationId = parsed.conversationId
                setConversationId(parsed.conversationId)
              }
            } else if (parsed.type === 'status') {
              setSearchStatus(parsed.status as SearchStatus)
            } else if (parsed.type === 'chunk') {
              setSearchStatus(null)
              updateLastMessage(parsed.text)
            } else if (parsed.type === 'error') {
              setSearchStatus(null)
              updateLastMessage(`\n\n⚠️ ${parsed.message}`)
            } else if (parsed.type === 'done') {
              setSearchStatus(null)
            }
          } catch {}
        }
      }

      if (newConversationId && !initialConversationId) {
        router.replace(`/chat/${newConversationId}`, { scroll: false })
        upsertConversation({ id: newConversationId, title: text.slice(0, 60), model: currentModel, pinned: false, updatedAt: new Date().toISOString() })
      } else if (conversationId) {
        upsertConversation({ id: conversationId, title: text.slice(0, 60), model: currentModel, pinned: false, updatedAt: new Date().toISOString() })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      if (message !== 'AbortError' && !(err instanceof DOMException)) updateLastMessage(`\n\n⚠️ ${message}`)
    } finally {
      setStreaming(false)
      setSearchStatus(null)
      const last = useChatStore.getState().messages
      if (last.length > 0) {
        const lastMsg = last[last.length - 1]
        if (lastMsg.role === 'assistant') {
          useChatStore.setState({ messages: [...last.slice(0, -1), { ...lastMsg, isStreaming: false }] })
        }
      }
    }
  }

  const handleStop = () => { abortRef.current?.abort(); setStreaming(false); setSearchStatus(null) }
  const handleRegenerate = () => {
    if (messages.length < 2) return
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    if (!lastUser) return
    setMessages(messages.slice(0, -1))
    handleSubmit(lastUser.content)
  }

  const isEmpty = didInit && messages.length === 0

  return (
    <div className="flex flex-col h-full relative bg-white dark:bg-[var(--background)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
        {isEmpty ? (
          <div className="min-h-full flex flex-col items-center justify-center px-6 py-20 pb-44">
            {/* Orb hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0 }}
              className="relative mb-8 flex items-center justify-center"
            >
              {/* Rings */}
              {[60, 96, 132].map((size, i) => (
                <motion.div
                  key={size}
                  className="absolute rounded-full border border-orange-200/50"
                  style={{ width: size, height: size }}
                  animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                />
              ))}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <NetralLogo size={56} animated />
              </motion.div>
            </motion.div>

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 }}
              className="text-center mb-10"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-[var(--foreground)] mb-3">
                {userName ? `Bonjour, ${userName.split(' ')[0]}` : 'Bonjour'}
              </h2>
              <p className="text-gray-400 dark:text-[var(--foreground-muted)] text-lg">
                Comment puis-je vous aider aujourd&apos;hui ?
              </p>
            </motion.div>

            {/* Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.18 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg"
            >
              {suggestions.map((s, i) => {
                const Icon = s.icon
                return (
                  <motion.button
                    key={s.text}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.22 + i * 0.05 }}
                    whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(249,115,22,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubmit(s.text)}
                    className="group flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-[var(--background-elevated)] border border-gray-100 dark:border-[var(--border)] text-left cursor-pointer transition-colors hover:border-orange-200"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-[var(--border)] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={15} className={s.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-gray-400 dark:text-[var(--foreground-subtle)] uppercase tracking-wider mb-0.5">{s.label}</p>
                      <p className="text-sm text-gray-700 dark:text-[var(--foreground)] line-clamp-2 leading-relaxed">{s.text}</p>
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto w-full px-4 md:px-6 pt-8 pb-44">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 16, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={spring}
                >
                  <Message
                    role={m.role}
                    content={m.content}
                    isStreaming={m.isStreaming && i === messages.length - 1}
                    isLast={i === messages.length - 1 && !isStreaming}
                    onRegenerate={handleRegenerate}
                    userInitial={userInitial}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom area */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="max-w-2xl mx-auto px-4 md:px-6 pb-5 md:pb-7 pb-safe">
          {/* Search status pill */}
          <AnimatePresence>
            {searchStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={spring}
                className="flex justify-center mb-3"
              >
                {(() => {
                  const s = statusConfig[searchStatus]
                  const Icon = s.icon
                  return (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[var(--background-elevated)] border border-orange-200/80 shadow-sm shadow-orange-100/60 text-sm font-medium text-orange-600 dark:text-orange-400">
                      <Icon size={13} className="search-pulse" />
                      <span className="search-pulse">{s.label}</span>
                    </div>
                  )
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pointer-events-auto">
            <ChatComposer
              value={input}
              onChange={setInput}
              onSubmit={() => handleSubmit()}
              onStop={handleStop}
              isStreaming={isStreaming}
              autoFocus={isEmpty}
              webSearchEnabled={webSearchEnabled}
              onToggleWebSearch={() => setWebSearchEnabled(!webSearchEnabled)}
            />
          </div>
        </div>

        {/* Fade gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-white dark:from-[var(--background)] via-white/80 dark:via-[var(--background)]/80 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
