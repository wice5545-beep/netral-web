import { getUser } from '@/lib/dal'
import { SettingsTabs } from '@/components/settings/SettingsTabs'

export default async function SettingsPage() {
  const user = await getUser()
  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)]">Settings</h2>
        <p className="text-sm text-[var(--foreground-muted)] mt-1">Manage your account and workspace preferences.</p>
      </div>
      <SettingsTabs
        user={{ name: user.name, email: user.email }}
        settings={user.settings}
      />
    </div>
  )
}
