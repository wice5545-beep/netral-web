'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore, type ChatMessage } from '@/lib/store/chat'
import { Message } from './Message'
import { ChatComposer } from './ChatComposer'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { Lightbulb, Code2, BookOpen, Sparkles, Globe, FileSearch, Brain, Zap, Palette, Music } from 'lucide-react'

interface ChatInterfaceProps {
  initialMessages?: ChatMessage[]
  conversationId?: string
  userInitial?: string
  userName?: string
}

export type SearchStatus = null | 'searching' | 'reading' | 'thinking'

const suggestions = [
  { icon: Lightbulb, text: 'Explain quantum computing simply', label: 'Explain', gradient: 'from-amber-400 to-orange-500' },
  { icon: Code2, text: 'Write a debounce function in TypeScript', label: 'Code', gradient: 'from-violet-400 to-indigo-500' },
  { icon: Sparkles, text: 'Generate creative names for an AI startup', label: 'Brainstorm', gradient: 'from-pink-400 to-rose-500' },
  { icon: BookOpen, text: 'Summarize the principles of stoicism', label: 'Summarize', gradient: 'from-emerald-400 to-teal-500' },
  { icon: Zap, text: 'Optimize this React component for performance', label: 'Optimize', gradient: 'from-yellow-400 to-amber-500' },
  { icon: Palette, text: 'Design a color palette for a fintech app', label: 'Design', gradient: 'from-blue-400 to-cyan-500' },
]

const statusConfig = {
  searching: { icon: Globe, label: 'Searching the web…' },
  reading: { icon: FileSearch, label: 'Reading sources…' },
  thinking: { icon: Brain, label: 'Thinking…' },
}

const spring = { type: 'spring' as const, stiffness: 500, damping: 35 }

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
        updateLastMessage(`\n\n⚠️ Error: ${errText.slice(0, 200)}`)
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
      const message = err instanceof Error ? err.message : 'Unknown error'
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

  return (
    <div className="flex flex-col h-full relative">
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
        {isEmpty ? (
          <div className="min-h-full flex flex-col items-center justify-center px-6 py-20 pb-52">

            {/* Animated logo hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative mb-10 flex items-center justify-center"
            >
              {/* Pulsing rings */}
              {[80, 120, 164].map((size, i) => (
                <motion.div
                  key={size}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    border: `1px solid rgba(139,127,255,${0.25 - i * 0.07})`,
                  }}
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 3 + i * 0.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.5,
                  }}
                />
              ))}

              {/* Rotating gradient ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 96,
                  height: 96,
                  background: 'conic-gradient(from 0deg, transparent 60%, rgba(139,127,255,0.6) 80%, transparent 100%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <NetralLogo size={58} animated />
              </motion.div>
            </motion.div>

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-3"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                {firstName ? (
                  <>
                    <span className="text-[var(--foreground)]">Hello, </span>
                    <span className="glow-text">{firstName}</span>
                  </>
                ) : (
                  <span className="glow-text">Hello there</span>
                )}
              </h2>
              <p className="text-[var(--foreground-muted)] text-lg font-light">
                What can I help you with today?
              </p>
            </motion.div>

            {/* Suggestion cards */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 w-full max-w-2xl mt-8"
            >
              {suggestions.map((s, i) => {
                const Icon = s.icon
                return (
                  <motion.button
                    key={s.text}
                    initial={{ opacity: 0, y: 16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSubmit(s.text)}
                    className="group relative flex items-start gap-3 p-4 rounded-2xl glass-panel text-left cursor-pointer transition-all duration-200 hover:border-[var(--accent)]/30 overflow-hidden"
                  >
                    {/* Hover shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-[var(--accent)]/5 group-hover:to-transparent transition-all duration-300 rounded-2xl" />

                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shrink-0 mt-0.5 shadow-lg`}>
                      <Icon size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0 relative z-10">
                      <p className="text-[10px] font-bold text-[var(--foreground-subtle)] uppercase tracking-[0.12em] mb-1">{s.label}</p>
                      <p className="text-[13px] text-[var(--foreground)] line-clamp-2 leading-relaxed">{s.text}</p>
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto w-full px-4 md:px-6 pt-8 pb-52">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
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

      {/* Bottom input area */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="max-w-2xl mx-auto px-4 md:px-6 pb-5 md:pb-7 pb-safe">
          {/* Status pill */}
          <AnimatePresence>
            {searchStatus && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={spring}
                className="flex justify-center mb-3"
              >
                {(() => {
                  const s = statusConfig[searchStatus]
                  const Icon = s.icon
                  return (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--accent)]/30 shadow-lg text-sm font-medium text-[var(--accent)]">
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
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/85 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
