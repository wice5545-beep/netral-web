'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Animated number counter — eases from 0 to `value` when scrolled into view.
 * Use `prefix`/`suffix` for currency or "%". For non-numeric (e.g. "< 200ms"),
 * pass `display` and the component will just animate-in opacity.
 */
export function AnimatedCounter({
  value,
  display,
  prefix = '',
  suffix = '',
  duration = 1600,
  className,
}: {
  value?: number
  display?: string
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !shown) {
            setShown(true)
            obs.disconnect()
          }
        })
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [shown])

  useEffect(() => {
    if (!shown || value === undefined) return
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 4)
      setN(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [shown, value, duration])

  return (
    <span ref={ref} className={className}>
      {display ? (
        <span className={shown ? 'number-pop' : 'opacity-0'}>{display}</span>
      ) : (
        <span className="tabular-nums">
          {prefix}
          {n.toLocaleString('fr-FR')}
          {suffix}
        </span>
      )}
    </span>
  )
}
