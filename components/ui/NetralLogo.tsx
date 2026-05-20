'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NetralLogoProps {
  size?: number
  className?: string
  animated?: boolean
  withText?: boolean
}

export function NetralLogo({ size = 32, className, animated = false, withText = false }: NetralLogoProps) {
  const orb = (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full blur-md"
          style={{
            background:
              'radial-gradient(circle, var(--gradient-1), var(--gradient-2))',
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <div
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          background:
            'conic-gradient(from 180deg at 50% 50%, var(--gradient-1), var(--gradient-2), var(--gradient-3), var(--gradient-1))',
        }}
      >
        <div
          className="absolute rounded-full bg-[var(--background)]"
          style={{ inset: size * 0.15 }}
        />
        <div
          className="absolute rounded-full"
          style={{
            inset: size * 0.3,
            background:
              'radial-gradient(circle, var(--gradient-2), var(--gradient-1))',
          }}
        />
      </div>
    </div>
  )

  if (!withText) return <div className={className}>{orb}</div>

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {orb}
      <span className="font-semibold tracking-tight" style={{ fontSize: size * 0.65 }}>
        Netral
      </span>
    </div>
  )
}
