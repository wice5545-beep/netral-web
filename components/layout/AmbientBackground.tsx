'use client'

import { motion } from 'framer-motion'

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Warm gradient orbs */}
      <motion.div
        className="absolute top-[-15%] right-[-8%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full opacity-[0.03] dark:opacity-[0.05]"
        style={{ 
          background: 'radial-gradient(circle, #b08d57 0%, #ddc28a 30%, transparent 70%)', 
          filter: 'blur(60px)' 
        }}
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-20%] left-[-10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full opacity-[0.025] dark:opacity-[0.04]"
        style={{ 
          background: 'radial-gradient(circle, #967744 0%, #b08d57 40%, transparent 70%)', 
          filter: 'blur(80px)' 
        }}
        animate={{ x: [0, -25, 35, 0], y: [0, 25, -20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, var(--background) 90%)' }}
      />
    </div>
  )
}
