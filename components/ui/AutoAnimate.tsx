'use client'

import { useEffect, useRef, type ComponentType, type Ref } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AutoAnimate({ icon: Icon, size, className, interval = 4000 }: { icon: ComponentType<any>; size?: number; className?: string; interval?: number }) {
  const ref = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null)

  useEffect(() => {
    const timer = setTimeout(() => ref.current?.startAnimation(), 300)
    if (!interval) return () => clearTimeout(timer)
    const loop = setInterval(() => ref.current?.startAnimation(), interval)
    return () => { clearTimeout(timer); clearInterval(loop) }
  }, [interval])

  return <Icon ref={ref as Ref<any>} size={size} className={className} />
}
