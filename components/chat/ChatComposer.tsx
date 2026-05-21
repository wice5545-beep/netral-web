'use client'

import { useRef, useEffect, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, Square, Globe } from 'lucide-react'
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
  placeholder = 'Envoyez un message…',
  autoFocus,
  webSearchEnabled = false,
  onToggleWebSearch,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
    <div className="relative w-full max-w-3xl mx-auto">
      <motion.div
        className={cn(
          'relative rounded-2xl bg-white border shadow-lg shadow-gray-200/60',
          'dark:bg-[var(--background-elevated)] dark:shadow-none',
          'transition-all duration-200',
          webSearchEnabled
            ? 'border-blue-300 shadow-blue-100/80 dark:border-blue-500/40'
            : 'border-gray-200 dark:border-[var(--border-strong)]',
          'focus-within:border-blue-400 focus-within:shadow-blue-100 dark:focus-within:border-[var(--accent)] dark:focus-within:shadow-[0_0_20px_var(--accent-glow)]'
        )}
        whileHover={{ scale: 1.002 }}
        transition={{ duration: 0.15 }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[15px] leading-relaxed text-gray-900 dark:text-[var(--foreground)] placeholder:text-gray-400 dark:placeholder:text-[var(--foreground-subtle)] focus:outline-none max-h-[200px]"
        />

        {/* Bottom row */}
        <div className="flex items-center justify-between px-2 pb-2.5 pt-1">
          <div className="flex items-center gap-1">
            <ModelSelector />
            {/* Web search toggle */}
            {onToggleWebSearch && (
              <button
                type="button"
                onClick={onToggleWebSearch}
                title={webSearchEnabled ? 'Désactiver la recherche web' : 'Activer la recherche web'}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                  webSearchEnabled
                    ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[var(--border)]'
                )}
              >
                <Globe size={13} />
                <span className="hidden sm:inline">{webSearchEnabled ? 'Web activé' : 'Recherche web'}</span>
              </button>
            )}
          </div>

          {isStreaming ? (
            <motion.button
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={onStop}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900 dark:bg-[var(--foreground)] text-white dark:text-[var(--background)] hover:opacity-80 transition-opacity"
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
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-sm shadow-blue-500/30'
                  : 'bg-gray-100 dark:bg-[var(--border)] text-gray-400 dark:text-[var(--foreground-subtle)] cursor-not-allowed'
              )}
            >
              <ArrowUp size={14} />
            </button>
          )}
        </div>
      </motion.div>

      <p className="text-[10px] text-center text-gray-400 dark:text-[var(--foreground-subtle)] mt-2">
        Netral peut faire des erreurs. Vérifiez les informations importantes.
      </p>
    </div>
  )
}
