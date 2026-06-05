'use client'

import { motion } from 'framer-motion'

export function TypingOrb() {
  return (
    <div className="flex items-center gap-[5px] py-4 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[6.5px] h-[6.5px] rounded-full bg-black dark:bg-white"
          animate={{
            y: [0, -4, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.16,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}