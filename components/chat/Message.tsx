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
  const [liked, setLiked] = useState<boolean | null>(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  if (role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-end mb-6 group"
      >
        <div className="flex gap-3 max-w-[85%] md:max-w-[75%] items-end">
          <div className="relative rounded-2xl rounded-br-sm px-4 py-3 text-[var(--foreground)] text-[14.5px] leading-relaxed whitespace-pre-wrap break-words overflow-hidden"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-2xl rounded-br-sm bg-gradient-to-br from-[var(--accent)]/5 to-transparent pointer-events-none" />
            <span className="relative z-10">{content}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg shadow-[var(--accent-glow)]">
            {userInitial?.toUpperCase() ?? 'U'}
          </div>
        </div>
      </motion.div>
    )
  }

  const showOrb = isStreaming && content.length === 0
  const sources = !isStreaming ? extractSources(content) : []
  const displayContent = sources.length > 0 ? contentWithoutSources(content) : content

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3.5 mb-7 group"
    >
      <div className="shrink-0 mt-0.5">
        <NetralLogo size={28} animated={isStreaming} />
      </div>
      <div className="flex-1 min-w-0">
        {showOrb ? (
          <TypingOrb />
        ) : (
          <>
            <Markdown content={displayContent} />
            {isStreaming && <span className="stream-cursor" />}

            {/* Sources */}
            {!isStreaming && sources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-4"
              >
                <p className="text-[9px] font-bold text-[var(--foreground-subtle)] uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5">
                  <span className="w-3 h-px bg-[var(--foreground-subtle)]/40" />
                  Sources
                </p>
                <div className="flex flex-wrap gap-2">
                  {sources.map((s, i) => (
                    <motion.a
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'group/src flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs',
                        'glass border border-[var(--glass-border)]',
                        'hover:border-[var(--accent)]/40 hover:shadow-sm transition-all duration-200'
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${s.domain}&sz=32`}
                        alt=""
                        className="w-3.5 h-3.5 rounded-sm"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <span className="text-[var(--foreground-muted)] group-hover/src:text-[var(--accent)] transition-colors font-medium truncate max-w-[140px]">
                        {s.domain}
                      </span>
                      <span className="text-[var(--accent)] text-[9px] font-bold">[{i + 1}]</span>
                      <ExternalLink size={9} className="text-[var(--foreground-subtle)] group-hover/src:text-[var(--accent)] transition-colors shrink-0" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action bar */}
            {!isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="flex items-center gap-0.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[var(--foreground-muted)] hover:bg-[var(--border)]/60 hover:text-[var(--foreground)] transition-all duration-150"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span key="check" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                        <Check size={11} className="text-emerald-400" />
                      </motion.span>
                    ) : (
                      <motion.span key="copy" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                        <Copy size={11} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {copied ? 'Copied!' : 'Copy'}
                </button>

                {isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[var(--foreground-muted)] hover:bg-[var(--border)]/60 hover:text-[var(--foreground)] transition-all duration-150"
                  >
                    <RotateCw size={11} />
                    Retry
                  </button>
                )}

                <div className="w-px h-3.5 bg-[var(--glass-border)] mx-0.5" />

                <button
                  onClick={() => setLiked(true)}
                  className={cn(
                    'p-1.5 rounded-lg text-[11px] transition-all duration-150',
                    liked === true
                      ? 'text-emerald-400 bg-emerald-400/10'
                      : 'text-[var(--foreground-muted)] hover:bg-[var(--border)]/60 hover:text-emerald-400'
                  )}
                >
                  <ThumbsUp size={11} />
                </button>
                <button
                  onClick={() => setLiked(false)}
                  className={cn(
                    'p-1.5 rounded-lg text-[11px] transition-all duration-150',
                    liked === false
                      ? 'text-red-400 bg-red-400/10'
                      : 'text-[var(--foreground-muted)] hover:bg-[var(--border)]/60 hover:text-red-400'
                  )}
                >
                  <ThumbsDown size={11} />
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
