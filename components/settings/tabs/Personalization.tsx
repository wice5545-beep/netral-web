'use client'

import { useState } from 'react'
import { updateSettings } from '@/actions/settings'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'

const languages = ['Français', 'English', 'Español', 'Deutsch', 'Italiano']

interface PersonalizationTabProps {
  settings: { theme: string; language: string } | null
}

export function PersonalizationTab({ settings }: PersonalizationTabProps) {
  const [lang, setLang] = useState(settings?.language ?? 'fr')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    setSaving(true)
    await updateSettings({ language: lang })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Personalization</h2>
        <p className="text-sm text-[var(--foreground-muted)]">Customize your experience.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose your preferred color theme.</CardDescription>
        </CardHeader>
        <div className="flex items-center gap-4">
          <p className="text-sm text-[var(--foreground)]">Toggle dark / light mode</p>
          <ThemeToggle />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {['System', 'Light', 'Dark'].map((t) => (
            <button
              key={t}
              className={cn(
                'p-3 rounded-xl border text-sm font-medium transition-all',
                t.toLowerCase() === (settings?.theme ?? 'system')
                  ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]'
                  : 'border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--foreground-muted)]'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>Select your preferred language.</CardDescription>
        </CardHeader>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l.toLowerCase().slice(0, 2))}
              className={cn(
                'p-3 rounded-xl border text-sm text-left transition-all',
                lang === l.toLowerCase().slice(0, 2)
                  ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]'
                  : 'border-[var(--border)] text-[var(--foreground)] hover:border-[var(--foreground-muted)]'
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={save} loading={saving} size="sm">Save preferences</Button>
        {saved && <p className="text-sm text-[var(--success)]">Saved!</p>}
      </div>
    </div>
  )
}
