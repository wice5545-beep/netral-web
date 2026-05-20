import { Badge } from '@/components/ui/Badge'

const activities = [
  { id: 1, user: 'Sarah Chen', action: 'Created new project', time: '2 min ago', type: 'create' },
  { id: 2, user: 'Marcus W.', action: 'Deployed to production', time: '15 min ago', type: 'deploy' },
  { id: 3, user: 'You', action: 'Updated settings', time: '1 hour ago', type: 'update' },
  { id: 4, user: 'Elena R.', action: 'Invited 3 team members', time: '3 hours ago', type: 'invite' },
  { id: 5, user: 'James P.', action: 'Completed onboarding', time: '5 hours ago', type: 'complete' },
]

const typeVariant: Record<string, 'accent' | 'success' | 'warning' | 'default'> = {
  create: 'accent',
  deploy: 'success',
  update: 'default',
  invite: 'warning',
  complete: 'success',
}

export function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
      <h3 className="text-base font-semibold text-[var(--foreground)] mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((a) => (
          <div key={a.id} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[var(--background-secondary)] flex items-center justify-center text-xs font-bold text-[var(--foreground)] shrink-0">
              {a.user[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--foreground)]">
                <span className="font-medium">{a.user}</span>{' '}
                <span className="text-[var(--foreground-muted)]">{a.action}</span>
              </p>
              <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{a.time}</p>
            </div>
            <Badge variant={typeVariant[a.type] ?? 'default'} className="capitalize shrink-0">
              {a.type}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
