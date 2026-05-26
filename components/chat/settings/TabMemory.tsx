'use client'

import { Trash2 } from 'lucide-react'
import { Field } from './Field'

interface MemoryData {
  fullName: string
  profession: string
  interests: string
  customInstructions: string
}

interface Props {
  memory: MemoryData
  setMemory: (m: MemoryData) => void
  saving: boolean
  savedMsg: string
  onSave: () => void
  onClear: () => void
}

export function TabMemory({ memory, setMemory, saving, savedMsg, onSave, onClear }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[18px] font-semibold mb-1">Mémoire</h2>
        <p className="text-[13px] text-[var(--fg-muted)]">Ce que Netral retient à propos de vous.</p>
      </div>

      <Field label="Prénom">
        <input
          value={memory.fullName}
          onChange={(e) => setMemory({ ...memory, fullName: e.target.value })}
          maxLength={100}
          className="w-full h-9 px-3 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[13px] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          placeholder="ex. Alex"
        />
      </Field>
      <Field label="Métier">
        <input
          value={memory.profession}
          onChange={(e) => setMemory({ ...memory, profession: e.target.value })}
          maxLength={200}
          className="w-full h-9 px-3 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[13px] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          placeholder="ex. Designer, étudiant…"
        />
      </Field>
      <Field label="Centres d'intérêt">
        <input
          value={memory.interests}
          onChange={(e) => setMemory({ ...memory, interests: e.target.value })}
          maxLength={300}
          className="w-full h-9 px-3 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[13px] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          placeholder="ex. design, philosophie…"
        />
      </Field>
      <Field label="Instructions personnalisées">
        <textarea
          value={memory.customInstructions}
          onChange={(e) => setMemory({ ...memory, customInstructions: e.target.value })}
          rows={4}
          maxLength={2000}
          className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[13px] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] resize-none"
          placeholder="Comment Netral devrait-il vous répondre ?"
        />
      </Field>

      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="h-9 px-4 rounded-md bg-[var(--accent)] text-[var(--bg)] text-[13px] font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
        >
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        <button
          onClick={onClear}
          className="h-9 px-3 rounded-md text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
        >
          <Trash2 size={12} />
          Effacer
        </button>
        {savedMsg && <p className="text-[12px] text-green-600 ml-auto">{savedMsg}</p>}
      </div>
    </div>
  )
}
