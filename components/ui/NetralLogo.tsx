'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NetralLogoProps {
  size?: number
  className?: string
  animated?: boolean
  withText?: boolean
}

/**
 * Editorial mark — a refined "N" with an emerald accent dot.
 * Unique, recognizable, no generic AI gradients.
 */
export function NetralLogo({ size = 32, className, animated = false, withText = false }: NetralLogoProps) {
  const stroke = Math.max(1.5, size * 0.05)

  const mark = (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Square frame — editorial mark style */}
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="4"
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
        />
        {/* The N — drawn as 3 strokes, geometrically precise */}
        <path
          d="M 12 30 L 12 10 L 28 30 L 28 10"
          stroke="currentColor"
          strokeWidth={stroke + 0.3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Emerald accent dot — the signature */}
        <circle cx="32" cy="8" r="2" fill="var(--jewel)" />
      </svg>

      {/* Animated pulse ring around accent */}
      {animated && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 0.18,
            height: size * 0.18,
            top: size * 0.13,
            right: size * 0.13,
            background: 'var(--jewel)',
            filter: `blur(${size * 0.08}px)`,
          }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  )

  if (!withText) return <span className={className} style={{ color: 'var(--fg)' }}>{mark}</span>

  return (
    <div className={cn('flex items-center gap-2.5', className)} style={{ color: 'var(--fg)' }}>
      {mark}
      <span
        className="font-display tracking-tight"
        style={{ fontSize: size * 0.7, lineHeight: 1 }}
      >
        Netral
      </span>
    </div>
  )
}
