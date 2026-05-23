'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore, type ChatMessage } from '@/lib/store/chat'
import { Message } from './Message'
import { ChatComposer } from './ChatComposer'
import { Globe, FileSearch, Brain } from 'lucide-react'

interface ChatInterfaceProps {
  initialMessages?: ChatMessage[]
  conversationId?: string
  userInitial?: string
  userName?: string
}

export type SearchStatus = null | 'searching' | 'reading' | 'thinking'

const suggestions = [
  { num: '01', text: 'Quelles sont les nouvelles découvertes en physique quantique cette semaine ?', label: 'Recherche' },
  { num: '02', text: 'Explique-moi les principes du stoïcisme avec des exemples modernes', label: 'Apprendre' },
  { num: '03', text: 'Rédige un email professionnel pour décliner une offre poliment', label: 'Écrire' },
  { num: '04', text: 'Compare React, Vue et Svelte en 2026 — points forts, faiblesses', label: 'Analyser' },
]

const statusConfig = {
  searching: { icon: Globe, label: 'Recherche en cours…' },
  reading: { icon: FileSearch, label: 'Lecture des sources…' },
  thinking: { icon: Brain, label: 'Réflexion…' },
}

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
  const firstName = userName?.split(' ')[0]
  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 6) return 'Bonne nuit'
    if (h < 12) return 'Bonjour'
    if (h < 18) return 'Bon après-midi'
    return 'Bonsoir'
  })()

  return (
    <div className="flex flex-col h-full relative">
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
        {isEmpty ? (
          <div className="min-h-full flex flex-col px-6 lg:px-12 pt-16 lg:pt-24 pb-56 max-w-[920px] mx-auto w-full">

            {/* Issue header */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-12"
            >
              <span className="label-num">№ {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
              <span className="rule flex-1 max-w-[60px]" />
              <span className="label">Édition du jour</span>
            </motion.div>

            {/* Greeting — editorial style */}
            <motion.div
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16"
            >
              <h2 className="font-display text-[clamp(40px,7vw,80px)] leading-[1] tracking-tight">
                {greeting}{firstName ? `,` : '.'}
                {firstName && (
                  <>
                    <br />
                    <span className="serif-italic" style={{ color: 'var(--jewel)' }}>{firstName}.</span>
                  </>
                )}
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-[15px] text-[var(--fg-muted)] mt-6 max-w-md"
              >
                Une question m'attend-elle ? Je peux consulter le web, lire vos documents, ou simplement converser.
              </motion.p>
            </motion.div>

            {/* Section break */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left' }}
              className="rule mb-8"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="label">Suggestions</span>
              <span className="dot-divider" />
              <span className="label-num">{suggestions.length} sujets</span>
            </motion.div>

            {/* Editorial suggestion list */}
            <div className="space-y-px">
              {suggestions.map((s, i) => (
                <motion.button
                  key={s.num}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 4 }}
                  onClick={() => handleSubmit(s.text)}
                  className="group w-full text-left flex items-center gap-6 py-5 border-b border-[var(--rule)] hover:border-[var(--jewel)] transition-all"
                >
                  <span className="label-num shrink-0">{s.num}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-[var(--jewel)] mb-1">{s.label}</p>
                    <p className="text-[16px] lg:text-[18px] font-display leading-[1.3] text-[var(--fg)] group-hover:text-[var(--jewel)] transition-colors">
                      {s.text}
                    </p>
                  </div>
                  <svg className="shrink-0 transition-transform group-hover:translate-x-1 text-[var(--fg-muted)] group-hover:text-[var(--jewel)]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-[760px] mx-auto w-full px-4 md:px-8 pt-10 pb-56">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 14, filter: 'blur(2px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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

      {/* Bottom composer area */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="max-w-[760px] mx-auto px-4 md:px-8 pb-6 md:pb-8 pb-safe">
          {/* Status pill */}
          <AnimatePresence>
            {searchStatus && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-center mb-3"
              >
                {(() => {
                  const s = statusConfig[searchStatus]
                  const Icon = s.icon
                  return (
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-[var(--rule)] shadow-sm">
                      <Icon size={12} className="text-[var(--jewel)]" />
                      <span className="text-[12px] font-medium text-[var(--fg-soft)] shimmer-text">{s.label}</span>
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

        {/* Bottom fade */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/95 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
