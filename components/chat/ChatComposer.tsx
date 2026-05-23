'use client'

import { useRef, useEffect, KeyboardEvent, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Square, Plus, Globe, Image as ImageIcon, Paperclip, X, Mic } from 'lucide-react'
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
  placeholder = 'Posez votre question…',
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
      description: 'Consulter internet en temps réel',
      active: webSearchEnabled,
      onClick: () => { onToggleWebSearch?.(); setDrawerOpen(false) },
      disabled: false,
    },
    {
      icon: ImageIcon,
      label: 'Image',
      description: 'Joindre une image',
      active: false,
      onClick: () => {},
      disabled: true,
    },
    {
      icon: Paperclip,
      label: 'Document',
      description: 'PDF, texte, code',
      active: false,
      onClick: () => {},
      disabled: true,
    },
  ]

  return (
    <div className="relative w-full">
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 1px var(--jewel), 0 0 0 4px var(--jewel-soft), var(--shadow-card)'
            : webSearchEnabled
            ? '0 0 0 1px var(--jewel), var(--shadow-page)'
            : 'var(--shadow-page)',
        }}
        transition={{ duration: 0.2 }}
        className="relative rounded-[14px] bg-[var(--bg-elevated)] border border-[var(--rule)] overflow-hidden"
      >
        {/* Web search badge */}
        <AnimatePresence>
          {webSearchEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pt-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--jewel-soft)] border border-[var(--jewel)]/20">
                  <Globe size={11} className="text-[var(--jewel)]" />
                  <span className="text-[11px] font-medium text-[var(--jewel)]">Recherche web active</span>
                  <button
                    onClick={onToggleWebSearch}
                    className="ml-0.5 text-[var(--jewel)]/60 hover:text-[var(--jewel)]"
                    aria-label="Désactiver"
                  >
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
          maxLength={8000}
          className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[15px] leading-relaxed text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none max-h-[200px]"
        />

        <div className="flex items-center justify-between px-2.5 pb-2.5 pt-1">
          <div className="flex items-center gap-1" ref={drawerRef}>
            <div className="relative">
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => setDrawerOpen(!drawerOpen)}
                aria-label="Outils"
                className={cn(
                  'w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200',
                  drawerOpen
                    ? 'bg-[var(--fg)] text-[var(--bg)]'
                    : 'text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]'
                )}
              >
                <motion.div animate={{ rotate: drawerOpen ? 45 : 0 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}>
                  <Plus size={15} strokeWidth={2.2} />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {drawerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-full left-0 mb-2 w-60 card-float overflow-hidden z-50 p-1.5"
                  >
                    {drawerItems.map((item, i) => {
                      const Icon = item.icon
                      return (
                        <motion.button
                          key={item.label}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          type="button"
                          onClick={item.onClick}
                          disabled={item.disabled}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-left',
                            item.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--bg-soft)] cursor-pointer',
                            item.active && 'bg-[var(--jewel-soft)]'
                          )}
                        >
                          <Icon size={14} className={cn(item.active ? 'text-[var(--jewel)]' : 'text-[var(--fg-muted)]')} strokeWidth={1.8} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-[12px] font-medium text-[var(--fg)]">{item.label}</p>
                              {item.disabled && (
                                <span className="text-[8px] font-medium uppercase tracking-wider text-[var(--fg-subtle)]">Bientôt</span>
                              )}
                            </div>
                            <p className="text-[10px] text-[var(--fg-muted)] truncate">{item.description}</p>
                          </div>
                        </motion.button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ModelSelector />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Microphone"
              className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)] transition-colors"
            >
              <Mic size={14} strokeWidth={1.8} />
            </button>

            {isStreaming ? (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileTap={{ scale: 0.94 }}
                onClick={onStop}
                aria-label="Arrêter"
                className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--fg)] text-[var(--bg)]"
              >
                <Square size={11} fill="currentColor" />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={canSend ? { scale: 1.06 } : {}}
                whileTap={canSend ? { scale: 0.94 } : {}}
                onClick={onSubmit}
                disabled={!canSend}
                aria-label="Envoyer"
                className={cn(
                  'w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200',
                  canSend
                    ? 'bg-[var(--jewel)] text-white shadow-sm'
                    : 'bg-[var(--bg-soft)] text-[var(--fg-subtle)] cursor-not-allowed'
                )}
              >
                <ArrowUp size={14} strokeWidth={2.2} />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <p className="text-[10px] text-center text-[var(--fg-subtle)] mt-3 font-light">
        Netral peut faire des erreurs. Vérifiez les informations critiques.
      </p>
    </div>
  )
}
