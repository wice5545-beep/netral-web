'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface Props {
  integrations: { service: string; updatedAt: string }[]
  onClose: () => void
}

export function TabIntegrations({ integrations, onClose }: Props) {
  return (
    <div className="space-y-5">
      {/* Header with animated API icon */}
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 shrink-0">
          {[0, 1].map(i => (
            <motion.div key={i} className="absolute inset-0 rounded-full border border-violet-500/30"
              animate={{ scale: [1, 1.7 + i * 0.3], opacity: [0.5, 0] }}
              transition={{ duration: 2, delay: i * 0.6, repeat: Infinity, ease: 'easeOut' }} />
          ))}
          <motion.div className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899, #f97316)' }}
            animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            <motion.div className="absolute inset-0 rounded-full flex items-center justify-center"
              animate={{ rotate: [0, -360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </motion.div>
          </motion.div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-[18px] font-semibold">Intégrations</h2>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-violet-500/30 bg-violet-500/10 text-violet-500 font-mono tracking-widest">API</span>
          </div>
          <p className="text-[12px] text-[var(--fg-muted)]">Connectez Gmail, Calendar, Drive, Docs et Sheets.</p>
        </div>
      </div>

      {/* Service status list */}
      <div className="rounded-xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden">
        {[
          { id: 'gmail', label: 'Gmail', emoji: '✉️' },
          { id: 'calendar', label: 'Google Calendar', emoji: '📅' },
          { id: 'drive', label: 'Google Drive', emoji: '📁' },
          { id: 'docs', label: 'Google Docs', emoji: '📄' },
          { id: 'sheets', label: 'Google Sheets', emoji: '📊' },
        ].map(({ id, label, emoji }) => {
          const connected = integrations.some(i => i.service === id)
          return (
            <div key={id} className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-elevated)]">
              <span className="text-[16px] w-6 text-center">{emoji}</span>
              <span className="flex-1 text-[13px] font-medium">{label}</span>
              {connected ? (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Connecté
                </div>
              ) : (
                <span className="text-[11px] text-[var(--fg-subtle)]">Non connecté</span>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA to full page */}
      <Link href="/integrations" onClick={onClose} className="flex items-center justify-between p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 transition-all group cursor-pointer">
        <div>
          <div className="text-[13px] font-semibold text-violet-600 dark:text-violet-400">Gérer les intégrations</div>
          <div className="text-[11.5px] text-[var(--fg-muted)] mt-0.5">Connecter, déconnecter, voir les permissions</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-violet-500 group-hover:translate-x-0.5 transition-transform">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </Link>
    </div>
  )
}
