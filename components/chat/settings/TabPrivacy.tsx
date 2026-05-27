'use client'

import { Shield, Download } from 'lucide-react'
import { ActionRow } from './ActionRow'

interface Props {
  onClearHistory: () => void
  onClearMemory: () => void
}

export function TabPrivacy({ onClearHistory, onClearMemory }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[18px] font-semibold mb-1">Confidentialité</h2>
        <p className="text-[13px] text-[var(--fg-muted)]">Vos données vous appartiennent.</p>
      </div>
      <div className="bg-[var(--bg-soft)] rounded-lg p-4 border border-[var(--border)]">
        <div className="flex items-start gap-3">
          <Shield size={14} className="text-green-600 mt-0.5 shrink-0" strokeWidth={1.8} />
          <div>
            <p className="text-[13px] font-medium mb-1">Chiffrement & sécurité</p>
            <p className="text-[12px] text-[var(--fg-muted)] leading-relaxed">
              TLS en transit. Sessions HttpOnly. Mots de passe bcrypt. Vos messages ne servent jamais à entraîner des modèles.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <ActionRow label="Effacer toutes les conversations" desc="Suppression définitive" onClick={onClearHistory} danger />
        <ActionRow label="Effacer la mémoire" desc="Préférences enregistrées" onClick={onClearMemory} danger />
        <ActionRow label="Exporter mes données" desc="Téléchargement complet" onClick={() => {}} icon={<Download size={12} />} />
      </div>
    </div>
  )
}
