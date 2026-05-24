'use client'

import { motion } from 'framer-motion'

export function TypingOrb() {
  return (
    <div className="flex items-center gap-[5px] py-3 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[7px] h-[7px] rounded-full"
          style={{ background: `linear-gradient(135deg, ${i === 0 ? '#7c3aed' : i === 1 ? '#ec4899' : '#f97316'}, var(--fg-muted))` }}
          animate={{
            y: [0, -8, 0],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.18,
            ease: [0.45, 0, 0.55, 1],
          }}
        />
      ))}
    </div>
  )
}
