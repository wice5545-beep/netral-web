'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import type { SearchStatus } from './ChatInterface'

/**
 * Multi-state thinking indicator.
 * Replaces the legacy 3-dot TypingOrb with:
 *  - A morphing constellation of 3 colored orbs orbiting a central pulsing core
 *  - Status-aware label (searching / reading / thinking / null)
 *  - Smooth state transitions
 *
 * Used by Message.tsx when assistant is streaming and content is empty.
 */
export function ThinkingIndicator({ status }: { status?: SearchStatus }) {
  const { t } = useI18n()

  // Resolve status label
  const label = (() => {
    if (!status) return t.chat?.thinking ?? 'Réflexion en cours…'
    if (status === 'searching') return t.chat?.searching ?? 'Recherche sur le web…'
    if (status === 'reading') return t.chat?.reading ?? 'Lecture des sources…'
    if (status === 'thinking') return t.chat?.thinking ?? 'Réflexion en cours…'
    return ''
  })()

  return (
    <div className="flex items-center gap-3 py-1.5">
      {/* Constellation orb */}
      <div className="relative w-7 h-7 shrink-0">
        {/* Pulsing rings */}
        {[0, 1].map((i) => (
          <motion.span
            key={`ring-${i}`}
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: 'rgba(124,58,237,0.35)' }}
            animate={{ scale: [1, 1.6 + i * 0.25], opacity: [0.5, 0] }}
            transition={{
              duration: 2.2,
              delay: i * 0.65,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Central core — pulses */}
        <motion.div
          className="absolute inset-[7px] rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, #7c3aed, #ec4899, #f97316, #7c3aed)',
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-[10px] rounded-full bg-[var(--bg)]"
          animate={{ scale: [1, 0.85, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Orbiting dots */}
        <motion.span
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: '#7c3aed', boxShadow: '0 0 8px rgba(124,58,237,0.7)' }}
          animate={{
            x: [0, 8, 0, -8, 0],
            y: [0, 6, 14, 6, 0],
            scale: [1, 1.3, 0.8, 1.2, 1],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: '#ec4899', boxShadow: '0 0 8px rgba(236,72,153,0.7)' }}
          animate={{
            x: [0, -8, 0, 8, 0],
            y: [0, -6, -14, -6, 0],
            scale: [1, 1.2, 0.8, 1.3, 1],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: '#f97316', boxShadow: '0 0 8px rgba(249,115,22,0.7)' }}
          animate={{
            x: [0, 6, 14, 6, 0],
            y: [0, -8, 0, 8, 0],
            scale: [1, 0.8, 1.3, 0.9, 1],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
      </div>

      {/* Animated label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={status ?? 'idle'}
          initial={{ opacity: 0, y: 4, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-[13.5px] streaming-shimmer font-medium tracking-[-0.005em]"
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
