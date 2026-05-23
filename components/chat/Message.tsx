'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, RotateCw, ExternalLink } from 'lucide-react'
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
        initial={{ opacity: 0, y: 8, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-end mb-6"
      >
        <div className="flex gap-3 max-w-[85%] md:max-w-[75%] items-end">
          <div className="rounded-2xl rounded-br-sm px-4 py-3 text-[var(--foreground)] text-[14px] leading-relaxed whitespace-pre-wrap break-words bg-[var(--accent-soft)] border border-[var(--accent)]/20">
            {content}
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--gradient-3)] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 mb-6 group"
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
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-4"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-subtle)] mb-2">Sources</p>
                <div className="flex flex-wrap gap-2">
                  {sources.map((s, i) => (
                    <motion.a
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground-muted)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-all"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${s.domain}&sz=32`}
                        alt=""
                        className="w-3 h-3 rounded-sm"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <span className="font-medium truncate max-w-[120px]">{s.domain}</span>
                      <ExternalLink size={9} className="shrink-0 opacity-40" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Actions */}
            {!isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="flex items-center gap-0.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span key="check" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                        <Check size={11} className="text-emerald-500" />
                      </motion.span>
                    ) : (
                      <motion.span key="copy" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                        <Copy size={11} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {copied ? 'Copié' : 'Copier'}
                </button>
                {isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    <RotateCw size={11} />
                    Régénérer
                  </button>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
