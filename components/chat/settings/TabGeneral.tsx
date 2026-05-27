'use client'

import { Field } from './Field'
import { locales, localeNames, type Locale } from '@/lib/i18n/translations'

interface Props {
  locale: string
  setLocale: (l: Locale) => void
  responseTone: string
  setResponseTone: (t: string) => void
  saving: boolean
  savedMsg: string
  onSave: () => void
}

export function TabGeneral({ locale, setLocale, responseTone, setResponseTone, saving, savedMsg, onSave }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[18px] font-semibold mb-1">Général</h2>
        <p className="text-[13px] text-[var(--fg-muted)]">Personnalisez votre expérience.</p>
      </div>

      <Field label="Langue">
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          className="w-full h-9 px-3 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[13px] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
        >
          {locales.map((l) => (
            <option key={l} value={l}>{localeNames[l]}</option>
          ))}
        </select>
      </Field>

      <Field label="Ton de réponse">
        <select
          value={responseTone}
          onChange={(e) => setResponseTone(e.target.value)}
          className="w-full h-9 px-3 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[13px] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
        >
          <option value="balanced">Équilibré</option>
          <option value="concise">Concis</option>
          <option value="friendly">Amical</option>
          <option value="technical">Technique</option>
          <option value="creative">Créatif</option>
        </select>
      </Field>

      <button
        onClick={onSave}
        disabled={saving}
        className="h-9 px-4 rounded-md bg-[var(--accent)] text-[var(--bg)] text-[13px] font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
      >
        {saving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
      {savedMsg && <p className="text-[12px] text-green-600">{savedMsg}</p>}
    </div>
  )
}
