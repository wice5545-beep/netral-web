'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, RotateCw, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react'
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

export function Message({ role, content, isStreaming, isLast, onRegenerate, userInitial }: MessageProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  // ━━━ USER MESSAGE ━━━
  if (role === 'user') {
    return (
      <div className="flex justify-end mb-8">
        <div className="flex gap-3 max-w-[85%] items-start">
          <div className="rounded-[12px] rounded-tr-[4px] px-4 py-3 text-[14.5px] leading-[1.55] whitespace-pre-wrap break-words bg-[var(--fg)] text-[var(--bg)]">
            {content}
          </div>
          <div className="w-8 h-8 rounded-md bg-[var(--jewel)] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            {userInitial?.toUpperCase() ?? 'U'}
          </div>
        </div>
      </div>
    )
  }

  // ━━━ ASSISTANT MESSAGE ━━━
  const showOrb = isStreaming && content.length === 0
  const sources = !isStreaming ? extractSources(content) : []
  const displayContent = sources.length > 0 ? contentWithoutSources(content) : content

  return (
    <div className="flex gap-4 mb-10 group">
      <div className="shrink-0 mt-1">
        <NetralLogo size={26} animated={isStreaming} />
      </div>

      <div className="flex-1 min-w-0">
        {showOrb ? (
          <TypingOrb />
        ) : (
          <>
            <div className="prose-edit">
              <Markdown content={displayContent} />
              {isStreaming && <span className="stream-cursor" />}
            </div>

            {/* Sources */}
            {!isStreaming && sources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 pt-5 border-t border-[var(--rule)]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="label-num">Sources</span>
                  <span className="rule flex-1 max-w-[40px]" />
                  <span className="label-num">{sources.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sources.map((s, i) => (
                    <motion.a
                      key={i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/src flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--rule)] text-xs text-[var(--fg-muted)] hover:border-[var(--jewel)] hover:text-[var(--jewel)] hover:bg-[var(--jewel-tint)] transition-all"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${s.domain}&sz=32`}
                        alt=""
                        className="w-3 h-3 rounded-sm"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <span className="font-medium truncate max-w-[140px]">{s.domain}</span>
                      <span className="font-mono text-[9px] text-[var(--fg-subtle)] group-hover/src:text-[var(--jewel)]">[{i + 1}]</span>
                      <ExternalLink size={9} className="opacity-40 group-hover/src:opacity-100" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action bar */}
            {!isStreaming && (
              <div className="flex items-center gap-0.5 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)] transition-colors"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span key="c" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                        <Check size={11} className="text-emerald-500" />
                      </motion.span>
                    ) : (
                      <motion.span key="cp" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                        <Copy size={11} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {copied ? 'Copié' : 'Copier'}
                </button>

                {isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)] transition-colors"
                  >
                    <RotateCw size={11} />
                    Régénérer
                  </button>
                )}

                <div className="w-px h-3 bg-[var(--rule)] mx-1" />

                <button
                  onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                  aria-label="Bonne réponse"
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    feedback === 'up'
                      ? 'text-emerald-500 bg-emerald-500/10'
                      : 'text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-emerald-500'
                  )}
                >
                  <ThumbsUp size={11} />
                </button>
                <button
                  onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                  aria-label="Mauvaise réponse"
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    feedback === 'down'
                      ? 'text-red-500 bg-red-500/10'
                      : 'text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-red-500'
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
