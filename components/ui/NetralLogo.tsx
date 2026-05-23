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
      {/* Outer glow ring */}
      {animated && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 1.3,
            height: size * 1.3,
            background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          }}
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Main logo container */}
      <div
        className="relative rounded-xl flex items-center justify-center overflow-hidden"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #b08d57 0%, #967744 50%, #7a6138 100%)',
          boxShadow: `0 ${size * 0.06}px ${size * 0.2}px rgba(176, 141, 87, 0.25)`,
        }}
      >
        {/* Shine effect */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)',
          }}
        />
        
        {/* Inner glow */}
        {animated && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 50%)',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Letter N */}
        <span
          style={{
            fontSize: size * 0.5,
            fontWeight: 600,
            color: 'white',
            fontFamily: 'var(--font-display), Georgia, serif',
            letterSpacing: '-0.03em',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            lineHeight: 1,
          }}
        >
          N
        </span>
      </div>

      {/* Orbiting particles */}
      {animated && (
        <>
          <motion.div
            className="absolute rounded-full"
            style={{
              width: size * 0.08,
              height: size * 0.08,
              background: 'var(--accent)',
              boxShadow: '0 0 6px var(--accent-glow)',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
            initial={{
              offsetDistance: '50%',
            }}
          >
            <motion.div
              style={{
                width: size,
                height: size,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            />
          </motion.div>
        </>
      )}
    </div>
  )

  if (!withText) return <div className={className}>{orb}</div>

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {orb}
      <span 
        className="font-display font-normal tracking-tight"
        style={{ fontSize: size * 0.55 }}
      >
        Netral
      </span>
    </div>
  )
}
