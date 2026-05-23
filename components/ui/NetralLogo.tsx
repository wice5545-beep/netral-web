'use client'

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
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`ng-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill={`url(#ng-${size})`} />
        <text x="20" y="27" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="system-ui, sans-serif" fill="white">N</text>
      </svg>
    </div>
  )

  if (!withText) return <div className={className}>{orb}</div>

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {orb}
      <span className="font-bold tracking-tight" style={{ fontSize: size * 0.6 }}>Netral</span>
    </div>
  )
}
