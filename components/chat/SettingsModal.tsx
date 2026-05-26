'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Sun, Moon, Monitor, Download, Shield, Zap } from 'lucide-react'
import { UserIcon } from '@/components/ui/user'
import { BrainIcon } from '@/components/ui/brain'
import { ShieldCheckIcon } from '@/components/ui/shield-check'
import { SettingsIcon } from '@/components/ui/settings'
import { LanguagesIcon } from '@/components/ui/languages'
import { LockIcon } from '@/components/ui/lock'
import { useTheme } from '@/components/ui/ThemeProvider'
import { useI18n } from '@/lib/i18n'
import { locales, localeNames, type Locale } from '@/lib/i18n/translations'
import { cn } from '@/lib/utils'

// Wrapper for Zap from lucide-react to match icon component signature
function ZapIcon({ size }: { size?: number }) { return <Zap size={size} /> }

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  user: { id: string; name?: string | null; email: string }
}

type Tab = 'general' | 'appearance' | 'memory' | 'privacy' | 'security' | 'account' | 'shortcuts' | 'subscription' | 'vscode' | 'integrations'

export function SettingsModal({ open, onClose, user }: SettingsModalProps) {
  const [tab, setTab] = useState<Tab>('general')
  const { theme, setTheme } = useTheme()
  const { locale, setLocale } = useI18n()
  const [responseTone, setResponseTone] = useState('balanced')
  const [memory, setMemory] = useState({ fullName: '', profession: '', interests: '', customInstructions: '' })
  const [savedMsg, setSavedMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [userPlan, setUserPlan] = useState('free')
  const [apiToken, setApiToken] = useState('')
  const [integrations, setIntegrations] = useState<{ service: string; updatedAt: string }[]>([])
  const [integLoading, setIntegLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    fetch('/api/memory')
      .then((r) => r.json())
      .then((d) => {
        if (d.memory) {
          setMemory({
            fullName: d.memory.fullName ?? '',
            profession: d.memory.profession ?? '',
            interests: d.memory.interests ?? '',
            customInstructions: d.memory.customInstructions ?? '',
          })
          setResponseTone(d.memory.tone ?? 'balanced')
        }
      })
      .catch(() => {})
    fetch('/api/user').then(r => r.json()).then(d => { if (d.user?.plan) setUserPlan(d.user.plan) }).catch(() => {})
    fetch('/api/integrations').then(r => r.json()).then(d => { if (d.integrations) setIntegrations(d.integrations) }).catch(() => {})
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const saveMemory = async () => {
    setSaving(true)
    await fetch('/api/memory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...memory, tone: responseTone }),
    })
    setSaving(false)
    setSavedMsg('Enregistré')
    setTimeout(() => setSavedMsg(''), 2000)
  }

  const clearHistory = async () => {
    if (!confirm("Effacer toutes vos conversations ? Action irréversible.")) return
    await fetch('/api/conversations', { method: 'DELETE' })
    setSavedMsg('Historique effacé')
    setTimeout(() => setSavedMsg(''), 2000)
  }

  const clearMemory = async () => {
    if (!confirm("Effacer toute la mémoire ?")) return
    await fetch('/api/memory', { method: 'DELETE' })
    setMemory({ fullName: '', profession: '', interests: '', customInstructions: '' })
    setSavedMsg('Mémoire effacée')
    setTimeout(() => setSavedMsg(''), 2000)
  }

  const tabs: { id: Tab; label: string; icon: typeof UserIcon }[] = [
    { id: 'general', label: 'Général', icon: SettingsIcon },
    { id: 'appearance', label: 'Apparence', icon: LanguagesIcon },
    { id: 'memory', label: 'Mémoire', icon: BrainIcon },
    { id: 'integrations', label: 'Intégrations', icon: ZapIcon },
    { id: 'account', label: 'Compte', icon: UserIcon },
    { id: 'security', label: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'privacy', label: 'Confidentialité', icon: LockIcon },
    { id: 'shortcuts', label: 'Raccourcis', icon: SettingsIcon },
    { id: 'subscription', label: 'Abonnement', icon: UserIcon },
    { id: 'vscode', label: 'VS Code', icon: SettingsIcon },
  ]

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-card w-full max-w-3xl max-h-[85vh] overflow-hidden pointer-events-auto shadow-colored flex flex-col md:flex-row">
              {/* Sidebar - icon only */}
              <div className="md:w-14 shrink-0 p-2 md:border-r border-b md:border-b-0 border-[var(--border)] flex md:flex-col items-center gap-1 overflow-x-auto md:overflow-x-visible bg-[var(--bg-soft)]">
                {tabs.map((t) => {
                  const Icon = t.icon
                  const isActive = tab === t.id
                  const isIntegrations = t.id === 'integrations'
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      title={t.label}
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 shrink-0 relative overflow-hidden',
                        isActive
                          ? 'bg-[var(--bg-elevated)] text-[var(--fg)] border border-[var(--border)] shadow-[var(--shadow-xs)]'
                          : 'text-[var(--fg-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--fg)]'
                      )}
                    >
                      {isIntegrations ? (
                        <div className="w-full h-full flex items-center justify-center relative">
                          {/* Video always mounted, opacity controlled */}
                          <video
                            src="/api.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={cn(
                              'w-7 h-7 object-cover rounded-md transition-opacity duration-200',
                              isActive ? 'opacity-100' : 'opacity-50'
                            )}
                          />
                          {/* Active glow ring */}
                          {isActive && (
                            <span className="absolute inset-0 rounded-lg ring-1 ring-violet-500/40 pointer-events-none" />
                          )}
                        </div>
                      ) : (
                        <Icon size={16} />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto relative">
                <button
                  onClick={onClose}
                  aria-label="Fermer"
                  className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-[var(--bg-soft)] text-[var(--fg-muted)] z-10 transition-colors"
                >
                  <X size={15} />
                </button>

                <div className="p-6 md:p-8">
                  {tab === 'general' && (
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-[18px] font-semibold mb-1">Général</h2>
                        <p className="text-[13px] text-[var(--fg-muted)]">Personnalisez votre expérience.</p>
                      </div>

                      <Field label="Langue">
                        <select
                          value={locale}
                          onChange={(e) => setLocale(e.target.value as Locale)}
                          className="w-full h-9 px-3 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[13px] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                        >
                          {locales.map((l) => (
                            <option key={l} value={l}>{localeNames[l]}</option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Ton de réponse">
                        <select
                          value={responseTone}
                          onChange={(e) => setResponseTone(e.target.value)}
                          className="w-full h-9 px-3 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[13px] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                        >
                          <option value="balanced">Équilibré</option>
                          <option value="concise">Concis</option>
                          <option value="friendly">Amical</option>
                          <option value="technical">Technique</option>
                          <option value="creative">Créatif</option>
                        </select>
                      </Field>

                      <button
                        onClick={saveMemory}
                        disabled={saving}
                        className="h-9 px-4 rounded-md bg-[var(--accent)] text-[var(--bg)] text-[13px] font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
                      >
                        {saving ? 'Enregistrement…' : 'Enregistrer'}
                      </button>
                      {savedMsg && <p className="text-[12px] text-green-600">{savedMsg}</p>}
                    </div>
                  )}

                  {tab === 'appearance' && (
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-[18px] font-semibold mb-1">Apparence</h2>
                        <p className="text-[13px] text-[var(--fg-muted)]">Choisissez votre thème.</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'light', label: 'Clair', icon: Sun },
                          { id: 'dark', label: 'Sombre', icon: Moon },
                          { id: 'system', label: 'Système', icon: Monitor },
                        ].map((t) => {
                          const Icon = t.icon
                          return (
                            <button
                              key={t.id}
                              onClick={() => setTheme(t.id as 'light' | 'dark' | 'system')}
                              className={cn(
                                'p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5',
                                theme === t.id
                                  ? 'border-transparent shadow-colored glass-card'
                                  : 'border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-sm'
                              )}
                            >
                              <Icon size={20} strokeWidth={1.5} />
                              <span className="text-[12.5px] font-medium">{t.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {tab === 'memory' && (
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
                          onClick={saveMemory}
                          disabled={saving}
                          className="h-9 px-4 rounded-md bg-[var(--accent)] text-[var(--bg)] text-[13px] font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
                        >
                          {saving ? 'Enregistrement…' : 'Enregistrer'}
                        </button>
                        <button
                          onClick={clearMemory}
                          className="h-9 px-3 rounded-md text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 size={12} />
                          Effacer
                        </button>
                        {savedMsg && <p className="text-[12px] text-green-600 ml-auto">{savedMsg}</p>}
                      </div>
                    </div>
                  )}

                  {tab === 'privacy' && (
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
                        <ActionRow label="Effacer toutes les conversations" desc="Suppression définitive" onClick={clearHistory} danger />
                        <ActionRow label="Effacer la mémoire" desc="Préférences enregistrées" onClick={clearMemory} danger />
                        <ActionRow label="Exporter mes données" desc="Téléchargement complet" onClick={() => {}} icon={<Download size={12} />} />
                      </div>
                    </div>
                  )}

                  {tab === 'shortcuts' && (
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
                  )}

                  {tab === 'account' && (
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
                  )}

                  {tab === 'security' && (
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
                  )}

                  {tab === 'subscription' && (
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-[18px] font-semibold mb-1">Abonnement</h2>
                        <p className="text-[13px] text-[var(--fg-muted)]">Gérez votre plan.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'free', name: 'Free', price: '0€', msgs: '1 msg/jour' },
                          { id: 'plus', name: 'Plus', price: '5€', msgs: '150 msgs / 2j' },
                          { id: 'pro', name: 'Pro', price: '20€', msgs: '750 msgs / 2j' },
                          { id: 'pro_plus', name: 'Pro+', price: '60€', msgs: '2000 msgs / 2j' },
                        ].map((p) => (
                          <div key={p.id} className={cn('rounded-xl border p-4 transition-all cursor-pointer hover:-translate-y-0.5', userPlan === p.id ? 'border-transparent shadow-colored glass-card' : 'border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-sm')}>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[14px] font-bold">{p.name}</p>
                              {userPlan === p.id && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full gradient-text bg-[var(--accent-soft)]">ACTIF</span>}
                            </div>
                            <p className="text-[20px] font-bold">{p.price}<span className="text-[11px] text-[var(--fg-muted)] font-normal">/mois</span></p>
                            <p className="text-[11px] text-[var(--fg-muted)] mt-1.5">{p.msgs}</p>
                          </div>
                        ))}
                      </div>
                      <a href="/tarifs" className="block">
                        <button className="w-full h-10 rounded-xl bg-[var(--accent)] text-[var(--bg)] text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98]">
                          Gérer mon abonnement
                        </button>
                      </a>
                    </div>
                  )}

                  {tab === 'integrations' && (
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
                      <Link href="/integrations" onClick={onClose}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-violet-500/25 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/40 transition-all group">
                        <div>
                          <div className="text-[13px] font-semibold text-violet-600 dark:text-violet-400">Gérer les intégrations</div>
                          <div className="text-[11.5px] text-[var(--fg-muted)] mt-0.5">Connecter, déconnecter, voir les permissions</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-violet-500 group-hover:translate-x-0.5 transition-transform">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </div>
                  )}

                  {tab === 'vscode' && (
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
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[12.5px] font-medium text-[var(--fg-soft)] mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

function ActionRow({ label, desc, onClick, danger, icon }: { label: string; desc: string; onClick: () => void; danger?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div>
        <p className="text-[13px] font-medium">{label}</p>
        <p className="text-[11px] text-[var(--fg-muted)]">{desc}</p>
      </div>
      <button
        onClick={onClick}
        className={cn(
          'h-7 px-2.5 rounded-md text-[12px] font-medium flex items-center gap-1.5 transition-colors',
          danger
            ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
            : 'text-[var(--fg)] hover:bg-[var(--bg-soft)]'
        )}
      >
        {icon}
        {danger ? 'Effacer' : 'Exporter'}
      </button>
    </div>
  )
}
