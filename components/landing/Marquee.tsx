'use client'

import type { ReactNode } from 'react'

/**
 * Infinite horizontal marquee — duplicates children so the scroll loops seamlessly.
 */
export function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  className,
}: {
  children: ReactNode
  speed?: number
  pauseOnHover?: boolean
  className?: string
}) {
  return (
    <div className={`marquee-mask overflow-hidden ${className ?? ''}`}>
      <div
        className="marquee-track gap-12"
        style={{ animationDuration: `${speed}s` }}
        onMouseEnter={(e) => pauseOnHover && (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={(e) => pauseOnHover && (e.currentTarget.style.animationPlayState = 'running')}
      >
        <div className="flex items-center gap-12 shrink-0">{children}</div>
        <div className="flex items-center gap-12 shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
