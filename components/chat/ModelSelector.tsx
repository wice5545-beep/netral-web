'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Zap, Sparkles, Cpu } from 'lucide-react'
import { MODELS, type ModelId } from '@/lib/ai/models'
import { useChatStore } from '@/lib/store/chat'

const modelIcons: Record<ModelId, typeof Zap> = {
  'ntrl-1.3': Sparkles,
  'ntrl-1.2': Cpu,
  'ntrl-1.0': Zap,
}

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
  const Icon = modelIcons[currentModel]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isStreaming}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[var(--bg-soft)] transition-colors text-[12px] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Icon size={12} className="text-[var(--jewel)]" strokeWidth={1.8} />
        <span className="font-medium text-[var(--fg-soft)]">{model.displayName}</span>
        <ChevronDown size={11} className="text-[var(--fg-muted)]" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full left-0 mb-2 w-72 card-float overflow-hidden z-50"
          >
            <div className="p-1.5">
              {(Object.values(MODELS) as typeof MODELS[ModelId][]).map((m) => {
                const active = m.id === currentModel
                const MIcon = modelIcons[m.id as ModelId]
                return (
                  <button
                    key={m.id}
                    onClick={() => { setModel(m.id); setOpen(false) }}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
                      active ? 'bg-[var(--jewel-soft)]' : 'hover:bg-[var(--bg-soft)]'
                    }`}
                  >
                    <MIcon size={14} className={active ? 'text-[var(--jewel)] mt-0.5 shrink-0' : 'text-[var(--fg-muted)] mt-0.5 shrink-0'} strokeWidth={1.8} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[13px] text-[var(--fg)]">{m.displayName}</p>
                        {active && <Check size={11} className="text-[var(--jewel)]" />}
                      </div>
                      <p className="text-[11px] text-[var(--fg-muted)] mt-0.5">{m.description}</p>
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
