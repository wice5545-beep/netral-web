'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, RotateCw, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react'
import { SquarePenIcon } from '@/components/ui/square-pen'
import { Markdown } from './Markdown'
import { TypingOrb } from './TypingOrb'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { cn } from '@/lib/utils'

interface MessageProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  isLast?: boolean
  onRegenerate?: () => void
  onEdit?: (newContent: string) => void
  userInitial?: string
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

export function Message({ role, content, isStreaming, isLast, onRegenerate, onEdit, userInitial }: MessageProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(content)

  const handleFeedback = (type: 'up' | 'down') => {
    const newFeedback = feedback === type ? null : type
    setFeedback(newFeedback)
    // Save to progressive memory
    fetch('/api/memory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customInstructions: newFeedback === 'up'
          ? `L'utilisateur a aimé ce type de réponse: "${content.slice(0, 100)}"`
          : newFeedback === 'down'
          ? `L'utilisateur n'a PAS aimé ce type de réponse: "${content.slice(0, 100)}". Adapte-toi.`
          : undefined
      }),
    }).catch(() => {})
  }

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
      <div className="flex justify-end mb-6 group">
        <div className="max-w-[85%] md:max-w-[75%]">
          {editing ? (
            <div className="space-y-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[var(--bg-soft)] border border-[var(--border-strong)] text-[14.5px] leading-[1.55] text-[var(--fg)] resize-none focus:outline-none min-h-[60px]"
                autoFocus
              />
              <div className="flex justify-end gap-1.5">
                <button onClick={() => setEditing(false)} className="px-3 py-1 rounded-lg text-[12px] text-[var(--fg-muted)] hover:bg-[var(--bg-soft)]">Annuler</button>
                <button onClick={() => { if (onEdit && editValue.trim()) { onEdit(editValue.trim()); setEditing(false) } }} className="px-3 py-1 rounded-lg text-[12px] bg-[var(--accent)] text-[var(--bg)] font-medium">Envoyer</button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="rounded-2xl rounded-br-md px-4 py-2.5 bg-[var(--accent)] text-[var(--bg)] text-[14.5px] leading-[1.55] whitespace-pre-wrap break-words shadow-[var(--shadow-xs)]">
                {content}
              </div>
              {onEdit && (
                <button
                  onClick={() => { setEditValue(content); setEditing(true) }}
                  className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-[var(--bg-soft)]"
                  aria-label="Modifier"
                >
                  <SquarePenIcon size={14} className="text-[var(--fg-muted)]" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ━━ ASSISTANT ━━
  const showOrb = isStreaming && content.length === 0
  const sources = !isStreaming ? extractSources(content) : []
  const displayContent = sources.length > 0 ? contentWithoutSources(content) : content

  return (
    <div className="flex gap-3 mb-8 group">
      <div className="shrink-0 mt-0.5">
        <NetralLogo size={26} />
      </div>

      <div className="flex-1 min-w-0">
        {showOrb ? (
          <TypingOrb />
        ) : (
          <>
            <div className="prose-chat">
              <Markdown content={displayContent} />
              {isStreaming && <span className="stream-cursor" />}
            </div>

            {/* Sources */}
            {!isStreaming && sources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <p className="text-[11px] font-medium text-[var(--fg-muted)] mb-2">
                  Sources ({sources.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sources.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/src flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--border)] text-[12px] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)] transition-all"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${s.domain}&sz=32`}
                        alt=""
                        className="w-3 h-3 rounded-sm"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <span className="font-medium truncate max-w-[140px]">{s.domain}</span>
                      <span className="font-mono text-[10px] text-[var(--fg-subtle)]">[{i + 1}]</span>
                      <ExternalLink size={9} className="opacity-50" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Action bar */}
            {!isStreaming && (
              <div className="flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)] transition-colors"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span key="c" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }} transition={{ duration: 0.15 }}>
                        <Check size={11} />
                      </motion.span>
                    ) : (
                      <motion.span key="cp" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }} transition={{ duration: 0.15 }}>
                        <Copy size={11} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {copied ? 'Copié' : 'Copier'}
                </button>

                {isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)] transition-colors"
                  >
                    <RotateCw size={11} />
                    Régénérer
                  </button>
                )}

                <button
                  onClick={() => handleFeedback('up')}
                  aria-label="Réponse utile"
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    feedback === 'up'
                      ? 'text-[var(--fg)] bg-[var(--bg-soft)]'
                      : 'text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]'
                  )}
                >
                  <ThumbsUp size={11} />
                </button>
                <button
                  onClick={() => handleFeedback('down')}
                  aria-label="Réponse incorrecte"
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    feedback === 'down'
                      ? 'text-[var(--fg)] bg-[var(--bg-soft)]'
                      : 'text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]'
                  )}
                >
                  <ThumbsDown size={11} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
