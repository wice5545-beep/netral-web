import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  color?: string
}

export function StatsCard({ title, value, change, icon, color = 'bg-[var(--accent)]' }: StatsCardProps) {
  const isPositive = change >= 0

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--foreground-muted)] font-medium">{title}</p>
        <div className={cn('p-2 rounded-xl', color, 'bg-opacity-10')}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--foreground)] mb-2">{value}</p>
      <div className={cn('flex items-center gap-1 text-xs font-medium', isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]')}>
        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {isPositive ? '+' : ''}{change}% vs last month
      </div>
    </div>
  )
}
