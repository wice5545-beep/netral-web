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

  // Fermer le tiroir si clic en dehors
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
      onClick: () => {
        onToggleWebSearch?.()
        setDrawerOpen(false)
      },
      disabled: false,
      color: 'blue',
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
          'relative rounded-2xl bg-white border shadow-lg shadow-gray-200/60',
          'dark:bg-[var(--background-elevated)] dark:shadow-none',
          'transition-all duration-200',
          webSearchEnabled
            ? 'border-blue-300 shadow-blue-100/80 dark:border-blue-500/40'
            : 'border-gray-200 dark:border-[var(--border-strong)]',
          'focus-within:border-blue-400 focus-within:shadow-blue-100 dark:focus-within:border-[var(--accent)] dark:focus-within:shadow-[0_0_20px_var(--accent-glow)]'
        )}
      >
        {/* Web search active chip — inside composer top */}
        <AnimatePresence>
          {webSearchEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-1.5 px-4 pt-3 pb-0">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 dark:bg-blue-500/15 dark:border-blue-500/30">
                  <Globe size={11} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Recherche web activée</span>
                  <button
                    onClick={onToggleWebSearch}
                    className="ml-0.5 text-blue-400 hover:text-blue-600 transition-colors"
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
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[15px] leading-relaxed text-gray-900 dark:text-[var(--foreground)] placeholder:text-gray-400 dark:placeholder:text-[var(--foreground-subtle)] focus:outline-none max-h-[200px]"
        />

        {/* Bottom row */}
        <div className="flex items-center justify-between px-2 pb-2.5 pt-1">
          <div className="flex items-center gap-1" ref={drawerRef}>
            {/* "+" button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDrawerOpen(!drawerOpen)}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150',
                  drawerOpen
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-[var(--border)] text-gray-500 dark:text-[var(--foreground-muted)] hover:bg-gray-200 dark:hover:bg-[var(--border-strong)]'
                )}
                title="Ajouter un contenu"
              >
                <motion.div
                  animate={{ rotate: drawerOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus size={15} />
                </motion.div>
              </button>

              {/* Drawer / Popover */}
              <AnimatePresence>
                {drawerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-full left-0 mb-2 w-60 bg-white dark:bg-[var(--background-elevated)] rounded-2xl border border-gray-200 dark:border-[var(--border-strong)] shadow-xl dark:shadow-black/30 overflow-hidden z-50"
                  >
                    <div className="p-1.5">
                      {drawerItems.map((item) => {
                        const Icon = item.icon
                        const colorMap: Record<string, string> = {
                          blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
                          violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
                          emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
                        }
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={item.onClick}
                            disabled={item.disabled}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left',
                              item.disabled
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:bg-gray-50 dark:hover:bg-[var(--border)] cursor-pointer',
                              item.active && 'bg-blue-50 dark:bg-blue-500/10'
                            )}
                          >
                            <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', colorMap[item.color])}>
                              <Icon size={15} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-medium text-gray-800 dark:text-[var(--foreground)]">{item.label}</p>
                                {item.disabled && (
                                  <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-400 bg-gray-100 dark:bg-[var(--border)] px-1.5 py-0.5 rounded-full">
                                    Bientôt
                                  </span>
                                )}
                                {item.active && (
                                  <span className="text-[9px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-1.5 py-0.5 rounded-full">
                                    Actif
                                  </span>
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
                        L&apos;IA peut aussi activer la recherche automatiquement selon votre question.
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
