'use client'

import { useRef, useEffect, KeyboardEvent, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Square, Globe, Paperclip } from 'lucide-react'
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
  webSearchEnabled?: boolean
  onToggleWebSearch?: () => void
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  onStop,
  isStreaming,
  placeholder = 'Posez une question…',
  autoFocus,
  webSearchEnabled = false,
  onToggleWebSearch,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus()
  }, [autoFocus])

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
    <div className="relative w-full">
      <div
        className={cn(
          'relative rounded-2xl bg-[var(--bg-elevated)] border transition-all duration-200',
          focused
            ? 'border-[var(--accent)] shadow-[0_0_0_3px_var(--accent-soft)]'
            : 'border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--border-strong)]'
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={1}
          maxLength={8000}
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-[15px] leading-[1.5] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none max-h-[200px]"
        />

        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-0.5">
            {/* Web search toggle */}
            <button
              type="button"
              onClick={onToggleWebSearch}
              aria-label="Recherche web"
              aria-pressed={webSearchEnabled}
              className={cn(
                'h-8 px-2.5 rounded-md flex items-center gap-1.5 text-[12.5px] transition-all',
                webSearchEnabled
                  ? 'bg-[var(--accent-soft)] text-[var(--fg)]'
                  : 'text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]'
              )}
            >
              <Globe size={13} strokeWidth={1.8} />
              <span className="font-medium">Web</span>
            </button>

            {/* Attach (decorative for now) */}
            <button
              type="button"
              aria-label="Joindre un fichier"
              disabled
              className="h-8 w-8 rounded-md flex items-center justify-center text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)] transition-colors disabled:opacity-50"
            >
              <Paperclip size={13} strokeWidth={1.8} />
            </button>

            <ModelSelector />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {isStreaming ? (
              <motion.button
                key="stop"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.15 }}
                onClick={onStop}
                aria-label="Arrêter"
                className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--accent)] text-[var(--bg)]"
              >
                <Square size={11} fill="currentColor" />
              </motion.button>
            ) : (
              <motion.button
                key="send"
                whileTap={canSend ? { scale: 0.94 } : {}}
                onClick={onSubmit}
                disabled={!canSend}
                aria-label="Envoyer"
                className={cn(
                  'w-8 h-8 rounded-md flex items-center justify-center transition-all duration-150',
                  canSend
                    ? 'bg-[var(--accent)] text-[var(--bg)]'
                    : 'bg-[var(--bg-soft)] text-[var(--fg-subtle)] cursor-not-allowed'
                )}
              >
                <ArrowUp size={14} strokeWidth={2.2} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="text-[11px] text-center text-[var(--fg-subtle)] mt-2">
        Netral peut faire des erreurs. Vérifiez les informations importantes.
      </p>
    </div>
  )
}
