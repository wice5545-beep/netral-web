'use client'

interface Props {
  user: { id: string; name?: string | null; email: string }
}

export function TabAccount({ user }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[18px] font-semibold mb-1">Compte</h2>
        <p className="text-[13px] text-[var(--fg-muted)]">Gérez votre profil.</p>
      </div>
      <div className="rounded-lg border border-[var(--border)] p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-[var(--bg)] flex items-center justify-center text-[14px] font-semibold">
            {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
          </div>
          <div>
            <p className="text-[14px] font-medium">{user.name ?? 'Utilisateur'}</p>
            <p className="text-[12px] text-[var(--fg-muted)]">{user.email}</p>
          </div>
        </div>
        <div className="space-y-2 pt-2 border-t border-[var(--border)]">
          <p className="text-[12px] text-[var(--fg-muted)]">ID: {user.id.slice(0, 8)}…</p>
        </div>
      </div>
      <button className="h-9 px-4 rounded-md text-[13px] text-red-500 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
        Supprimer mon compte
      </button>
    </div>
  )
}
