import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { HardDrive, Image, FileText, Video } from 'lucide-react'

interface StorageTabProps {
  settings: { storageLimit: number } | null
}

export function StorageTab({ settings }: StorageTabProps) {
  const limit = settings?.storageLimit ?? 5
  const used = 2.4
  const percentage = Math.round((used / limit) * 100)

  const breakdown = [
    { label: 'Images', icon: Image, size: '1.2 GB', color: 'bg-blue-500', pct: 50 },
    { label: 'Documents', icon: FileText, size: '0.8 GB', color: 'bg-green-500', pct: 33 },
    { label: 'Videos', icon: Video, size: '0.4 GB', color: 'bg-purple-500', pct: 17 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Storage</h2>
        <p className="text-sm text-[var(--foreground-muted)]">Manage your storage usage.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Storage overview</CardTitle>
          <CardDescription>{used} GB of {limit} GB used</CardDescription>
        </CardHeader>
        <div className="space-y-4">
          <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--accent)] to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center gap-2">
            <HardDrive size={16} className="text-[var(--foreground-muted)]" />
            <span className="text-sm text-[var(--foreground-muted)]">{percentage}% used — {limit - used} GB available</span>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Breakdown by type</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {breakdown.map(({ label, icon: Icon, size, color, pct }) => (
            <div key={label} className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                <Icon size={16} className={color.replace('bg-', 'text-')} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-[var(--foreground)]">{label}</span>
                  <span className="text-[var(--foreground-muted)]">{size}</span>
                </div>
                <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upgrade storage</CardTitle>
          <CardDescription>Get more space for your projects.</CardDescription>
        </CardHeader>
        <div className="grid grid-cols-3 gap-3">
          {[{ size: '50 GB', price: '$4/mo' }, { size: '200 GB', price: '$9/mo' }, { size: '1 TB', price: '$19/mo' }].map(({ size, price }) => (
            <button key={size} className="p-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] text-center transition-all">
              <p className="font-semibold text-[var(--foreground)] text-sm">{size}</p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">{price}</p>
            </button>
          ))}
        </div>
        <Button className="mt-4" size="sm">Upgrade plan</Button>
      </Card>
    </div>
  )
}
