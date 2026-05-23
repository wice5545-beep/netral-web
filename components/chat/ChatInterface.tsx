'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore, type ChatMessage } from '@/lib/store/chat'
import { getRandomSuggestions } from '@/lib/suggestions'
import { useI18n } from '@/lib/i18n'
import { Message } from './Message'
import { ChatComposer } from './ChatComposer'
import { UpgradePopup } from './UpgradePopup'
import { Globe, FileText, Sparkles } from 'lucide-react'

interface ChatInterfaceProps {
  initialMessages?: ChatMessage[]
  conversationId?: string
  userInitial?: string
  userName?: string
}

export type SearchStatus = null | 'searching' | 'reading' | 'thinking'

function friendlyError(msg: string): string {
  if (msg.includes('model_unavailable')) {
    return 'Ce modèle est temporairement indisponible (quota atteint). Essayez un autre modèle ou réessayez plus tard. ⏳'
  }
  if (msg.includes('429') || msg.includes('quota') || msg.includes('rate') || msg.includes('capacity') || msg.includes('Limit') || msg.includes('TPM') || msg.includes('too large') || msg.includes('upstream') || msg.includes('service_tier')) {
    return 'Netral rencontre une forte demande en ce moment. Réessayez dans quelques secondes. 🙏'
  }
  if (msg.includes('Limite de messages')) return msg
  if (msg.includes('Trop de messages') || msg.includes('Trop de requêtes')) return msg
  return 'Netral a rencontré un problème temporaire. Veuillez réessayer. 🔄'
}

