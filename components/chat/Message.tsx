'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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

// Extraire les sources de la section markdown "Sources :"
function extractSources(content: string): { title: string; url: string; domain: string }[] {
  const sourcesMatch = content.match(/\*\*Sources\s*:\*\*\n([\s\S]+?)(?:\n\n|$)/)
  if (!sourcesMatch) return []

  const lines = sourcesMatch[1].split('\n')
  return lines
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

// Contenu sans la section sources (elle est affichée en cartes)
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
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end mb-6 group"
      >
        <div className="flex gap-3 max-w-[85%] md:max-w-[75%] items-start">
          <div className="rounded-2xl rounded-tr-md px-4 py-2.5 bg-blue-50 dark:bg-[var(--accent-soft)] border border-blue-200/60 dark:border-[var(--accent)]/20 text-gray-900 dark:text-[var(--foreground)] text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5">
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
      transition={{ duration: 0.25 }}
      className="flex gap-3 mb-6 group"
    >
      <div className="shrink-0 mt-0.5">
        <NetralLogo size={26} animated={isStreaming} />
      </div>
      <div className="flex-1 min-w-0">
        {showOrb ? (
          <TypingOrb />
        ) : (
          <>
            <Markdown content={displayContent} />
            {isStreaming && <span className="stream-cursor" />}

            {/* Sources cards */}
            {!isStreaming && sources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-4"
              >
                <p className="text-xs font-semibold text-gray-400 dark:text-[var(--foreground-subtle)] uppercase tracking-wider mb-2">
                  Sources
                </p>
                <div className="flex flex-wrap gap-2">
                  {sources.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'group/src flex items-center gap-2 px-3 py-1.5 rounded-xl',
                        'bg-white dark:bg-[var(--background-elevated)]',
                        'border border-gray-200 dark:border-[var(--border)]',
                        'hover:border-blue-300 dark:hover:border-[var(--accent)]/40',
                        'hover:shadow-sm transition-all text-xs'
                      )}
                    >
                      {/* Favicon via Google */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${s.domain}&sz=32`}
                        alt=""
                        className="w-3.5 h-3.5 rounded-sm"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <span className="text-gray-600 dark:text-[var(--foreground-muted)] group-hover/src:text-blue-600 dark:group-hover/src:text-[var(--accent)] transition-colors font-medium truncate max-w-[140px]">
                        {s.domain}
                      </span>
                      <span className="text-blue-500 dark:text-[var(--accent)] text-[9px] font-bold">[{i + 1}]</span>
                      <ExternalLink size={10} className="text-gray-300 group-hover/src:text-blue-400 transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            {!isStreaming && (
              <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={copy}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-gray-400 dark:text-[var(--foreground-muted)] hover:bg-gray-100 dark:hover:bg-[var(--border)] hover:text-gray-700 dark:hover:text-[var(--foreground)] transition-colors"
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
                {isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-gray-400 dark:text-[var(--foreground-muted)] hover:bg-gray-100 dark:hover:bg-[var(--border)] hover:text-gray-700 dark:hover:text-[var(--foreground)] transition-colors"
                  >
                    <RotateCw size={11} />
                    Régénérer
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
