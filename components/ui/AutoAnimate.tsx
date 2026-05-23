'use client'

import { useEffect, useRef, type ComponentType } from 'react'

interface AutoAnimateProps {
  icon: ComponentType<{ ref?: React.Ref<{ startAnimation: () => void }>; size?: number; className?: string }>
  size?: number
  className?: string
  interval?: number // ms between re-animations, 0 = only once
}

export function AutoAnimate({ icon: Icon, size, className, interval = 4000 }: AutoAnimateProps) {
  const ref = useRef<{ startAnimation: () => void }>(null)

  useEffect(() => {
    // Animate on mount
    const timer = setTimeout(() => ref.current?.startAnimation(), 300)

    if (!interval) return () => clearTimeout(timer)

    // Re-animate periodically
    const loop = setInterval(() => ref.current?.startAnimation(), interval)
    return () => { clearTimeout(timer); clearInterval(loop) }
  }, [interval])

  return <Icon ref={ref} size={size} className={className} />
}
