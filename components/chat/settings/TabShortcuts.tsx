'use client'

export function TabShortcuts() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[18px] font-semibold mb-1">Raccourcis clavier</h2>
        <p className="text-[13px] text-[var(--fg-muted)]">Naviguez plus vite.</p>
      </div>
      <div className="space-y-1">
        {[
          { action: 'Nouvelle conversation', keys: '⌘ N' },
          { action: 'Basculer la sidebar', keys: '⌘ B' },
          { action: 'Paramètres', keys: '⌘ ,' },
          { action: 'Envoyer le message', keys: '↵' },
          { action: 'Nouvelle ligne', keys: '⇧ ↵' },
          { action: 'Fermer modal', keys: 'Esc' },
        ].map((s) => (
          <div key={s.action} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
            <span className="text-[13px]">{s.action}</span>
            <span className="kbd">{s.keys}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
