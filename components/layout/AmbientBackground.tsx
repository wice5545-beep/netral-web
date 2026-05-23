'use client'

import { motion } from 'framer-motion'

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Subtle dot grid */}
      <div className="absolute inset-0 bg-grid opacity-[0.025] dark:opacity-[0.04]" />

      {/* Light mode — soft aurora */}
      <div
        className="aurora absolute top-[-15%] right-[0%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full opacity-50 dark:opacity-0"
        style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.8) 0%, rgba(167,139,250,0.3) 40%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <div
        className="aurora absolute bottom-[-15%] left-[-5%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full opacity-35 dark:opacity-0"
        style={{ background: 'radial-gradient(circle, rgba(139,127,255,0.7) 0%, rgba(109,40,217,0.2) 50%, transparent 70%)', filter: 'blur(100px)', animationDelay: '-6s' }}
      />
      <div
        className="aurora absolute top-[30%] left-[20%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full opacity-20 dark:opacity-0"
        style={{ background: 'radial-gradient(circle, rgba(216,180,254,0.6) 0%, transparent 70%)', filter: 'blur(70px)', animationDelay: '-12s' }}
      />

      {/* Dark mode — deep glowing orbs */}
      <motion.div
        className="absolute top-[-20%] right-[-8%] w-[65vw] h-[65vw] max-w-[750px] max-h-[750px] rounded-full opacity-0 dark:opacity-[0.22] blur-[140px]"
        style={{ background: 'radial-gradient(circle, #8b7fff 0%, #4c1d95 35%, transparent 70%)' }}
        animate={{ x: [0, 70, -40, 0], y: [0, -60, 40, 0], scale: [1, 1.12, 0.93, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-22%] left-[3%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full opacity-0 dark:opacity-[0.16] blur-[130px]"
        style={{ background: 'radial-gradient(circle, #6d28d9 0%, #312e81 40%, transparent 70%)' }}
        animate={{ x: [0, -60, 80, 0], y: [0, 40, -50, 0], scale: [1, 0.93, 1.15, 1] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute top-[35%] left-[35%] w-[35vw] h-[35vw] max-w-[450px] max-h-[450px] rounded-full opacity-0 dark:opacity-[0.12] blur-[110px]"
        style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }}
        animate={{ x: [0, 50, -30, 0], y: [0, -35, 25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 20%, var(--background) 85%)' }}
      />
    </div>
  )
}
