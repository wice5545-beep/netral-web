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
  const r = size / 2
  const cx = r
  const cy = r

  const orb = (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer glow ring */}
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,127,255,0.6) 0%, transparent 70%)',
            filter: `blur(${size * 0.4}px)`,
          }}
          animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <defs>
          <radialGradient id={`logoGrad-${size}`} cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="45%" stopColor="#8b7fff" />
            <stop offset="100%" stopColor="#5b21b6" />
          </radialGradient>
          <radialGradient id={`glare-${size}`} cx="35%" cy="25%" r="55%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id={`shadow-${size}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy={size * 0.06} stdDeviation={size * 0.12} floodColor="#7c6fff" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Base circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r - 0.5}
          fill={`url(#logoGrad-${size})`}
          filter={`url(#shadow-${size})`}
        />

        {/* Glare */}
        <ellipse
          cx={cx - size * 0.06}
          cy={cy - size * 0.12}
          rx={size * 0.22}
          ry={size * 0.14}
          fill={`url(#glare-${size})`}
        />

        {/* N letter */}
        <text
          x={cx}
          y={cy + size * 0.17}
          textAnchor="middle"
          fontSize={size * 0.46}
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          fill="white"
          style={{ letterSpacing: '-0.03em' }}
        >
          N
        </text>

        {/* Orbital ring (animated) */}
        {animated && (
          <motion.circle
            cx={cx}
            cy={cy}
            r={r - 1}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.5"
            fill="none"
            strokeDasharray={`${size * 0.3} ${size * 0.5}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        )}
      </svg>

      {/* Orbiting dot */}
      {animated && (
        <motion.div
          className="absolute rounded-full bg-white/80"
          style={{ width: size * 0.1, height: size * 0.1 }}
          animate={{
            x: [r * 0.7, 0, -r * 0.7, 0, r * 0.7],
            y: [0, -r * 0.7, 0, r * 0.7, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </div>
  )

  if (!withText) return <div className={className}>{orb}</div>

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {orb}
      <span className="font-bold tracking-tight" style={{ fontSize: size * 0.65 }}>
        NTRL
      </span>
    </div>
  )
}
