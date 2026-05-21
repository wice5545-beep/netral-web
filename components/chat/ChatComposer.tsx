'use client'

import { useRef, useEffect, KeyboardEvent, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Square, Plus, Globe, Image, Paperclip, X } from 'lucide-react'
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
  const drawerRef = useRef<HTMLDivElement>(null)
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
      description: 'Cherche sur Internet en temps réel',
      active: webSearchEnabled,
      onClick: () => { onToggleWebSearch?.(); setDrawerOpen(false) },
      disabled: false,
      color: 'orange',
    },
    {
      icon: Image,
      label: 'Image',
      description: 'Envoyer une image',
      active: false,
      onClick: () => {},
      disabled: true,
      color: 'violet',
    },
    {
      icon: Paperclip,
      label: 'Fichier',
      description: 'Joindre un document',
      active: false,
      onClick: () => {},
      disabled: true,
      color: 'emerald',
    },
  ]

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <motion.div
        className={cn(
          'relative rounded-2xl bg-white border shadow-lg shadow-gray-100/80',
          'dark:bg-[var(--background-elevated)] dark:shadow-none transition-all duration-200',
          webSearchEnabled
            ? 'border-orange-300 shadow-orange-50/60 dark:border-orange-500/40'
            : 'border-gray-200 dark:border-[var(--border-strong)]',
          'focus-within:border-orange-300 focus-within:shadow-orange-50 dark:focus-within:border-[var(--accent)] dark:focus-within:shadow-[0_0_20px_var(--accent-glow)]'
        )}
      >
        {/* Web search chip */}
        <AnimatePresence>
          {webSearchEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-1.5 px-4 pt-3 pb-0">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 dark:bg-orange-500/15 dark:border-orange-500/30">
                  <Globe size={11} className="text-orange-500 dark:text-orange-400" />
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">Recherche web activée</span>
                  <button onClick={onToggleWebSearch} className="ml-0.5 text-orange-400 hover:text-orange-600 transition-colors">
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
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[15px] leading-relaxed text-gray-900 dark:text-[var(--foreground)] placeholder:text-gray-400 dark:placeholder:text-[var(--foreground-subtle)] focus:outline-none max-h-[200px]"
        />

        <div className="flex items-center justify-between px-2 pb-2.5 pt-1">
          <div className="flex items-center gap-1" ref={drawerRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDrawerOpen(!drawerOpen)}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150',
                  drawerOpen
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-[var(--border)] text-gray-500 dark:text-[var(--foreground-muted)] hover:bg-orange-50 hover:text-orange-500 dark:hover:bg-[var(--border-strong)]'
                )}
              >
                <motion.div animate={{ rotate: drawerOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
                  <Plus size={15} />
                </motion.div>
              </button>

              <AnimatePresence>
                {drawerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-full left-0 mb-2 w-60 bg-white dark:bg-[var(--background-elevated)] rounded-2xl border border-gray-100 dark:border-[var(--border-strong)] shadow-xl shadow-orange-50/40 dark:shadow-black/30 overflow-hidden z-50"
                  >
                    <div className="p-1.5">
                      {drawerItems.map((item) => {
                        const Icon = item.icon
                        const colorMap: Record<string, string> = {
                          orange: 'bg-orange-50 text-orange-500 dark:bg-orange-500/15 dark:text-orange-400',
                          violet: 'bg-violet-50 text-violet-500 dark:bg-violet-500/15 dark:text-violet-400',
                          emerald: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-400',
                        }
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={item.onClick}
                            disabled={item.disabled}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left',
                              item.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-orange-50/60 dark:hover:bg-[var(--border)] cursor-pointer',
                              item.active && 'bg-orange-50 dark:bg-orange-500/10'
                            )}
                          >
                            <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', colorMap[item.color])}>
                              <Icon size={15} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-semibold text-gray-800 dark:text-[var(--foreground)]">{item.label}</p>
                                {item.disabled && (
                                  <span className="text-[9px] font-bold uppercase tracking-wide text-gray-400 bg-gray-100 dark:bg-[var(--border)] px-1.5 py-0.5 rounded-full">Bientôt</span>
                                )}
                                {item.active && (
                                  <span className="text-[9px] font-bold uppercase tracking-wide text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/20 px-1.5 py-0.5 rounded-full">Actif</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 dark:text-[var(--foreground-subtle)] mt-0.5 truncate">{item.description}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    <div className="px-3 pb-2.5">
                      <p className="text-[10px] text-gray-400 dark:text-[var(--foreground-subtle)]">
                        L&apos;IA active aussi la recherche automatiquement si besoin.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ModelSelector />
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
                  ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 shadow-sm shadow-orange-400/30'
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
