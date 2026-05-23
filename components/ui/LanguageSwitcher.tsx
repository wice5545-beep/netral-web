'use client'

import { useI18n } from '@/lib/i18n'
import { locales, localeNames, type Locale } from '@/lib/i18n/translations'
import { Globe } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
        aria-label="Change language"
      >
        <Globe size={14} />
        <span className="uppercase">{locale}</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg shadow-[var(--shadow-md)] min-w-[140px] z-50 animate-scale-in">
          {locales.map((l: Locale) => (
            <button
              key={l}
              onClick={() => { setLocale(l); setOpen(false) }}
              className={`w-full px-3 py-1.5 text-left text-[13px] hover:bg-[var(--bg-soft)] transition-colors ${l === locale ? 'text-[var(--fg)] font-medium' : 'text-[var(--fg-muted)]'}`}
            >
              {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
