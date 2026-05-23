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
  placeholder = 'Message NTRL…',
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
      label: 'Web search',
      description: 'Search the internet in real time',
      active: webSearchEnabled,
      onClick: () => { onToggleWebSearch?.(); setDrawerOpen(false) },
      disabled: false,
      gradient: 'from-violet-400 to-indigo-500',
    },
    {
      icon: Image,
      label: 'Image',
      description: 'Send an image',
      active: false,
      onClick: () => {},
      disabled: true,
      gradient: 'from-pink-400 to-rose-500',
    },
    {
      icon: Paperclip,
      label: 'File',
      description: 'Attach a document',
      active: false,
      onClick: () => {},
      disabled: true,
      gradient: 'from-amber-400 to-orange-500',
    },
  ]

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 1.5px var(--accent), 0 12px 48px var(--accent-glow), 0 4px 12px rgba(0,0,0,0.15)'
            : webSearchEnabled
            ? '0 0 0 1px var(--accent), 0 6px 24px rgba(0,0,0,0.1)'
            : '0 0 0 1px var(--glass-border), 0 4px 20px rgba(0,0,0,0.08)',
        }}
        transition={{ duration: 0.25 }}
        className="relative rounded-2xl glass-panel overflow-hidden"
      >
        {/* Top accent line when focused */}
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
            />
          )}
        </AnimatePresence>

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
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)]/30">
                  <Globe size={11} className="text-[var(--accent)]" />
                  <span className="text-xs font-semibold text-[var(--accent)]">Web search on</span>
                  <button onClick={onToggleWebSearch} className="ml-0.5 text-[var(--accent)]/60 hover:text-[var(--accent)] transition-colors">
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

        <div className="flex items-center justify-between px-2 pb-2.5 pt-1">
          <div className="flex items-center gap-1" ref={drawerRef}>
            <div className="relative">
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setDrawerOpen(!drawerOpen)}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200',
                  drawerOpen
                    ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]'
                    : 'bg-[var(--border)]/80 text-[var(--foreground-muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]'
                )}
              >
                <motion.div animate={{ rotate: drawerOpen ? 45 : 0 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}>
                  <Plus size={15} />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {drawerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.93 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.93 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-full left-0 mb-2 w-64 glass-panel rounded-2xl overflow-hidden z-50"
                  >
                    <div className="p-1.5">
                      {drawerItems.map((item, i) => {
                        const Icon = item.icon
                        return (
                          <motion.button
                            key={item.label}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            type="button"
                            onClick={item.onClick}
                            disabled={item.disabled}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left',
                              item.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--border)]/60 cursor-pointer',
                              item.active && 'bg-[var(--accent-soft)]'
                            )}
                          >
                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                              <Icon size={14} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-[13px] font-semibold text-[var(--foreground)]">{item.label}</p>
                                {item.disabled && (
                                  <span className="text-[9px] font-bold uppercase tracking-wide text-[var(--foreground-subtle)] bg-[var(--border)] px-1.5 py-0.5 rounded-full">Soon</span>
                                )}
                                {item.active && (
                                  <span className="text-[9px] font-bold uppercase tracking-wide text-[var(--accent)] bg-[var(--accent-soft)] px-1.5 py-0.5 rounded-full">On</span>
                                )}
                              </div>
                              <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5 truncate">{item.description}</p>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                    <div className="px-3 pb-2.5 pt-0.5">
                      <p className="text-[10px] text-[var(--foreground-subtle)]">
                        NTRL may also activate search automatically when needed.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ModelSelector />
          </div>

          <div className="flex items-center gap-1.5">
            {/* Mic button (decorative) */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-[var(--border)]/80 text-[var(--foreground-muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-all duration-200"
            >
              <Mic size={13} />
            </motion.button>

            {isStreaming ? (
              <motion.button
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={onStop}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-[var(--foreground)] text-[var(--background)] hover:opacity-80 transition-opacity shadow-lg"
              >
                <Square size={11} fill="currentColor" />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={canSend ? { scale: 1.08 } : {}}
                whileTap={canSend ? { scale: 0.92 } : {}}
                onClick={onSubmit}
                disabled={!canSend}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200',
                  canSend
                    ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]'
                    : 'bg-[var(--border)]/80 text-[var(--foreground-subtle)] cursor-not-allowed'
                )}
              >
                <ArrowUp size={14} />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <p className="text-[10px] text-center text-[var(--foreground-subtle)] mt-2.5">
        NTRL can make mistakes. Always verify important information.
      </p>
    </div>
  )
}
