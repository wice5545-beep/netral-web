'use client'

import { useState } from 'react'
import { updateSettings } from '@/actions/settings'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Users, Plus } from 'lucide-react'

interface ParentalTabProps {
  settings: { parentalEnabled: boolean } | null
}

export function ParentalTab({ settings }: ParentalTabProps) {
  const [enabled, setEnabled] = useState(settings?.parentalEnabled ?? false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    setSaving(true)
    await updateSettings({ parentalEnabled: enabled })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Parental control</h2>
        <p className="text-sm text-[var(--foreground-muted)]">Manage sub-accounts and access restrictions for family members.</p>
      </div>

      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>Enable parental controls</CardTitle>
          <CardDescription>Set up and manage child/teen accounts linked to yours.</CardDescription>
        </CardHeader>
        <Toggle
          checked={enabled}
          onChange={setEnabled}
          label="Parental control mode"
          description="Enable multi-account management with restrictions."
        />
        <div className="flex items-center gap-3">
          <Button onClick={save} loading={saving} size="sm">Save</Button>
          {saved && <p className="text-sm text-[var(--success)]">Saved!</p>}
        </div>
      </Card>

      {enabled && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Sub-accounts</CardTitle>
              <CardDescription>Manage linked child/teen accounts.</CardDescription>
            </CardHeader>
            <div className="space-y-3">
              {[
                { name: 'Emma (teen)', email: 'emma@family.com', age: 16 },
                { name: 'Lucas (child)', email: 'lucas@family.com', age: 11 },
              ].map((acc) => (
                <div key={acc.email} className="flex items-center justify-between p-3 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
                      {acc.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{acc.name}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">{acc.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={acc.age >= 13 ? 'warning' : 'accent'}>
                      {acc.age >= 13 ? 'Teen' : 'Child'}
                    </Badge>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="gap-2 w-full">
                <Plus size={14} />
                Add sub-account
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Restrictions</CardTitle>
              <CardDescription>Set global restrictions for all sub-accounts.</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <Toggle label="Content filtering" description="Block inappropriate content" checked={true} />
              <Toggle label="Screen time limits" description="Set daily usage limits" checked={false} />
              <Toggle label="Require approval" description="Approve new connections and apps" checked={true} />
              <Toggle label="Location sharing" description="Allow sub-accounts to share location" checked={false} />
            </div>
          </Card>
        </>
      )}

      {!enabled && (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <Users size={32} className="text-[var(--foreground-muted)] mx-auto mb-3" />
          <p className="text-sm font-medium text-[var(--foreground)]">Parental controls are disabled</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">Enable the toggle above to manage sub-accounts.</p>
        </div>
      )}
    </div>
  )
}
