'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  theme: string
  setTheme: (t: 'light' | 'dark' | 'system') => void
}

export function TabAppearance({ theme, setTheme }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[18px] font-semibold mb-1">Apparence</h2>
        <p className="text-[13px] text-[var(--fg-muted)]">Choisissez votre thème.</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'light', label: 'Clair', icon: Sun },
          { id: 'dark', label: 'Sombre', icon: Moon },
          { id: 'system', label: 'Système', icon: Monitor },
        ].map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as 'light' | 'dark' | 'system')}
              className={cn(
                'p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5',
                theme === t.id
                  ? 'border-transparent shadow-colored glass-card'
                  : 'border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-sm'
              )}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-[12.5px] font-medium">{t.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
