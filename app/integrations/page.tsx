'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ArrowLeft, Bolt, Check, Clock, ExternalLink, History, Loader2, Mail, Search, Send, Sparkles, Unlink, Zap } from 'lucide-react'
import { MarketingNav } from '@/components/landing/MarketingNav'
import { AuroraBackground } from '@/components/landing/AuroraBackground'

function ApiIcon() {
  return (
    <div className="relative w-28 h-28 mx-auto mb-8">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-violet-500/20"
          animate={{ scale: [1, 1.8 + i * 0.4], opacity: [0.5, 0] }}
          transition={{ duration: 2.5, delay: i * 0.6, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'conic-gradient(from 0deg, #7c3aed, #ec4899, #f97316, #7c3aed)' }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <motion.div
          className="absolute inset-[3px] rounded-full bg-[var(--bg)] flex items-center justify-center"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <Zap size={36} className="text-violet-500" strokeWidth={1.2} />
        </motion.div>
      </motion.div>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            background: ['#7c3aed', '#ec4899', '#f97316', '#8b5cf6'][i % 4],
          }}
          animate={{
            x: [0, Math.cos(i * 45 * Math.PI / 180) * 52],
            y: [0, Math.sin(i * 45 * Math.PI / 180) * 52],
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{ duration: 3, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

const SERVICES = [
  {
    id: 'gmail',
    label: 'Gmail',
    description: "L'IA lit, résume et RÉPOND à vos emails automatiquement. Elle peut envoyer des emails pour vous.",
    color: '#EA4335',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
      </svg>
    ),
    capabilities: ['Lecture de la boîte de réception', 'Résumé intelligent des emails', 'Envoi automatique d\'emails', 'Recherche avancée (expéditeur, sujet, contenu)', 'Tri, archivage et gestion complète'],
    actions: ['Lire mes derniers emails', 'Envoyer un email à...', 'Rechercher les emails de...', 'Résumer mes emails non lus'],
  },
  {
    id: 'calendar',
    label: 'Google Calendar',
    description: "L'IA consulte votre agenda et CRÉE des événements. Planifiez vos rdv sans quitter le chat.",
    color: '#4285F4',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4.5" width="18" height="16.5" rx="1.5" fill="#4285F4"/>
        <rect x="3" y="9" width="18" height="1" fill="white" opacity="0.3"/>
        <rect x="6.75" y="2.25" width="1.5" height="3" rx="0.5" fill="#4285F4"/>
        <rect x="15.75" y="2.25" width="1.5" height="3" rx="0.5" fill="#4285F4"/>
        <text x="8.5" y="14.5" fontSize="3" fontWeight="bold" fill="white">15</text>
      </svg>
    ),
    capabilities: ['Voir les événements à venir', 'Créer des rendez-vous et événements', 'Résumer votre semaine', 'Détecter les conflits d\'agenda', 'Inviter des participants'],
    actions: ['Quels sont mes rdv aujourd\'hui ?', 'Ajoute un événement lundi à 14h', 'Résume ma semaine prochaine', 'Suis-je libre mercredi après-midi ?'],
  },
  {
    id: 'drive',
    label: 'Google Drive',
    description: "L'IA lit le contenu de vos fichiers Drive — documents, PDF, textes.",
    color: '#34A853',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.15 15l3.43 5.5h6.46L7.71 15z" fill="#0066DA"/>
        <path d="M17.29 3.5H7.71L4.58 9l3.43 6h8.58l3.43-6z" fill="#00AC47"/>
        <path d="M17.29 3.5l3.43 6h-3.43l-3.43-6z" fill="#00832D"/>
        <path d="M11.04 20.5h9.38l3.43-5.5h-9.38z" fill="#2684FC"/>
        <path d="M7.71 15l3.33 5.5h3.92L11.63 15z" fill="#0066DA"/>
        <path d="M14.47 9H7.71l-3.13 6h6.76z" fill="#00AC47"/>
      </svg>
    ),
    capabilities: ['Lister les fichiers récents', 'Lire les documents texte', 'Rechercher par nom', 'Afficher le contenu des PDF', 'Lire les feuilles de calcul'],
    actions: ['Liste mes fichiers récents', 'Cherche le document X', 'Lis le contenu de mon PDF', 'Montre mes présentations'],
  },
  {
    id: 'docs',
    label: 'Google Docs',
    description: "L'IA lit le contenu de vos documents Google Docs en temps réel.",
    color: '#4285F4',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="2" width="14" height="17" rx="1.5" fill="#4285F4"/>
        <rect x="5" y="5" width="10" height="1" rx="0.5" fill="white" opacity="0.3"/>
        <rect x="5" y="8" width="10" height="1" rx="0.5" fill="white" opacity="0.3"/>
        <rect x="5" y="11" width="8" height="1" rx="0.5" fill="white" opacity="0.3"/>
        <rect x="5" y="14" width="10" height="1" rx="0.5" fill="white" opacity="0.3"/>
        <path d="M17 17v3.5c0 .83-.67 1.5-1.5 1.5h-11c-.83 0-1.5-.67-1.5-1.5V17h14z" fill="#0056b3"/>
      </svg>
    ),
    capabilities: ['Lire le contenu des documents', 'Rechercher dans les docs', 'Résumer un document', 'Extraire des informations clés'],
    actions: ['Lis mon document "Rapport Q1"', 'Résume la proposition commerciale', 'Cherche les chiffres dans mes docs'],
  },
  {
    id: 'sheets',
    label: 'Google Sheets',
    description: "L'IA analyse vos feuilles de calcul et en extrait des insights pertinents.",
    color: '#34A853',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="2" width="18" height="20" rx="1.5" fill="#34A853"/>
        <rect x="3" y="8" width="18" height="0.5" fill="white" opacity="0.2"/>
        <rect x="3" y="14" width="18" height="0.5" fill="white" opacity="0.2"/>
        <rect x="9" y="2" width="0.5" height="20" fill="white" opacity="0.15"/>
        <rect x="15" y="2" width="0.5" height="20" fill="white" opacity="0.15"/>
      </svg>
    ),
    capabilities: ['Lire les données des feuilles', 'Analyser les tendances', 'Extraire des résumés chiffrés', 'Croiser les informations'],
    actions: ['Analyse mon tableur budget', 'Quel est le total des ventes ?', 'Résume les KPIs de ma feuille'],
  },
]

