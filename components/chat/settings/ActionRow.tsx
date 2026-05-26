'use client'

import { cn } from '@/lib/utils'

export function ActionRow({ label, desc, onClick, danger, icon }: { label: string; desc: string; onClick: () => void; danger?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div>
        <p className="text-[13px] font-medium">{label}</p>
        <p className="text-[11px] text-[var(--fg-muted)]">{desc}</p>
      </div>
      <button
        onClick={onClick}
        className={cn(
          'h-7 px-2.5 rounded-md text-[12px] font-medium flex items-center gap-1.5 transition-colors',
          danger
            ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
            : 'text-[var(--fg)] hover:bg-[var(--bg-soft)]'
        )}
      >
        {icon}
        {danger ? 'Effacer' : 'Exporter'}
      </button>
    </div>
  )
}
