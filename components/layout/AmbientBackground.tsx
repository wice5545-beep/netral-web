'use client'

import { motion } from 'framer-motion'

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-[0.15] dark:opacity-[0.07]" />

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-[-20%] left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, var(--gradient-1) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[5%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full opacity-25 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, var(--gradient-2) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -60, 80, 0],
          y: [0, 40, -50, 0],
          scale: [1, 0.95, 1.15, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full opacity-20 blur-[100px]"
        style={{
          background:
            'radial-gradient(circle, var(--gradient-3) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 100, -80, 0],
          y: [0, -80, 60, 0],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, var(--background) 85%)',
        }}
      />
    </div>
  )
}
