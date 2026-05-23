'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface NetralLogoProps {
  size?: number
  className?: string
  withText?: boolean
}

export function NetralLogo({ size = 28, className, withText = false }: NetralLogoProps) {
  const mark = (
    <Image
      src="/logo.png"
      alt="Netral"
      width={size}
      height={size}
      className="rounded-md shrink-0"
    />
  )

  if (!withText) return <span className={className}>{mark}</span>

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {mark}
      <span className="font-semibold tracking-tight text-[var(--fg)]" style={{ fontSize: size * 0.62 }}>
        Netral
      </span>
    </div>
  )
}
