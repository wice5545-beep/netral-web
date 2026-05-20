import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Download, Trash2, FileText } from 'lucide-react'

export function DataTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Data management</h2>
        <p className="text-sm text-[var(--foreground-muted)]">Manage your data and exports.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export your data</CardTitle>
          <CardDescription>Download a copy of all your data.</CardDescription>
        </CardHeader>
        <div className="space-y-3">
          {[
            { label: 'Account data', desc: 'Profile, settings, preferences', icon: FileText },
            { label: 'Projects', desc: 'All projects and configurations', icon: FileText },
            { label: 'Analytics', desc: 'Historical analytics and reports', icon: FileText },
          ].map(({ label, desc, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-[var(--foreground-muted)]" />
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{desc}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download size={14} />
                Export
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete data</CardTitle>
          <CardDescription>Permanently remove specific data from your account.</CardDescription>
        </CardHeader>
        <div className="space-y-3">
          {[
            { label: 'Clear analytics history', desc: 'Remove all historical analytics data' },
            { label: 'Reset preferences', desc: 'Reset all customizations to defaults' },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
                <p className="text-xs text-[var(--foreground-muted)]">{desc}</p>
              </div>
              <Button variant="danger" size="sm" className="gap-1.5">
                <Trash2 size={14} />
                Delete
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
