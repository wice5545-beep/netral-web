'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useChatStore, type ChatMessage } from '@/lib/store/chat'
import { Message } from './Message'
import { ChatComposer } from './ChatComposer'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { Sparkles, BookOpen, Code2, Lightbulb } from 'lucide-react'

interface ChatInterfaceProps {
  initialMessages?: ChatMessage[]
  conversationId?: string
  userInitial?: string
  userName?: string
}

const suggestionPrompts = [
  { icon: Lightbulb, text: 'Explain quantum entanglement simply', label: 'Explain' },
  { icon: Code2, text: 'Write a TypeScript debounce function', label: 'Code' },
  { icon: BookOpen, text: 'Summarize the principles of stoicism', label: 'Summarize' },
  { icon: Sparkles, text: 'Brainstorm names for an AI product', label: 'Brainstorm' },
]

export function ChatInterface({
  initialMessages = [],
  conversationId: initialConversationId,
  userInitial,
  userName,
}: ChatInterfaceProps) {
  const router = useRouter()
  const {
    messages,
    setMessages,
    appendMessage,
    updateLastMessage,
    setStreaming,
    isStreaming,
    currentModel,
    conversationId,
    setConversationId,
    upsertConversation,
  } = useChatStore()

  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const [didInit, setDidInit] = useState(false)

  // Initialize messages on mount or when conversation changes
  useEffect(() => {
    setMessages(initialMessages)
    setConversationId(initialConversationId ?? null)
    setDidInit(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialConversationId])

  // Auto-scroll
  useEffect(() => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200
    if (isNearBottom || isStreaming) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, isStreaming])

  const handleSubmit = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text || isStreaming) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      createdAt: new Date(),
    }
    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      createdAt: new Date(),
      isStreaming: true,
    }

    appendMessage(userMessage)
    appendMessage(assistantMessage)
    setInput('')
    setStreaming(true)

    const abort = new AbortController()
    abortRef.current = abort

    try {
      // Build the history we send to the API (exclude the empty assistant placeholder)
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          modelId: currentModel,
          conversationId,
        }),
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
        const lines = buffer.split('\n\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (!data) continue
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'meta') {
              if (parsed.conversationId && parsed.conversationId !== conversationId) {
                newConversationId = parsed.conversationId
                setConversationId(parsed.conversationId)
              }
            } else if (parsed.type === 'chunk') {
              updateLastMessage(parsed.text)
            } else if (parsed.type === 'error') {
              updateLastMessage(`\n\n⚠️ ${parsed.message}`)
            }
          } catch {}
        }
      }

      // Update URL if new conversation created
      if (newConversationId && !initialConversationId) {
        router.replace(`/chat/${newConversationId}`, { scroll: false })
        upsertConversation({
          id: newConversationId,
          title: text.slice(0, 60),
          model: currentModel,
          pinned: false,
          updatedAt: new Date().toISOString(),
        })
      } else if (conversationId) {
        upsertConversation({
          id: conversationId,
          title: text.slice(0, 60),
          model: currentModel,
          pinned: false,
          updatedAt: new Date().toISOString(),
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message !== 'AbortError' && !(err instanceof DOMException)) {
        updateLastMessage(`\n\n⚠️ ${message}`)
      }
    } finally {
      setStreaming(false)
      // mark last assistant as not streaming
      const last = useChatStore.getState().messages
      if (last.length > 0) {
        const lastMsg = last[last.length - 1]
        if (lastMsg.role === 'assistant') {
          useChatStore.setState({
            messages: [...last.slice(0, -1), { ...lastMsg, isStreaming: false }],
          })
        }
      }
    }
  }

  const handleStop = () => {
    abortRef.current?.abort()
    setStreaming(false)
  }

  const handleRegenerate = () => {
    if (messages.length < 2) return
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    if (!lastUser) return
    // Remove last assistant message
    const newMessages = messages.slice(0, -1)
    setMessages(newMessages)
    handleSubmit(lastUser.content)
  }

  const isEmpty = didInit && messages.length === 0

  return (
    <div className="flex flex-col h-full relative">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="min-h-full flex flex-col items-center justify-center px-6 pt-12 pb-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <NetralLogo size={56} animated />
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                <span className="glow-text">
                  {userName ? `Hello, ${userName.split(' ')[0]}` : 'Hello there'}
                </span>
              </h2>
              <p className="text-[var(--foreground-muted)] text-base mb-10">
                What would you like to explore today?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
                {suggestionPrompts.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <motion.button
                      key={s.text}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                      onClick={() => handleSubmit(s.text)}
                      className="group flex items-start gap-3 p-4 rounded-xl glass border border-[var(--border)] hover:border-[var(--accent)]/40 hover:bg-[var(--border)] transition-all text-left"
                    >
                      <Icon size={16} className="text-[var(--accent)] mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--foreground-muted)] mb-0.5">{s.label}</p>
                        <p className="text-sm text-[var(--foreground)] line-clamp-2">{s.text}</p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full px-4 md:px-6 pt-6 pb-32">
            {messages.map((m, i) => (
              <Message
                key={m.id}
                role={m.role}
                content={m.content}
                isStreaming={m.isStreaming && i === messages.length - 1}
                isLast={i === messages.length - 1 && !isStreaming}
                onRegenerate={handleRegenerate}
                userInitial={userInitial}
              />
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 md:pb-6 pb-safe bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent pt-8 pointer-events-none">
        <div className="pointer-events-auto">
          <ChatComposer
            value={input}
            onChange={setInput}
            onSubmit={() => handleSubmit()}
            onStop={handleStop}
            isStreaming={isStreaming}
            autoFocus={isEmpty}
          />
        </div>
      </div>
    </div>
  )
}
