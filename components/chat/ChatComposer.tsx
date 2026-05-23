'use client'

import { useRef, useEffect, KeyboardEvent, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Square, Plus, X } from 'lucide-react'
import { EarthIcon } from '@/components/ui/earth'
import { EyeIcon } from '@/components/ui/eye'
import { AutoAnimate } from '@/components/ui/AutoAnimate'
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
  const [drawerOpen, setDrawerOpen] = useState(false)

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
      <div className="relative rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--border-strong)] transition-colors">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={1}
          maxLength={32000}
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-[15px] leading-[1.5] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none max-h-[200px]"
        />

        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-0.5">
            {/* + button */}
            <button
              type="button"
              onClick={() => setDrawerOpen(!drawerOpen)}
              className={cn(
                'h-8 w-8 rounded-lg flex items-center justify-center transition-all',
                drawerOpen
                  ? 'bg-[var(--accent)] text-[var(--bg)] rotate-45'
                  : 'text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]'
              )}
            >
              <Plus size={16} strokeWidth={2} />
            </button>

            {/* Active indicators */}
            {webSearchEnabled && (
              <span className="h-6 px-2 rounded-md bg-[var(--accent-soft)] text-[var(--fg)] text-[11px] font-medium flex items-center gap-1">
                <EarthIcon size={10} /> Web
              </span>
            )}

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
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--accent)] text-[var(--bg)]"
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
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150',
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

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-md)] p-1.5 flex gap-1"
          >
            <button
              onClick={() => { onToggleWebSearch?.(); setDrawerOpen(false) }}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-all',
                webSearchEnabled ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : 'text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]'
              )}
            >
              <AutoAnimate icon={EarthIcon} size={14} interval={0} />
              Web
            </button>
            <button
              disabled
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)] transition-all disabled:opacity-40"
            >
              <AutoAnimate icon={EyeIcon} size={14} interval={0} />
              Image
            </button>
            <button
              disabled
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)] transition-all disabled:opacity-40"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
              Fichier
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-[11px] text-center text-[var(--fg-subtle)] mt-2 opacity-60">
        Netral peut faire des erreurs.
      </p>
    </div>
  )
}
