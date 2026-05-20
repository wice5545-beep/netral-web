'use client'

import { useActionState } from 'react'
import { updateProfile } from '@/actions/settings'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

interface GeneralTabProps {
  user: { name?: string | null; email: string }
}

type ProfileState = { error?: string; success?: boolean } | undefined

export function GeneralTab({ user }: GeneralTabProps) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfile, undefined)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">General</h2>
        <p className="text-sm text-[var(--foreground-muted)]">Manage your account settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your name and personal information.</CardDescription>
        </CardHeader>
        <form action={action} className="space-y-4">
          <Input
            id="name"
            name="name"
            label="Full name"
            defaultValue={user.name ?? ''}
            placeholder="Your full name"
            error={state?.error}
          />
          <Input
            id="email"
            name="email"
            label="Email address"
            defaultValue={user.email}
            disabled
          />
          {state?.success && (
            <p className="text-sm text-[var(--success)]">Profile updated successfully.</p>
          )}
          <Button type="submit" loading={pending} size="sm">Save changes</Button>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Irreversible account actions.</CardDescription>
        </CardHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">Delete account</p>
              <p className="text-xs text-[var(--foreground-muted)]">Permanently delete your account and all data.</p>
            </div>
            <Button variant="danger" size="sm">Delete account</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