export function ChatInterface({ initialMessages = [], conversationId: initialConversationId, userInitial, userName }: ChatInterfaceProps) {
  const { t } = useI18n()
  const router = useRouter()
  const { messages, setMessages, appendMessage, updateLastMessage, setStreaming, isStreaming, currentModel, conversationId, setConversationId, upsertConversation } = useChatStore()
  const [input, setInput] = useState('')
  const [webSearchEnabled, setWebSearchEnabled] = useState(false)
  const [searchStatus, setSearchStatus] = useState<SearchStatus>(null)
  const [selectionPopup, setSelectionPopup] = useState<{ text: string; x: number; y: number } | null>(null)
  const [userScrolledUp, setUserScrolledUp] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const [didInit, setDidInit] = useState(false)
  const [examples] = useState(() => getRandomSuggestions(4))

  useEffect(() => {
    setMessages(initialMessages)
    setConversationId(initialConversationId ?? null)
    setDidInit(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialConversationId])

  useEffect(() => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    if (!userScrolledUp) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, userScrolledUp])

  // Detect user scrolling up
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150
      setUserScrolledUp(!atBottom)
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // Text selection popup
  useEffect(() => {
    const handleSelection = () => {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed || !sel.toString().trim()) { setSelectionPopup(null); return }
      const text = sel.toString().trim()
      if (text.length < 3) { setSelectionPopup(null); return }
      const range = sel.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setSelectionPopup({ text, x: rect.left + rect.width / 2, y: rect.top - 10 })
    }
    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('touchend', handleSelection)
    return () => { document.removeEventListener('mouseup', handleSelection); document.removeEventListener('touchend', handleSelection) }
  }, [])

  const handleSubmit = async (overrideText?: string, attachments?: { type: 'image' | 'file'; data: string; name: string }[]) => {
    const text = (overrideText ?? input).trim()
    if ((!text && !attachments?.length) || isStreaming) return

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text, createdAt: new Date() }
    const assistantMessage: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: '', createdAt: new Date(), isStreaming: true }

    appendMessage(userMessage)
    appendMessage(assistantMessage)
    setInput('')
    setStreaming(true)
    setUserScrolledUp(false)

    const abort = new AbortController()
    abortRef.current = abort

    try {
      const history = [...messages, userMessage].map((m) => ({ role: m.role, content: m.content }))

      // If attachments, modify the last user message to include images
      if (attachments?.length) {
        const lastMsg = history[history.length - 1]
        const content: unknown[] = [{ type: 'text', text: lastMsg.content || 'Analyse cette image.' }]
        for (const a of attachments) {
          if (a.type === 'image') {
            content.push({ type: 'image_url', image_url: { url: a.data } })
          } else {
            content.push({ type: 'text', text: '[Fichier: ' + a.name + ']' })
          }
        }
        history[history.length - 1] = { role: 'user', content: content as unknown as string }
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, modelId: currentModel, conversationId, webSearch: webSearchEnabled }),
        signal: abort.signal,
      })

      if (!response.ok || !response.body) {
        const errText = await response.text().catch(() => '')
        if (errText.includes('Limite') || response.status === 429) {
          setShowUpgrade(true)
        }
        updateLastMessage(`\n\n${friendlyError(errText)}`)
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
              updateLastMessage(`\n\n${friendlyError(parsed.message)}`)
            } else if (parsed.type === 'done') {
              setSearchStatus(null)
            } else if (parsed.type === 'title' && parsed.title) {
              const cid = newConversationId || conversationId
              if (cid) upsertConversation({ id: cid, title: parsed.title, model: currentModel, pinned: false, updatedAt: new Date().toISOString() })
            }
          } catch {}
        }
      }

      if (newConversationId && !initialConversationId) {
        router.replace(`/chat/${newConversationId}`, { scroll: false })
        upsertConversation({ id: newConversationId, title: text.slice(0, 60), model: currentModel, pinned: false, updatedAt: new Date().toISOString() })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      if (message !== 'AbortError' && !(err instanceof DOMException)) updateLastMessage(`\n\n${friendlyError(message)}`)
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

  const handleAskAboutSelection = () => {
    if (!selectionPopup) return
    const quoted = `> ${selectionPopup.text.slice(0, 200)}\n\n`
    setInput(quoted)
    setSelectionPopup(null)
    window.getSelection()?.removeAllRanges()
    textareaFocus()
  }

  const textareaFocus = () => {
    setTimeout(() => document.querySelector<HTMLTextAreaElement>('textarea')?.focus(), 50)
  }

  const isEmpty = didInit && messages.length === 0
  const firstName = userName?.split(' ')[0]

  return (
    <div className="flex flex-col h-full relative">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="min-h-full flex flex-col items-center justify-center px-6 pb-44 max-w-2xl mx-auto w-full">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-center mb-2"
            >
              {firstName ? t.chat.helloName.replace('{name}', firstName) : t.chat.hello}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.4 }}
              className="text-[15px] text-[var(--fg-muted)] text-center mb-10"
            >
              {t.chat.howCanIHelp}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-xl"
            >
              {examples.map((text, i) => (
                <motion.button
                  key={text}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.04, duration: 0.3 }}
                  onClick={() => handleSubmit(text)}
                  className="group p-3.5 text-left rounded-xl border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-soft)] transition-all"
                >
                  <p className="text-[13.5px] text-[var(--fg-soft)] group-hover:text-[var(--fg)] leading-snug">
                    {text}
                  </p>
                </motion.button>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full px-4 md:px-6 pt-8 pb-44">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
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

      {/* Composer area */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="max-w-3xl mx-auto px-4 md:px-6 pb-4 pb-safe">
          {/* Status pill */}
          <AnimatePresence>
            {searchStatus && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center mb-2"
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-[12px] text-[var(--fg-muted)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
                  </span>
                  {t.chat[searchStatus as 'searching' | 'reading' | 'thinking']}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pointer-events-auto">
            <ChatComposer
              value={input}
              onChange={setInput}
              onSubmit={(attachments) => handleSubmit(undefined, attachments)}
              onStop={handleStop}
              isStreaming={isStreaming}
              autoFocus={isEmpty}
              webSearchEnabled={webSearchEnabled}
              onToggleWebSearch={() => setWebSearchEnabled(!webSearchEnabled)}
              modelId={currentModel}
            />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-8 -z-10 bg-[var(--bg)] pointer-events-none" />
      </div>

      <UpgradePopup open={showUpgrade} onClose={() => setShowUpgrade(false)} />

      {/* Text selection popup */}
      <AnimatePresence>
        {selectionPopup && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            style={{ position: 'fixed', left: selectionPopup.x, top: selectionPopup.y, transform: 'translate(-50%, -100%)' }}
            className="z-50"
          >
            <button
              onMouseDown={(e) => { e.preventDefault(); handleAskAboutSelection() }}
              className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-[var(--bg)] text-[12px] font-medium shadow-[var(--shadow-md)] hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap"
            >
              Demander à Netral
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
