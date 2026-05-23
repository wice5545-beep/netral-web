'use client'

import { useRef, useEffect, KeyboardEvent, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Square, Plus, Globe, Image, Paperclip, X, Mic } from 'lucide-react'
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
  placeholder = 'Posez votre question...',
  autoFocus,
  webSearchEnabled = false,
  onToggleWebSearch,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false)
      }
    }
    if (drawerOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [drawerOpen])

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isStreaming) onSubmit()
    }
  }

  const canSend = value.trim().length > 0 && !isStreaming

  const drawerItems = [
    {
      icon: Globe,
      label: 'Recherche web',
      description: 'Rechercher sur internet en temps réel',
      active: webSearchEnabled,
      onClick: () => { onToggleWebSearch?.(); setDrawerOpen(false) },
      disabled: false,
    },
    {
      icon: Image,
      label: 'Image',
      description: 'Envoyer une image',
      active: false,
      onClick: () => {},
      disabled: true,
    },
    {
      icon: Paperclip,
      label: 'Fichier',
      description: 'Joindre un document',
      active: false,
      onClick: () => {},
      disabled: true,
    },
  ]

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div
        className={cn(
          'relative rounded-2xl border bg-[var(--background-elevated)] overflow-hidden transition-shadow duration-200',
          focused ? 'border-[var(--accent)] shadow-[0_0_0_3px_var(--accent-soft)]' : 'border-[var(--border)]',
          webSearchEnabled && !focused && 'border-[var(--accent)]'
        )}
      >
        {/* Web search indicator */}
        <AnimatePresence>
          {webSearchEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-1.5 px-4 pt-3 pb-0">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)]/20">
                  <Globe size={11} className="text-[var(--accent)]" />
                  <span className="text-xs font-medium text-[var(--accent)]">Recherche web activée</span>
                  <button onClick={onToggleWebSearch} className="ml-0.5 text-[var(--accent)]/60 hover:text-[var(--accent)]">
                    <X size={10} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[15px] leading-relaxed text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none max-h-[200px]"
        />

        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <div className="flex items-center gap-1" ref={drawerRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDrawerOpen(!drawerOpen)}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                  drawerOpen
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]'
                )}
              >
                <Plus size={16} className={cn(drawerOpen && 'rotate-45', 'transition-transform')} />
              </button>

              <AnimatePresence>
                {drawerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 mb-2 w-56 bg-[var(--background-elevated)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <div className="p-1">
                      {drawerItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={item.onClick}
                            disabled={item.disabled}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left',
                              item.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--background-secondary)]',
                              item.active && 'bg-[var(--accent-soft)]'
                            )}
                          >
                            <Icon size={15} className="text-[var(--foreground-muted)]" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-[13px] font-medium text-[var(--foreground)]">{item.label}</p>
                                {item.disabled && (
                                  <span className="text-[9px] font-bold uppercase text-[var(--foreground-subtle)] bg-[var(--background-secondary)] px-1.5 py-0.5 rounded">Bientôt</span>
                                )}
                              </div>
                              <p className="text-[11px] text-[var(--foreground-muted)] truncate">{item.description}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ModelSelector />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] transition-colors"
            >
              <Mic size={15} />
            </button>

            {isStreaming ? (
              <button
                onClick={onStop}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--foreground)] text-[var(--background)]"
              >
                <Square size={11} fill="currentColor" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                disabled={!canSend}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                  canSend
                    ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                    : 'bg-[var(--border)] text-[var(--foreground-subtle)] cursor-not-allowed'
                )}
              >
                <ArrowUp size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
