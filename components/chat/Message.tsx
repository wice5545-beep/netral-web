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
      <div className="flex justify-end mb-5">
        <div className="max-w-[80%] md:max-w-[70%]">
          <div className="rounded-2xl rounded-br-md px-4 py-2.5 bg-[var(--accent)] text-white text-[14px] leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </div>
        </div>
      </div>
    )
  }

  const showOrb = isStreaming && content.length === 0
  const sources = !isStreaming ? extractSources(content) : []
  const displayContent = sources.length > 0 ? contentWithoutSources(content) : content

  return (
    <div className="flex gap-3 mb-5 group">
      <div className="shrink-0 mt-0.5">
        <NetralLogo size={28} />
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
              <div className="mt-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--foreground-subtle)] mb-2">Sources</p>
                <div className="flex flex-wrap gap-2">
                  {sources.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${s.domain}&sz=32`}
                        alt=""
                        className="w-3.5 h-3.5 rounded-sm"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <span className="font-medium truncate max-w-[120px]">{s.domain}</span>
                      <ExternalLink size={9} className="shrink-0 opacity-50" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {!isStreaming && (
              <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={copy}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] transition-colors"
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
                {isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] transition-colors"
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
    </div>
  )
}
