'use client'

import { useState, memo, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, RotateCw, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react'
import { SquarePenIcon } from '@/components/ui/square-pen'
import { Markdown } from './Markdown'
import { ThinkingIndicator } from './ThinkingIndicator'
import { ReasoningBlock, splitReasoning } from './ReasoningBlock'
import { NetralLogo } from '@/components/ui/NetralLogo'
import type { SearchStatus } from './ChatInterface'

interface MessageProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  isLast?: boolean
  onRegenerate?: () => void
  onEdit?: (newContent: string) => void
  userInitial?: string
  searchStatus?: SearchStatus
}

function extractSources(content: string): { title: string; url: string; domain: string }[] {
  const sourcesMatch = content.match(/\*\*Sources\s*:\*\*\n([\s\S]+?)(?:\n\n|$)/)
  if (!sourcesMatch) return []
  return sourcesMatch[1]
    .split('\n')
    .map((line) => {
      const match = line.match(/\d+\.\s+\[([^\]]+)\]\(([^)]+)\)/)
      if (!match) return null
      try {
        const domain = new URL(match[2]).hostname.replace(/^www\./, '')
        return { title: match[1], url: match[2], domain }
      } catch { return null }
    })
    .filter(Boolean) as { title: string; url: string; domain: string }[]
}

function contentWithoutSources(content: string): string {
  return content.replace(/\n\n---\n\*\*Sources\s*:\*\*\n[\s\S]+$/, '').trim()
}

export const Message = memo(function Message({
  role, content, isStreaming, isLast, onRegenerate, onEdit, searchStatus,
}: MessageProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<null | 'up' | 'down'>(null)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(content)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  // ━━ USER ━━
  if (role === 'user') {
    return (
      <div className="flex justify-end mb-7 group">
        <div className="max-w-[85%] md:max-w-[75%]">
          {editing ? (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[var(--bg-soft)] border border-[var(--border-strong)] text-[14.5px] leading-[1.55] text-[var(--fg)] resize-none focus:outline-none min-h-[60px] shadow-inner"
                autoFocus
              />
              <div className="flex justify-end gap-1.5">
                <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-lg text-[12px] text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] transition-colors">Annuler</button>
                <button onClick={() => { if (onEdit && editValue.trim()) { onEdit(editValue.trim()); setEditing(false) } }} className="px-3 py-1.5 rounded-lg text-[12px] bg-[var(--accent)] text-[var(--bg)] font-medium hover:bg-[var(--accent-hover)] transition-colors">Envoyer</button>
              </div>
            </motion.div>
          ) : (
            <div className="relative">
              <div className="rounded-2xl rounded-br-md px-4 py-2.5 bg-[var(--accent)] text-[var(--bg)] text-[14.5px] leading-[1.55] whitespace-pre-wrap break-words shadow-colored">
                {content}
              </div>
              {onEdit && (
                <button
                  onClick={() => { setEditValue(content); setEditing(true) }}
                  className="absolute -left-9 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-[var(--bg-soft)]"
                  aria-label="Modifier"
                >
                  <SquarePenIcon size={13} className="text-[var(--fg-muted)]" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ━━ ASSISTANT ━━
  // Parse reasoning + answer split (for <think>/<reasoning> tagged streams)
  const { reasoning, answer, isReasoningOpen } = useMemo(
    () => splitReasoning(content),
    [content]
  )

  const showThinking = isStreaming && answer.length === 0 && reasoning.length === 0
  const sources = useMemo(
    () => (!isStreaming ? extractSources(answer) : []),
    [answer, isStreaming]
  )
  const displayContent = useMemo(
    () => (sources.length > 0 ? contentWithoutSources(answer) : answer),
    [answer, sources]
  )

  return (
    <div className="flex gap-3.5 mb-9 group">
      <div className="shrink-0 mt-1">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220 }}
          className="w-7 h-7 rounded-lg glass-card flex items-center justify-center group-hover:shadow-colored transition-all"
        >
          <NetralLogo size={16} />
        </motion.div>
      </div>

      <div className="flex-1 min-w-0">
        {showThinking ? (
          <ThinkingIndicator status={searchStatus} />
        ) : (
          <>
            {/* Reasoning chain-of-thought */}
            {reasoning && (
              <ReasoningBlock content={reasoning} isReasoning={isReasoningOpen} />
            )}

            {/* Answer */}
            {(answer.length > 0 || !isReasoningOpen) && (
              <div className="prose-chat">
                <Markdown content={displayContent} />
                {isStreaming && answer.length > 0 && <span className="stream-cursor" />}
              </div>
            )}

            {/* While reasoning is still open, show a subtle status under it */}
            {isReasoningOpen && answer.length === 0 && (
              <div className="mt-3">
                <ThinkingIndicator status={searchStatus} />
              </div>
            )}

            {/* Sources */}
            {!isStreaming && sources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 pt-4 border-t border-[var(--border)]"
              >
                <p className="text-[10.5px] font-medium text-[var(--fg-muted)] mb-2.5 uppercase tracking-[0.12em]">
                  Sources · {sources.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sources.map((s, i) => (
                    <motion.a
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/src flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card text-[12px] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:shadow-colored hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${s.domain}&sz=32`}
                        alt=""
                        className="w-3.5 h-3.5 rounded-sm"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <span className="font-medium truncate max-w-[160px]">{s.domain}</span>
                      <span className="font-mono text-[10px] text-[var(--fg-subtle)] opacity-60">[{i + 1}]</span>
                      <ExternalLink size={9} className="opacity-0 group-hover/src:opacity-60 transition-opacity" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action bar */}
            {!isStreaming && answer.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-0.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ActionBtn onClick={copy}>
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span key="c" initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.5 }} transition={{ duration: 0.15 }}>
                        <Check size={11} className="text-emerald-500" />
                      </motion.span>
                    ) : (
                      <motion.span key="cp" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }} transition={{ duration: 0.15 }}>
                        <Copy size={11} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {copied ? 'Copie' : 'Copier'}
                </ActionBtn>

                {isLast && onRegenerate && (
                  <ActionBtn onClick={onRegenerate}>
                    <RotateCw size={11} />
                    Regenerer
                  </ActionBtn>
                )}

                <ActionBtn
                  onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                  active={feedback === 'up'}
                  ariaLabel="Bonne reponse"
                >
                  <ThumbsUp size={11} />
                </ActionBtn>
                <ActionBtn
                  onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                  active={feedback === 'down'}
                  ariaLabel="Mauvaise reponse"
                >
                  <ThumbsDown size={11} />
                </ActionBtn>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
})

function ActionBtn({
  onClick, children, active, ariaLabel,
}: {
  onClick: () => void
  children: React.ReactNode
  active?: boolean
  ariaLabel?: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all duration-150 ${
        active
          ? 'bg-[var(--accent-soft)] text-[var(--fg)]'
          : 'text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]'
      }`}
    >
      {children}
    </button>
  )
}
