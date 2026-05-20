'use client'

import { useState } from 'react'
import { updateSettings } from '@/actions/settings'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { Badge } from '@/components/ui/Badge'
import { Shield, Key, Smartphone, Eye } from 'lucide-react'

interface SecurityTabProps {
  settings: { twoFactor: boolean } | null
}

export function SecurityTab({ settings }: SecurityTabProps) {
  const [twoFactor, setTwoFactor] = useState(settings?.twoFactor ?? false)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await updateSettings({ twoFactor })
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Security</h2>
        <p className="text-sm text-[var(--foreground-muted)]">Protect your account with additional security measures.</p>
      </div>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <Toggle
          checked={twoFactor}
          onChange={setTwoFactor}
          label="Enable 2FA"
          description="Use an authenticator app to verify your identity."
        />
        {twoFactor && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--accent-light)] border border-[var(--accent)]/20">
            <Smartphone size={16} className="text-[var(--accent)]" />
            <p className="text-sm text-[var(--accent)]">2FA is enabled. Your account is more secure.</p>
          </div>
        )}
        <Button onClick={save} loading={saving} size="sm">Save</Button>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your password regularly for better security.</CardDescription>
        </CardHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key size={16} className="text-[var(--foreground-muted)]" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">Current password</p>
                <p className="text-xs text-[var(--foreground-muted)]">Last changed 30 days ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Change password</Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>Manage devices that are signed in to your account.</CardDescription>
        </CardHeader>
        <div className="space-y-3">
          {[
            { device: 'Chrome on Windows', location: 'Paris, France', time: 'Active now', current: true },
            { device: 'Safari on iPhone', location: 'Lyon, France', time: '2 hours ago', current: false },
          ].map((session) => (
            <div key={session.device} className="flex items-center justify-between p-3 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <Eye size={16} className="text-[var(--foreground-muted)]" />
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
                    {session.device}
                    {session.current && <Badge variant="success">Current</Badge>}
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)]">{session.location} · {session.time}</p>
                </div>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-[var(--danger)]">Revoke</Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
