'use client'

export function TabSecurity() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[18px] font-semibold mb-1">Sécurité</h2>
        <p className="text-[13px] text-[var(--fg-muted)]">Protégez votre compte.</p>
      </div>
      <div className="space-y-3">
        <div className="rounded-lg border border-[var(--border)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium">Mot de passe</p>
              <p className="text-[11px] text-[var(--fg-muted)]">Dernière modification : inconnue</p>
            </div>
            <button className="h-8 px-3 rounded-md text-[12px] font-medium border border-[var(--border)] hover:bg-[var(--bg-soft)] transition-colors">Modifier</button>
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium">Authentification 2FA</p>
              <p className="text-[11px] text-[var(--fg-muted)]">Non activée</p>
            </div>
            <button className="h-8 px-3 rounded-md text-[12px] font-medium border border-[var(--border)] hover:bg-[var(--bg-soft)] transition-colors">Activer</button>
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium">Sessions actives</p>
              <p className="text-[11px] text-[var(--fg-muted)]">1 session (cet appareil)</p>
            </div>
            <button className="h-8 px-3 rounded-md text-[12px] font-medium text-red-500 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">Tout déconnecter</button>
          </div>
        </div>
      </div>
    </div>
  )
}
