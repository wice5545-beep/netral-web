'use client'

import { motion } from 'framer-motion'

export function TypingOrb() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      {[0, 0.18, 0.36].map((delay, i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--jewel)]"
          animate={{ scale: [0.6, 1.1, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay,
          }}
        />
      ))}
    </div>
  )
}
