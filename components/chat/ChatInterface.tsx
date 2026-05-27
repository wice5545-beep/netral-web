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
import { AnnouncementPopup } from './AnnouncementPopup'
import { Globe, FileText, Sparkles, ArrowUp, ArrowRight } from 'lucide-react'

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
  const [upgradeMsg, setUpgradeMsg] = useState('')
  const [integrationStatus, setIntegrationStatus] = useState<string | null>(null)
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
    if (!scrollRef.current || userScrolledUp) return
    // Use RAF for smooth scroll without blocking
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    })
  }, [messages, userScrolledUp])

  // Detect user scrolling up — debounced
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150
        setUserScrolledUp(!atBottom)
        ticking = false
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
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

  // Keyboard shortcuts: ⌘N new chat, ⌘↑ focus input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        router.push('/chat')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  const handleSubmit = async (overrideText?: string, attachments?: { type: 'image' | 'file'; data: string; name: string }[]) => {
    const text = (overrideText ?? input).trim()
    if ((!text && !attachments?.length) || isStreaming) return

    // Prepend reply context if present
    const fullText = replyContext ? `> ${replyContext}\n\n${text}` : text
    setReplyContext(null)

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: fullText, createdAt: new Date() }
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
          setUpgradeMsg(errText)
          setShowUpgrade(true)
        }
        updateLastMessage(`\n\n${friendlyError(errText)}`)
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let newConversationId: string | null = null
      let chunkBuffer = ''
      let flushScheduled = false

      const flushChunks = () => {
        if (chunkBuffer) {
          updateLastMessage(chunkBuffer)
          chunkBuffer = ''
        }
        flushScheduled = false
      }

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
            } else if (parsed.type === 'integrations') {
              setIntegrationStatus(parsed.summary || `Lecture ${parsed.services?.join(', ')}...`)
              setTimeout(() => setIntegrationStatus(null), 4000)
            } else if (parsed.type === 'chunk') {
              setSearchStatus(null)
              chunkBuffer += parsed.text
              if (!flushScheduled) {
                flushScheduled = true
                requestAnimationFrame(flushChunks)
              }
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

      // Flush remaining buffered chunks
      flushChunks()

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

  const [replyContext, setReplyContext] = useState<string | null>(null)

  const handleAskAboutSelection = () => {
    if (!selectionPopup) return
    setReplyContext(selectionPopup.text.slice(0, 300))
    setSelectionPopup(null)
    window.getSelection()?.removeAllRanges()
    textareaFocus()
  }

  const textareaFocus = () => {
    setTimeout(() => document.querySelector<HTMLTextAreaElement>('textarea')?.focus(), 50)
  }

  const handleEdit = (msgIndex: number, newContent: string) => {
    // Replace the message and remove everything after it, then re-submit
    const newMessages = messages.slice(0, msgIndex)
    setMessages(newMessages)
    handleSubmit(newContent)
  }

  const isEmpty = didInit && messages.length === 0
  const firstName = userName?.split(' ')[0]

  return (
    <div className="flex flex-col h-full relative">
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[var(--bg)] to-transparent z-[1] pointer-events-none" />

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="min-h-full flex flex-col items-center justify-center px-6 pb-44 max-w-2xl mx-auto w-full relative">
            {/* Cinematic ambient background — 3 morphing aurora blobs */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
              <div
                className="aurora-blob aurora-1 opacity-40 dark:opacity-50"
                style={{
                  top: '15%', left: '10%', width: '50%', height: '50%',
                  background: 'radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)',
                }}
              />
              <div
                className="aurora-blob aurora-2 opacity-40 dark:opacity-50"
                style={{
                  top: '30%', right: '5%', width: '40%', height: '40%',
                  background: 'radial-gradient(circle, rgba(249,115,22,0.2), transparent 70%)',
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                  backgroundImage: 'radial-gradient(var(--fg) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                  maskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 80%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 80%)',
                }}
              />
            </div>

            {/* Logo with breathing halo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 14, stiffness: 180 }}
              className="mb-7 relative"
            >
              <div className="absolute inset-0 -m-3 rounded-[24px] glow-breathe pointer-events-none" />
              <div
                className="w-16 h-16 rounded-[20px] flex items-center justify-center shadow-colored relative"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899, #f97316)' }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18V6h2.5l7 9.5V6H18v12h-2.5l-7-9.5V18H6z" fill="white"/>
                </svg>
              </div>
            </motion.div>

            {/* Greeting */}
            <motion.h1
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[30px] md:text-[38px] font-bold tracking-[-0.035em] text-center mb-2 leading-[1.05]"
            >
              {firstName ? t.chat.helloName.replace('{name}', firstName) : t.chat.hello}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[15px] text-[var(--fg-muted)] text-center mb-10 max-w-xs"
            >
              {t.chat.howCanIHelp}
            </motion.p>

            {/* Suggestion chips */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-2 w-full max-w-lg"
            >
              {examples.map((text, i) => (
                <motion.button
                  key={text}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => handleSubmit(text)}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="group px-4 py-2.5 text-[12.5px] text-[var(--fg-muted)] hover:text-[var(--fg)] glass-card hover:border-[var(--border-strong)] hover:shadow-colored transition-all duration-200 cursor-pointer flex items-center gap-2 relative overflow-hidden"
                >
                  <div className="beam-scan" style={{ ['--beam-delay' as string]: `${i * 0.4}s` }} />
                  <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 -ml-1 transition-all duration-200 group-hover:translate-x-0.5 text-[var(--fg-subtle)] relative z-10" />
                  <span className="relative z-10">{text}</span>
                </motion.button>
              ))}
            </motion.div>

            {/* Quick action pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center gap-2 mt-9"
            >
              {[
                { icon: Globe, label: 'Web' },
                { icon: FileText, label: 'Fichier' },
                { icon: Sparkles, label: 'Créer' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] text-[11px] text-[var(--fg-subtle)] bg-[var(--bg-soft)]/50 backdrop-blur-sm">
                  <Icon size={10} />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full px-4 md:px-6 pt-8 pb-44">
            {messages.map((m, i) => (
              <div key={m.id} className="animate-slide-up" style={{ animationDelay: i === messages.length - 1 ? '0ms' : '0ms' }}>
                <Message
                  role={m.role}
                  content={m.content}
                  isStreaming={m.isStreaming && i === messages.length - 1}
                  isLast={i === messages.length - 1 && !isStreaming}
                  onRegenerate={handleRegenerate}
                  onEdit={m.role === 'user' ? (newContent) => handleEdit(i, newContent) : undefined}
                  userInitial={userInitial}
                  searchStatus={i === messages.length - 1 ? searchStatus : null}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {userScrolledUp && messages.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); setUserScrolledUp(false) }}
            className="absolute bottom-36 right-6 z-10 w-8 h-8 rounded-full glass-card shadow-colored flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:scale-110 transition-all duration-200"
            aria-label="Scroll to bottom"
          >
            <ArrowUp size={14} className="rotate-180" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Composer area */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="max-w-3xl mx-auto px-4 md:px-6 pb-4 pb-safe">
          {/* Status pill */}
          <AnimatePresence>
            {integrationStatus && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-center mb-2"
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card shadow-colored text-[12px] text-[var(--fg-muted)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }} />
                  </span>
                  <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}>
                    {integrationStatus}
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {searchStatus && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-center mb-2"
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card shadow-colored text-[12px] text-[var(--fg-muted)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }} />
                  </span>
                  <motion.span key={searchStatus} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}>
                    {t.chat[searchStatus as 'searching' | 'reading' | 'thinking']}
                  </motion.span>
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
              replyContext={replyContext}
              onClearReply={() => setReplyContext(null)}
            />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-12 -z-10 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
      </div>

      <UpgradePopup open={showUpgrade} onClose={() => setShowUpgrade(false)} message={upgradeMsg} />
      <AnnouncementPopup />

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
