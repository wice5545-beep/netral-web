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
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 2px var(--accent-soft), var(--shadow-medium)'
            : webSearchEnabled
            ? '0 0 0 2px var(--accent-soft), var(--shadow-soft)'
            : 'var(--shadow-soft)',
        }}
        transition={{ duration: 0.2 }}
        className="relative rounded-2xl bg-[var(--background-elevated)] overflow-hidden border border-[var(--border)]"
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
                  <span className="text-[11px] font-medium text-[var(--accent)]">Recherche web activée</span>
                  <button onClick={onToggleWebSearch} className="ml-0.5 text-[var(--accent)]/50 hover:text-[var(--accent)] transition-colors">
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
          <div className="flex items-center gap-0.5" ref={drawerRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDrawerOpen(!drawerOpen)}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200',
                  drawerOpen
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]'
                )}
              >
                <motion.div animate={{ rotate: drawerOpen ? 45 : 0 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
                  <Plus size={15} />
                </motion.div>
              </button>

              <AnimatePresence>
                {drawerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-full left-0 mb-2 w-60 bg-[var(--background-elevated)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <div className="p-1.5">
                      {drawerItems.map((item, i) => {
                        const Icon = item.icon
                        return (
                          <motion.button
                            key={item.label}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            type="button"
                            onClick={item.onClick}
                            disabled={item.disabled}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left',
                              item.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--background-secondary)]',
                              item.active && 'bg-[var(--accent-soft)]'
                            )}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[var(--background-secondary)] flex items-center justify-center shrink-0">
                              <Icon size={14} className="text-[var(--foreground-muted)]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-[12px] font-medium text-[var(--foreground)]">{item.label}</p>
                                {item.disabled && (
                                  <span className="text-[8px] font-bold uppercase text-[var(--foreground-subtle)] bg-[var(--background-secondary)] px-1.5 py-0.5 rounded">Bientôt</span>
                                )}
                              </div>
                              <p className="text-[11px] text-[var(--foreground-muted)] truncate">{item.description}</p>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ModelSelector />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] transition-colors"
            >
              <Mic size={14} />
            </button>

            {isStreaming ? (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStop}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-[var(--foreground)] text-[var(--background)] shadow-sm"
              >
                <Square size={11} fill="currentColor" />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={canSend ? { scale: 1.05 } : {}}
                whileTap={canSend ? { scale: 0.95 } : {}}
                onClick={onSubmit}
                disabled={!canSend}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200',
                  canSend
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'bg-[var(--background-secondary)] text-[var(--foreground-subtle)] cursor-not-allowed'
                )}
              >
                <ArrowUp size={14} />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <p className="text-[10px] text-center text-[var(--foreground-subtle)] mt-3 font-light">
        Netral peut faire des erreurs. Vérifiez les informations importantes.
      </p>
    </div>
  )
}
