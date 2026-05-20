'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Zap, Sparkles } from 'lucide-react'
import { MODELS, type ModelId } from '@/lib/ai/models'
import { useChatStore } from '@/lib/store/chat'

export function ModelSelector() {
  const { currentModel, setModel, isStreaming } = useChatStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const model = MODELS[currentModel]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isStreaming}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[var(--border)] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {model.id === 'ntrl-1.0' ? (
          <Zap size={13} className="text-[var(--accent)]" />
        ) : (
          <Sparkles size={13} className="text-[var(--accent)]" />
        )}
        <span className="font-medium">{model.displayName}</span>
        <ChevronDown size={13} className="text-[var(--foreground-muted)]" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1.5 w-72 glass-strong rounded-xl border border-[var(--border-strong)] shadow-2xl overflow-hidden z-50"
          >
            <div className="p-1">
              {(Object.values(MODELS) as typeof MODELS[ModelId][]).map((m) => {
                const active = m.id === currentModel
                const Icon = m.id === 'ntrl-1.0' ? Zap : Sparkles
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setModel(m.id)
                      setOpen(false)
                    }}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      active ? 'bg-[var(--border)]' : 'hover:bg-[var(--border)]'
                    }`}
                  >
                    <Icon size={16} className="text-[var(--accent)] mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{m.displayName}</p>
                        {active && <Check size={13} className="text-[var(--accent)]" />}
                      </div>
                      <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{m.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
