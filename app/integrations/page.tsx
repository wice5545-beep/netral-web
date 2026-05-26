'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, ExternalLink, Loader2, Unlink } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'

// ─── Animated API Icon ───────────────────────────────────────────────────────

function ApiIcon() {
  return (
    <div className="relative w-20 h-20 mx-auto mb-8">
      {/* Outer pulse rings */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-violet-500/30"
          animate={{ scale: [1, 1.6 + i * 0.3], opacity: [0.6, 0] }}
          transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      {/* Core */}
      <motion.div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899, #f97316)' }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {/* Inner static icon */}
        <motion.div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </motion.div>
      </motion.div>
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-violet-400"
          style={{ top: '50%', left: '50%' }}
          animate={{
            x: [0, Math.cos(i * 60 * Math.PI / 180) * 44],
            y: [0, Math.sin(i * 60 * Math.PI / 180) * 44],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ─── Service definitions ─────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'gmail',
    label: 'Gmail',
    description: 'Lire, résumer, trier et répondre à vos emails directement depuis le chat.',
    color: '#EA4335',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="#EA4335" opacity=".2"/>
        <path d="M20 4l-8 7-8-7" stroke="#EA4335" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    capabilities: ['Lire la boîte de réception', 'Résumer les emails', 'Répondre automatiquement', 'Trier et archiver', 'Rechercher des emails'],
  },
  {
    id: 'calendar',
    label: 'Google Calendar',
    description: 'Voir vos événements, créer des rendez-vous et gérer votre agenda.',
    color: '#4285F4',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" fill="#4285F4" opacity=".2" stroke="#4285F4" strokeWidth="1.5"/>
        <path d="M16 2v4M8 2v4M3 10h18" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="7" y="14" width="3" height="3" rx=".5" fill="#4285F4"/>
      </svg>
    ),
    capabilities: ['Voir les prochains événements', 'Créer des rendez-vous', 'Résumer la semaine', 'Détecter les conflits', 'Inviter des participants'],
  },
  {
    id: 'drive',
    label: 'Google Drive',
    description: 'Accéder à vos fichiers récents et lire leur contenu.',
    color: '#34A853',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 19h20L12 2z" fill="#34A853" opacity=".2" stroke="#34A853" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 19l5-9 5 9" stroke="#34A853" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    capabilities: ['Lister les fichiers récents', 'Lire le contenu des docs', 'Rechercher des fichiers', 'Résumer des documents'],
  },
  {
    id: 'docs',
    label: 'Google Docs',
    description: 'Lire et analyser le contenu de vos documents.',
    color: '#4285F4',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="2" width="16" height="20" rx="2" fill="#4285F4" opacity=".15" stroke="#4285F4" strokeWidth="1.5"/>
        <path d="M8 8h8M8 12h8M8 16h5" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    capabilities: ['Lire les documents', 'Résumer le contenu', 'Extraire des informations', 'Analyser le texte'],
  },
  {
    id: 'sheets',
    label: 'Google Sheets',
    description: 'Lire et analyser vos feuilles de calcul.',
    color: '#34A853',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="2" width="16" height="20" rx="2" fill="#34A853" opacity=".15" stroke="#34A853" strokeWidth="1.5"/>
        <path d="M4 8h16M4 14h16M10 2v20" stroke="#34A853" strokeWidth="1.5"/>
      </svg>
    ),
    capabilities: ['Lire les données', 'Analyser les tableaux', 'Résumer les chiffres', 'Extraire des statistiques'],
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<{ service: string; updatedAt: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/integrations')
      .then(r => r.json())
      .then(d => { if (d.integrations) setIntegrations(d.integrations) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const isConnected = (service: string) => integrations.some(i => i.service === service)

  const disconnect = async (service: string) => {
    setDisconnecting(service)
    await fetch('/api/integrations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service }),
    })
    setIntegrations(prev => prev.filter(i => i.service !== service))
    setDisconnecting(null)
  }

  const connectedCount = SERVICES.filter(s => isConnected(s.id)).length

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 nav-pill px-2 py-1.5">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2 px-3 py-1.5">
            <NetralLogo size={20} />
            <span className="font-semibold text-[14px] tracking-[-0.3px]">Netral</span>
          </Link>
          <Link href="/chat" className="px-3 py-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] rounded-full hover:bg-[var(--accent-soft)] transition-all">Chat</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        {/* Back */}
        <Link href="/chat" className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors mb-10">
          <ArrowLeft size={14} />
          Retour au chat
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <ApiIcon />
          <h1 className="text-[32px] font-bold tracking-[-0.035em] mb-3">
            Intégrations <span className="gradient-text">API</span>
          </h1>
          <p className="text-[15px] text-[var(--fg-muted)] max-w-md mx-auto leading-relaxed">
            Connectez vos services Google pour que Netral puisse lire vos emails, votre calendrier et vos fichiers.
          </p>

          {/* Status summary */}
          {!loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full glass-card text-[12px]">
              <span className={`w-2 h-2 rounded-full ${connectedCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-[var(--fg-subtle)]'}`} />
              {connectedCount > 0 ? `${connectedCount} service${connectedCount > 1 ? 's' : ''} connecté${connectedCount > 1 ? 's' : ''}` : 'Aucun service connecté'}
            </motion.div>
          )}
        </motion.div>

        {/* Connect all button */}
        {!loading && connectedCount === 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <a href="/api/integrations/connect/google?services=gmail,calendar,drive,docs,sheets" className="flex items-center justify-center gap-3 w-full h-12 rounded-xl border border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 text-[14px] font-semibold text-violet-600 dark:text-violet-400 transition-all hover:border-violet-500/50 group">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
              </svg>
              Connecter tous les services Google
              <ExternalLink size={13} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          </motion.div>
        )}

        {/* Service cards */}
        <div className="space-y-3">
          {SERVICES.map((service, i) => {
            const connected = isConnected(service.id)
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-2xl border p-5 transition-all duration-300 ${
                  connected
                    ? 'border-emerald-500/25 bg-emerald-500/3 hover:border-emerald-500/40'
                    : 'border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-all ${connected ? 'border-emerald-500/20 bg-emerald-500/8' : 'border-[var(--border)] bg-[var(--bg-soft)]'}`}>
                    {service.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[14px] font-semibold">{service.label}</span>
                      {connected && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Connecté
                        </span>
                      )}
                    </div>
                    <p className="text-[12.5px] text-[var(--fg-muted)] mb-3 leading-relaxed">{service.description}</p>

                    {/* Capabilities */}
                    <div className="flex flex-wrap gap-1.5">
                      {service.capabilities.map(cap => (
                        <span key={cap} className="flex items-center gap-1 text-[11px] text-[var(--fg-subtle)] px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--bg-soft)]/50">
                          <Check size={8} strokeWidth={3} />
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    {loading ? (
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Loader2 size={14} className="animate-spin text-[var(--fg-muted)]" />
                      </div>
                    ) : connected ? (
                      <button
                        onClick={() => disconnect(service.id)}
                        disabled={disconnecting === service.id}
                        className="flex items-center gap-1.5 text-[11.5px] font-medium px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--fg-muted)] hover:text-red-500 hover:border-red-500/30 transition-all disabled:opacity-50"
                      >
                        {disconnecting === service.id ? <Loader2 size={11} className="animate-spin" /> : <Unlink size={11} />}
                        Déconnecter
                      </button>
                    ) : (
                      <a
                        href={`/api/integrations/connect/google?services=${service.id}`}
                        className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-lg bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all"
                      >
                        Connecter
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Security note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/30 flex gap-3 text-[12px] text-[var(--fg-muted)]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>Vos tokens OAuth sont chiffrés et stockés de façon sécurisée. Netral accède à vos données uniquement lors de vos conversations. Vous pouvez révoquer l'accès à tout moment depuis cette page ou depuis votre compte Google.</span>
        </motion.div>
      </div>
    </div>
  )
}
