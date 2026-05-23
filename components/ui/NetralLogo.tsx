'use client'

import { cn } from '@/lib/utils'

interface NetralLogoProps {
  size?: number
  className?: string
  withText?: boolean
}

/**
 * Minimal mark — solid black square with white "n".
 * Inverts in dark mode. No gradients, no effects.
 */
export function NetralLogo({ size = 28, className, withText = false }: NetralLogoProps) {
  const mark = (
    <div
      className="inline-flex items-center justify-center rounded-md bg-[var(--fg)] text-[var(--bg)] shrink-0"
      style={{ width: size, height: size }}
    >
      <span
        className="font-semibold leading-none"
        style={{ fontSize: size * 0.55 }}
      >
        n
      </span>
    </div>
  )

  if (!withText) return <span className={className}>{mark}</span>

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {mark}
      <span
        className="font-semibold tracking-tight text-[var(--fg)]"
        style={{ fontSize: size * 0.62 }}
      >
        Netral
      </span>
    </div>
  )
}
