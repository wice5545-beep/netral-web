'use client'

import { motion } from 'framer-motion'

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid opacity-[0.04] dark:opacity-[0.06]" />

      {/* Light mode: soft blue gradients */}
      <motion.div
        className="absolute top-[-15%] right-[-5%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full blur-[100px] dark:opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(219,234,254,0.9) 0%, transparent 70%)', opacity: 0.7 }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.08, 0.97, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] dark:opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(191,219,254,0.7) 0%, transparent 70%)', opacity: 0.5 }}
        animate={{ x: [0, -30, 50, 0], y: [0, 25, -35, 0], scale: [1, 0.95, 1.1, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Dark mode: colorful orbs (inherit from CSS vars) */}
      <motion.div
        className="absolute top-[-20%] left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full opacity-0 dark:opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(circle, var(--gradient-1) 0%, transparent 70%)' }}
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[5%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full opacity-0 dark:opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, var(--gradient-2) 0%, transparent 70%)' }}
        animate={{ x: [0, -60, 80, 0], y: [0, 40, -50, 0], scale: [1, 0.95, 1.15, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 0%, var(--background) 88%)' }}
      />
    </div>
  )
}
