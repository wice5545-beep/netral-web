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
          className="absolute inset-0 rounded-full"
          style={{ filter: `blur(${size * 0.3}px)`, background: 'radial-gradient(circle at 40% 35%, #60a5fa, #2563eb)' }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <div
        className="relative rounded-full flex items-center justify-center overflow-hidden"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 45%, #1d4ed8 100%)',
          boxShadow: `0 ${size * 0.1}px ${size * 0.5}px rgba(37,99,235,0.35)`,
        }}
      >
        {/* Subtle glare */}
        <div
          className="absolute rounded-full"
          style={{
            top: size * 0.08,
            left: size * 0.15,
            width: size * 0.45,
            height: size * 0.3,
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.45) 0%, transparent 80%)',
          }}
        />
        {/* N letter */}
        <span
          style={{
            fontSize: size * 0.46,
            fontWeight: 700,
            color: 'white',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            textShadow: '0 1px 4px rgba(0,0,0,0.25)',
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
          }}
        >
          N
        </span>
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
