'use client'

import { useRef, useEffect, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, Square, Paperclip } from 'lucide-react'
import { ModelSelector } from './ModelSelector'
import { cn } from '@/lib/utils'

interface ChatComposerProps {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onStop?: () => void
  isStreaming: boolean
  placeholder?: string
  autoFocus?: boolean
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  onStop,
  isStreaming,
  placeholder = 'Message Netral…',
  autoFocus,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus()
  }, [autoFocus])

  // Auto-resize
  useEffect(() => {
    const t = textareaRef.current
    if (!t) return
    t.style.height = 'auto'
    t.style.height = Math.min(t.scrollHeight, 200) + 'px'
  }, [value])

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isStreaming) onSubmit()
    }
  }

  const canSend = value.trim().length > 0 && !isStreaming

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div
        className={cn(
          'relative rounded-2xl bg-[var(--background-elevated)] border border-[var(--border-strong)] shadow-lg',
          'focus-within:border-[var(--accent)] focus-within:shadow-[0_0_30px_var(--accent-glow)] transition-all duration-200'
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[15px] leading-relaxed placeholder:text-[var(--foreground-subtle)] focus:outline-none max-h-[200px]"
        />

        {/* Bottom row */}
        <div className="flex items-center justify-between px-2 pb-2 pt-1">
          <div className="flex items-center gap-1">
            <ModelSelector />
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              title="Attach file (coming soon)"
              disabled
            >
              <Paperclip size={14} />
            </button>
          </div>

          {isStreaming ? (
            <motion.button
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={onStop}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--foreground)] text-[var(--background)] hover:opacity-80 transition-opacity"
            >
              <Square size={12} fill="currentColor" />
            </motion.button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSend}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150',
                canSend
                  ? 'bg-[var(--foreground)] text-[var(--background)] hover:opacity-80 hover:scale-105'
                  : 'bg-[var(--border)] text-[var(--foreground-subtle)] cursor-not-allowed'
              )}
            >
              <ArrowUp size={14} />
            </button>
          )}
        </div>
      </div>

      <p className="text-[10px] text-center text-[var(--foreground-subtle)] mt-2 px-4">
        Netral may make mistakes. Verify important info.
      </p>
    </div>
  )
}