interface ActivityItem {
  id: string
  service: string
  action: string
  description: string
  timestamp: Date
  status: 'success' | 'error'
}

function IntegrationsContent() {
  const searchParams = useSearchParams()
  const callback = searchParams.get('callback')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [connections, setConnections] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [activityLoading, setActivityLoading] = useState(false)
  const [showActivity, setShowActivity] = useState(false)

  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch('/api/integrations')
      if (res.ok) {
        const data = await res.json()
        setConnections(data.connections || [])
      }
    } catch {} finally { setLoading(false) }
  }, [])

  const fetchActivity = useCallback(async () => {
    setActivityLoading(true)
    try {
      const res = await fetch('/api/integrations/activity')
      if (res.ok) {
        const data = await res.json()
        setActivity(data.activities || [])
      }
    } catch {
      // Fallback: load from localStorage
      try {
        const local = localStorage.getItem('netral_tool_activity')
        if (local) setActivity(JSON.parse(local))
      } catch {}
    } finally { setActivityLoading(false) }
  }, [])

  useEffect(() => {
    fetchConnections()
    fetchActivity()
  }, [fetchConnections, fetchActivity])

  useEffect(() => {
    if (callback === 'success') {
      setNotification({ type: 'success', message: 'Services Google connectés avec succès ! Votre IA peut maintenant agir en votre nom.' })
      fetchConnections()
      const url = new URL(window.location.href)
      url.searchParams.delete('callback')
      window.history.replaceState({}, '', url.toString())
    } else if (callback === 'error') {
      setNotification({ type: 'error', message: 'La connexion a échoué. Veuillez réessayer.' })
      const url = new URL(window.location.href)
      url.searchParams.delete('callback')
      window.history.replaceState({}, '', url.toString())
    }
  }, [callback, fetchConnections])

  useEffect(() => {
    if (notification) { const t = setTimeout(() => setNotification(null), 6000); return () => clearTimeout(t) }
  }, [notification])

  async function disconnect(serviceId: string) {
    setDisconnecting(serviceId)
    try {
      const res = await fetch(`/api/integrations/disconnect?service=${serviceId}`)
      if (res.ok) {
        setConnections(prev => prev.filter(c => c !== serviceId))
        setNotification({ type: 'success', message: 'Service déconnecté avec succès.' })
      } else {
        setNotification({ type: 'error', message: 'Échec de la déconnexion.' })
      }
    } catch {
      setNotification({ type: 'error', message: 'Erreur réseau.' })
    } finally { setDisconnecting(null) }
  }

  function isConnected(serviceId: string) { return connections.includes(serviceId) }
  const connectedCount = SERVICES.filter(s => isConnected(s.id)).length

  const serviceLabelMap: Record<string, string> = {
    gmail: 'Gmail', calendar: 'Calendar', drive: 'Drive', docs: 'Docs', sheets: 'Sheets',
  }

  const serviceColorMap: Record<string, string> = {
    gmail: '#EA4335', calendar: '#4285F4', drive: '#34A853', docs: '#4285F4', sheets: '#34A853',
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] relative">
      <MarketingNav />
      <AuroraBackground />

      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px]"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[100px]"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)' }} />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-8 text-[13px] font-medium backdrop-blur-xl ${
                notification.type === 'error'
                  ? 'bg-red-500/10 border border-red-500/25 text-red-600'
                  : 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-600'
              }`}
            >
              {notification.type === 'error' ? <AlertTriangle size={18} /> : <Check size={18} />}
              {notification.message}
              <button onClick={() => setNotification(null)} className="ml-auto p-1 rounded-full hover:bg-white/10 transition-colors">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Link href="/chat" className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors mb-10 group">
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Retour au chat
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <ApiIcon />
          <motion.h1
            className="text-[40px] font-bold tracking-[-0.04em] mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Intégrations{' '}
            <span className="bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Agent IA
            </span>
          </motion.h1>
          <motion.p
            className="text-[15px] text-[var(--fg-muted)] max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Connectez vos services Google. Votre IA pourra alors{' '}
            <span className="text-[var(--fg)] font-medium">lire, écrire et agir</span> en votre nom — emails, calendrier, fichiers.
          </motion.p>

          {/* Status pill */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 }}
              className="inline-flex items-center gap-3 mt-6 px-5 py-2.5 rounded-full glass-card text-[13px]"
            >
              <motion.span
                animate={connectedCount > 0 ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-2.5 h-2.5 rounded-full ${connectedCount > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[var(--fg-subtle)]'}`}
              />
              {connectedCount > 0
                ? `${connectedCount} service${connectedCount > 1 ? 's' : ''} connecté${connectedCount > 1 ? 's' : ''}`
                : 'Aucun service connecté'}
              {connectedCount > 0 && (
                <Sparkles size={14} className="text-emerald-500" />
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Connect all CTA */}
        {!loading && connectedCount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-10"
          >
            <a
              href="/api/integrations/connect/google?services=gmail,calendar,drive,docs,sheets"
              className="relative flex items-center justify-center gap-3 w-full h-14 rounded-2xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[1.5px] bg-[var(--bg)] rounded-2xl" />
              <div className="relative flex items-center gap-3 text-[14px] font-semibold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent group-hover:from-violet-300 group-hover:to-pink-300 transition-all">
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18Z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
                Connecter tous les services Google
                <ExternalLink size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          </motion.div>
        )}

        {/* Service cards */}
        <div className="space-y-4">
          {SERVICES.map((service, i) => {
            const connected = isConnected(service.id)
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative rounded-2xl border p-5 transition-all duration-500 ${
                  connected
                    ? 'border-emerald-500/25 bg-emerald-500/[0.03] hover:border-emerald-500/50 hover:bg-emerald-500/[0.06]'
                    : 'border-[var(--border)] bg-[var(--bg-elevated)] hover:border-violet-500/20 hover:bg-[var(--bg-elevated)]'
                }`}
              >
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/5 to-pink-500/5 opacity-0 transition-opacity duration-500 pointer-events-none"
                  animate={{ opacity: hoveredCard === service.id ? 1 : 0 }}
                />

                <div className="relative flex items-start gap-4">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -3 }}
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-300 ${
                      connected ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-[var(--border)] bg-[var(--bg-soft)]'
                    }`}
                  >
                    {service.icon}
                  </motion.div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-[14px] font-semibold">{service.label}</span>
                      {connected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-500/10"
                        >
                          <motion.span
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                          />
                          Connecté
                        </motion.span>
                      )}
                      {!connected && (
                        <span className="text-[11px] text-[var(--fg-subtle)]">Non connecté</span>
                      )}
                    </div>
                    <p className="text-[12.5px] text-[var(--fg-muted)] mb-3 leading-relaxed">{service.description}</p>

                    {/* Capabilities */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {service.capabilities.map(cap => (
                        <motion.span
                          key={cap}
                          whileHover={{ scale: 1.03 }}
                          className="flex items-center gap-1 text-[11px] text-[var(--fg-subtle)] px-2 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-soft)]/40 transition-colors hover:border-violet-500/20 hover:text-[var(--fg-muted)]"
                        >
                          <Bolt size={8} strokeWidth={3} />
                          {cap}
                        </motion.span>
                      ))}
                    </div>

                    {/* Example actions */}
                    <AnimatePresence>
                      {hoveredCard === service.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-1.5">
                            <span className="text-[10px] text-[var(--fg-subtle)] uppercase tracking-wider font-semibold w-full mb-0.5">Exemples :</span>
                            {service.actions.map(action => (
                              <span key={action} className="text-[11px] text-violet-500 italic px-2 py-0.5 rounded-full bg-violet-500/5">
                                "{action}"
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Action button */}
                  <div className="shrink-0">
                    {loading ? (
                      <div className="w-9 h-9 flex items-center justify-center">
                        <Loader2 size={15} className="animate-spin text-[var(--fg-muted)]" />
                      </div>
                    ) : connected ? (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => disconnect(service.id)}
                        disabled={disconnecting === service.id}
                        className="flex items-center gap-1.5 text-[11.5px] font-medium px-3.5 py-2 rounded-xl border border-[var(--border)] text-[var(--fg-muted)] hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-all disabled:opacity-50"
                      >
                        {disconnecting === service.id ? <Loader2 size={12} className="animate-spin" /> : <Unlink size={12} />}
                        Déconnecter
                      </motion.button>
                    ) : (
                      <motion.a
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        href={`/api/integrations/connect/google?services=${service.id}`}
                        className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3.5 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/20"
                      >
                        <Mail size={12} />
                        Connecter
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* AI Activity Section */}
        {connectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12"
          >
            <button
              onClick={() => { setShowActivity(!showActivity); if (!showActivity) fetchActivity() }}
              className="flex items-center justify-between w-full px-5 py-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] hover:border-violet-500/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <History size={18} className="text-violet-500" />
                </div>
                <div className="text-left">
                  <span className="text-[14px] font-semibold">Activité récente de l'IA</span>
                  <p className="text-[12px] text-[var(--fg-muted)]">
                    {showActivity ? 'Masquer' : 'Voir'} ce que votre IA a fait avec vos services connectés
                  </p>
                </div>
              </div>
              <motion.div animate={{ rotate: showActivity ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ArrowLeft size={14} className="rotate-180 text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showActivity && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-2">
                    {activityLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 size={20} className="animate-spin text-[var(--fg-muted)]" />
                      </div>
                    ) : activity.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 px-4 rounded-2xl border border-dashed border-[var(--border)]"
                      >
                        <Search size={24} className="mx-auto mb-3 text-[var(--fg-subtle)]" />
                        <p className="text-[13px] text-[var(--fg-muted)] mb-1">Aucune activité récente</p>
                        <p className="text-[12px] text-[var(--fg-subtle)]">
                          Utilisez le chat pour demander à l'IA d'agir sur vos services connectés. L'activité apparaîtra ici.
                        </p>
                      </motion.div>
                    ) : (
                      activity.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[var(--bg-soft)]/50 border border-[var(--border)] hover:border-[var(--border-strong)] transition-all"
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: serviceColorMap[item.service] || '#7c3aed' }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[12px] font-semibold">{serviceLabelMap[item.service] || item.service}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--bg-soft)] text-[var(--fg-muted)]">
                                {item.action}
                              </span>
                              {item.status === 'success' ? (
                                <Check size={10} className="text-emerald-500" />
                              ) : (
                                <AlertTriangle size={10} className="text-red-500" />
                              )}
                            </div>
                            <p className="text-[12px] text-[var(--fg-muted)] truncate">{item.description}</p>
                          </div>
                          <span className="text-[10px] text-[var(--fg-subtle)] whitespace-nowrap">
                            {new Date(item.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Security note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/30 flex gap-4 text-[12.5px] text-[var(--fg-muted)] leading-relaxed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 mt-0.5 text-violet-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>
            Vos tokens OAuth sont chiffrés (AES-256) et stockés de façon sécurisée. Netral accède à vos données uniquement lors de vos conversations actives. Pour les actions sensibles (envoi d'email, création d'événement), l'IA vous demandera confirmation avant d'exécuter. Vous pouvez révoquer l'accès à tout moment.
          </span>
        </motion.div>
      </div>
    </div>
  )
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={null}>
      <IntegrationsContent />
    </Suspense>
  )
}