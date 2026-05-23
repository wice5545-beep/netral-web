'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
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
        className="h-8 px-2.5 rounded-md hover:bg-[var(--bg-soft)] transition-colors text-[12.5px] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
      >
        <span className="font-medium text-[var(--fg)]">{model.displayName}</span>
        <ChevronDown size={11} className="text-[var(--fg-muted)]" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-1.5 w-64 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg shadow-[var(--shadow-md)] overflow-hidden z-50"
          >
            <div className="p-1">
              {(Object.values(MODELS) as typeof MODELS[ModelId][]).map((m) => {
                const active = m.id === currentModel
                return (
                  <button
                    key={m.id}
                    onClick={() => { if (m.id !== 'ntrl-1.2') { setModel(m.id); setOpen(false) } }}
                    className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-md text-left transition-colors ${
                      active ? 'bg-[var(--bg-soft)]' : 'hover:bg-[var(--bg-soft)]'
                    } ${m.id === 'ntrl-1.2' ? 'opacity-60' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[13px] text-[var(--fg)]">{m.displayName}</p>
                        {m.id === 'ntrl-1.2' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--accent-soft)] text-[var(--fg-muted)]">PRO</span>}
                        {active && <Check size={12} className="text-[var(--fg)]" />}
                      </div>
                      <p className="text-[11.5px] text-[var(--fg-muted)] mt-0.5">{m.description}</p>
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
