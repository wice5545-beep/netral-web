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
      // Official Gmail logo
      <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
        <path d="M0 5.457v13.909c0 .904.732 1.636 1.636 1.636h3.819V11.73L0 7.09V5.457z" fill="#C5221F"/>
        <path d="M24 5.457v1.633l-5.455 4.64V21h3.819A1.636 1.636 0 0 0 24 19.366V5.457z" fill="#C5221F"/>
        <path d="M0 7.09l5.455 4.64V21H1.636A1.636 1.636 0 0 1 0 19.366V7.09z" fill="#EA4335"/>
        <path d="M24 7.09l-5.455 4.64V21h3.819A1.636 1.636 0 0 0 24 19.366V7.09z" fill="#EA4335"/>
        <path d="M12 9.548L5.455 4.64 3.927 3.493C2.309 2.28 0 3.434 0 5.457v1.633l12 9.09 12-9.09V5.457c0-2.023-2.309-3.178-3.927-1.964L18.545 4.64 12 9.548z" fill="#FBBC04"/>
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
      // Official Google Calendar logo
      <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5 3h-2.25V1.5h-1.5V3h-7.5V1.5h-1.5V3H4.5A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3z" fill="#4285F4"/>
        <path d="M3 9h18v10.5A1.5 1.5 0 0 1 19.5 21h-15A1.5 1.5 0 0 1 3 19.5V9z" fill="white"/>
        <path d="M3 9h18V4.5A1.5 1.5 0 0 0 19.5 3h-15A1.5 1.5 0 0 0 3 4.5V9z" fill="#4285F4"/>
        <path d="M8.25 13.5h1.5v1.5h-1.5zM11.25 13.5h1.5v1.5h-1.5zM14.25 13.5h1.5v1.5h-1.5zM8.25 16.5h1.5v1.5h-1.5zM11.25 16.5h1.5v1.5h-1.5z" fill="#4285F4"/>
        <path d="M8.25 6h1.5v3h-1.5zM14.25 6h1.5v3h-1.5z" fill="white"/>
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
      // Official Google Drive logo
      <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.71 3.5L1.15 15l3.43 5.5h15.84L23.85 15 17.29 3.5z" fill="none"/>
        <path d="M1.15 15l3.43 5.5h6.46L7.71 15z" fill="#0066DA"/>
        <path d="M17.29 3.5H7.71L4.58 9l3.43 6h8.58l3.43-6z" fill="#00AC47"/>
        <path d="M17.29 3.5l3.43 6h-3.43l-3.43-6z" fill="#00832D"/>
        <path d="M11.04 20.5h9.38l3.43-5.5h-9.38z" fill="#2684FC"/>
        <path d="M7.71 15l3.33 5.5h3.92L11.63 15z" fill="#0066DA"/>
        <path d="M14.47 9H7.71l-3.13 6h6.76z" fill="#00AC47"/>
        <path d="M17.29 3.5H7.71L4.58 9h9.89z" fill="#00AC47"/>
        <path d="M20.72 15H11.34l3.13-6h9.38z" fill="#2684FC"/>
        <path d="M17.29 3.5l3.43 6h-3.43l-3.43-6z" fill="#00832D"/>
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
      // Official Google Docs logo
      <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" fill="#4285F4"/>
        <path d="M14 2v6h6" fill="none" stroke="#A8C7FA" strokeWidth="1"/>
        <path d="M14.5 2L20 7.5h-5.5V2z" fill="#A8C7FA"/>
        <path d="M8 13h8M8 16h8M8 10h4" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
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
      // Official Google Sheets logo
      <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" fill="#34A853"/>
        <path d="M14.5 2L20 7.5h-5.5V2z" fill="#A8D5B5"/>
        <rect x="7" y="11" width="4" height="2.5" rx=".3" fill="white"/>
        <rect x="12" y="11" width="5" height="2.5" rx=".3" fill="white"/>
        <rect x="7" y="14.5" width="4" height="2.5" rx=".3" fill="white"/>
        <rect x="12" y="14.5" width="5" height="2.5" rx=".3" fill="white"/>
        <path d="M7 9h10" stroke="white" strokeWidth="1" strokeLinecap="round"/>
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
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fetchIntegrations = async () => {
    try {
      const r = await fetch('/api/integrations', { credentials: 'include' })
      const d = await r.json()
      if (d.integrations) setIntegrations(d.integrations)
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    // Check URL params for success/error after OAuth redirect
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'google') {
      setSuccessMsg('Services Google connectés avec succès !')
      // Clean URL without reload
      window.history.replaceState({}, '', '/integrations')
    }
    const err = params.get('error') ?? params.get('integration_error')
    if (err) {
      setErrorMsg(`Erreur de connexion : ${err.replace(/_/g, ' ')}`)
      window.history.replaceState({}, '', '/integrations')
    }
    fetchIntegrations()
  }, [])

  const isConnected = (service: string) => integrations.some(i => i.service === service)

  const disconnect = async (service: string) => {
    setDisconnecting(service)
    await fetch('/api/integrations', {
      method: 'DELETE',
      credentials: 'include',
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

        {/* Success / Error banners */}
        {successMsg && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[13px] font-medium flex items-center gap-2">
            <Check size={14} />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-500 text-[13px] font-medium flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {errorMsg}
          </div>
        )}

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
