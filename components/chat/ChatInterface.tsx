'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore, type ChatMessage } from '@/lib/store/chat'
import { Message } from './Message'
import { ChatComposer } from './ChatComposer'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { Globe, FileSearch, Brain } from 'lucide-react'

interface ChatInterfaceProps {
  initialMessages?: ChatMessage[]
  conversationId?: string
  userInitial?: string
  userName?: string
}

export type SearchStatus = null | 'searching' | 'reading' | 'thinking'

const suggestions = [
  'Résumer un article',
  'Expliquer un concept',
  'Rechercher sur le web',
  'Analyser un document',
]

const statusConfig = {
  searching: { icon: Globe, label: 'Recherche sur le web…' },
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

  return (
    <div className="flex flex-col h-full relative">
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
        {isEmpty ? (
          <div className="min-h-full flex flex-col items-center justify-center px-6 pb-40">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <NetralLogo size={48} />
            </motion.div>

            {/* Greeting */}
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-semibold text-[var(--foreground)] mb-2"
            >
              Bonjour ! Comment puis-je vous aider aujourd&apos;hui ?
            </motion.h2>

            {/* Suggestion pills */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 mt-4"
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSubmit(s)}
                  className="px-4 py-2 rounded-full border border-[var(--border)] text-[13px] text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:border-[var(--border-strong)] transition-colors"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto w-full px-4 md:px-6 pt-8 pb-44">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
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

      {/* Bottom input */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="max-w-2xl mx-auto px-4 md:px-6 pb-5 md:pb-7 pb-safe">
          {/* Status pill */}
          <AnimatePresence>
            {searchStatus && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex justify-center mb-3"
              >
                {(() => {
                  const s = statusConfig[searchStatus]
                  const Icon = s.icon
                  return (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--background-elevated)] border border-[var(--border)] shadow-sm text-sm font-medium text-[var(--accent)]">
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

        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/90 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
