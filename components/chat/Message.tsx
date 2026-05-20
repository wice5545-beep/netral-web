'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, RotateCw, User } from 'lucide-react'
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
          <div className="rounded-2xl rounded-tr-md px-4 py-2.5 bg-[var(--accent-soft)] border border-[var(--accent)]/20 text-[var(--foreground)] text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--gradient-1)] to-[var(--gradient-2)] flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5">
            {userInitial?.toUpperCase() ?? <User size={12} />}
          </div>
        </div>
      </motion.div>
    )
  }

  // Empty assistant message → typing orb
  const showOrb = isStreaming && content.length === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3 mb-6 group"
    >
      <div className="shrink-0 mt-0.5">
        <NetralLogo size={28} animated={isStreaming} />
      </div>
      <div className="flex-1 min-w-0">
        {showOrb ? (
          <TypingOrb />
        ) : (
          <>
            <Markdown content={content} />
            {isStreaming && <span className="stream-cursor" />}
            {!isStreaming && (
              <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={copy}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-[var(--foreground-muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)] transition-colors"
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                {isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-[var(--foreground-muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <RotateCw size={11} />
                    Regenerate
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
