'use client'

import { useState } from 'react'
import { Shield, Download } from 'lucide-react'

export function TabVSCode() {
  const [apiToken, setApiToken] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-semibold mb-1">VS Code</h2>
        <p className="text-[13px] text-[var(--fg-muted)]">Connectez Netral à votre éditeur de code.</p>
      </div>

      {/* Token API */}
      <div className="rounded-xl border border-[var(--border)] p-5 bg-[var(--bg-soft)]/50">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={14} className="text-[var(--fg-muted)]" />
          <p className="text-[13px] font-semibold">Token API</p>
        </div>
        {apiToken ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[11px] font-mono break-all select-all">{apiToken}</code>
              <button onClick={() => { navigator.clipboard.writeText(apiToken) }} className="h-9 px-3.5 rounded-lg border border-[var(--border)] text-[12px] font-medium hover:bg-[var(--bg-soft)] transition-colors shrink-0">Copier</button>
            </div>
            <p className="text-[11px] text-[var(--fg-muted)]">Collez ce token dans VS Code : Ctrl+Shift+P → &quot;Netral: Initialize&quot;</p>
            <button onClick={() => setApiToken('')} className="text-[11px] text-[var(--error)] hover:underline">Révoquer ce token</button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[12px] text-[var(--fg-muted)] mb-3">Générez un token pour connecter l&apos;extension VS Code à votre compte.</p>
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/auth/token', { method: 'POST' })
                  const data = await res.json()
                  if (data.token) setApiToken(data.token)
                } catch {}
              }}
              className="h-10 px-5 rounded-lg bg-[var(--accent)] text-[var(--bg)] text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98]"
            >
              Générer un token
            </button>
          </div>
        )}
      </div>

      {/* Download */}
      <div className="rounded-xl border border-[var(--border)] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Download size={14} className="text-[var(--fg-muted)]" />
          <p className="text-[13px] font-semibold">Extension</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="vscode:extension/netral.netral" className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--accent)] text-[var(--bg)] text-[12px] font-medium hover:bg-[var(--accent-hover)] transition-all">
            <Download size={12} /> Installer dans VS Code
          </a>
          <a href="/extensions" className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-[var(--border)] text-[12px] font-medium hover:bg-[var(--bg-soft)] transition-all">
            Voir toutes les versions
          </a>
        </div>
      </div>
    </div>
  )
}
