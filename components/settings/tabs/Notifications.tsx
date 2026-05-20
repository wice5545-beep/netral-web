'use client'

import { useState } from 'react'
import { updateSettings } from '@/actions/settings'
import { Toggle } from '@/components/ui/Toggle'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface NotificationsTabProps {
  settings: { notifications: boolean; emailDigest: boolean } | null
}

export function NotificationsTab({ settings }: NotificationsTabProps) {
  const [notif, setNotif] = useState(settings?.notifications ?? true)
  const [digest, setDigest] = useState(settings?.emailDigest ?? false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    setSaving(true)
    await updateSettings({ notifications: notif, emailDigest: digest })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Notifications</h2>
        <p className="text-sm text-[var(--foreground-muted)]">Manage how you receive updates.</p>
      </div>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Push notifications</CardTitle>
          <CardDescription>Control in-app notification preferences.</CardDescription>
        </CardHeader>
        <Toggle
          checked={notif}
          onChange={setNotif}
          label="Enable notifications"
          description="Receive notifications for activity in your workspace."
        />
        <Toggle
          label="Project updates"
          description="Get notified when projects are updated or deployed."
          checked={true}
        />
        <Toggle
          label="Team mentions"
          description="Get notified when someone mentions you."
          checked={true}
        />
        <Toggle
          label="Security alerts"
          description="Receive alerts for suspicious activity."
          checked={true}
          disabled
        />
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Email notifications</CardTitle>
          <CardDescription>Control email digest preferences.</CardDescription>
        </CardHeader>
        <Toggle
          checked={digest}
          onChange={setDigest}
          label="Weekly email digest"
          description="Receive a weekly summary of your workspace activity."
        />
        <Toggle
          label="Product updates"
          description="Receive emails about new features and improvements."
          checked={false}
        />
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={save} loading={saving} size="sm">Save preferences</Button>
        {saved && <p className="text-sm text-[var(--success)]">Saved!</p>}
      </div>
    </div>
  )
}
