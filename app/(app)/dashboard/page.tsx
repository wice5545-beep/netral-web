import { getUser } from '@/lib/dal'
import { StatsCard } from '@/components/dashboard/widgets/StatsCard'
import { ActivityFeed } from '@/components/dashboard/widgets/ActivityFeed'
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react'

const stats = [
  { title: 'Total Users', value: '12,842', change: 12, icon: <Users size={18} className="text-[var(--accent)]" /> },
  { title: 'Revenue', value: '$48.2k', change: 8, icon: <DollarSign size={18} className="text-green-500" /> },
  { title: 'Active Now', value: '1,293', change: 23, icon: <Activity size={18} className="text-blue-500" /> },
  { title: 'Growth Rate', value: '18.4%', change: -2, icon: <TrendingUp size={18} className="text-purple-500" /> },
]

export default async function DashboardPage() {
  const user = await getUser()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          Good morning{user?.name ? `, ${user.name}` : ''} 👋
        </h2>
        <p className="text-sm text-[var(--foreground-muted)] mt-1">
          Here&apos;s what&apos;s happening in your workspace today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">Revenue over time</h3>
            <select className="text-xs bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg px-2 py-1 text-[var(--foreground)]">
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>This year</option>
            </select>
          </div>
          <div className="flex items-end gap-1 h-32">
            {[35, 50, 42, 65, 58, 75, 62, 80, 72, 88, 78, 95, 85, 92, 78, 88, 95, 82, 76, 90, 85, 72, 88, 94, 80, 88, 96, 84, 90, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-[var(--accent)] to-[var(--accent)]/40 hover:from-[var(--accent-hover)] transition-all duration-150 cursor-pointer"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-[var(--foreground-muted)] mt-2">
            <span>Apr 20</span>
            <span>May 1</span>
            <span>May 20</span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-4">Top channels</h3>
          <div className="space-y-4">
            {[
              { label: 'Organic', value: 42, color: 'bg-[var(--accent)]' },
              { label: 'Referral', value: 28, color: 'bg-green-500' },
              { label: 'Paid', value: 18, color: 'bg-yellow-500' },
              { label: 'Direct', value: 12, color: 'bg-purple-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-[var(--foreground)]">{item.label}</span>
                  <span className="text-[var(--foreground-muted)] font-medium">{item.value}%</span>
                </div>
                <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityFeed />

        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-4">Team members</h3>
          <div className="space-y-3">
            {[
              { name: 'Sarah Chen', role: 'CTO', status: 'online' },
              { name: 'Marcus Williams', role: 'Lead Dev', status: 'online' },
              { name: 'Elena Rossi', role: 'Designer', status: 'away' },
              { name: 'James Park', role: 'Analyst', status: 'offline' },
            ].map((member) => (
              <div key={member.name} className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[var(--background-secondary)] flex items-center justify-center text-xs font-bold text-[var(--foreground)]">
                    {member.name[0]}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[var(--card)] ${
                    member.status === 'online' ? 'bg-green-400' :
                    member.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{member.name}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
