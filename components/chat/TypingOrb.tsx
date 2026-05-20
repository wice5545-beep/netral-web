'use client'

import { motion } from 'framer-motion'

export function TypingOrb() {
  return (
    <div className="flex items-center gap-2 py-2">
      <div className="relative w-4 h-4">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle, var(--gradient-1), var(--gradient-2))',
            boxShadow: '0 0 20px var(--accent-glow)',
          }}
          animate={{
            scale: [0.3, 0.9, 1.4, 0.9, 0.3],
            opacity: [0.6, 0.85, 1, 0.85, 0.6],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            times: [0, 0.2, 0.5, 0.8, 1],
          }}
        />
        <motion.div
          className="absolute inset-[-4px] rounded-full blur-md"
          style={{
            background:
              'radial-gradient(circle, var(--accent-glow), transparent)',
          }}
          animate={{
            scale: [0.5, 1.5, 0.5],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}
