'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Sun, Moon, Monitor, Download, Shield } from 'lucide-react'
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

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  user: { id: string; name?: string | null; email: string }
}

type Tab = 'general' | 'appearance' | 'memory' | 'privacy' | 'security' | 'account' | 'shortcuts' | 'subscription'

export function SettingsModal({ open, onClose, user }: SettingsModalProps) {
  const [tab, setTab] = useState<Tab>('general')
  const { theme, setTheme } = useTheme()
  const { locale, setLocale } = useI18n()
  const [responseTone, setResponseTone] = useState('balanced')
  const [memory, setMemory] = useState({ fullName: '', profession: '', interests: '', customInstructions: '' })
  const [savedMsg, setSavedMsg] = useState('')
  const [saving, setSaving] = useState(false)

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
    { id: 'account', label: 'Compte', icon: UserIcon },
    { id: 'security', label: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'privacy', label: 'Confidentialité', icon: LockIcon },
    { id: 'shortcuts', label: 'Raccourcis', icon: SettingsIcon },
    { id: 'subscription', label: 'Abonnement', icon: UserIcon },
  ]

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-[var(--bg-elevated)] rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden pointer-events-auto shadow-[var(--shadow-xl)] flex flex-col md:flex-row border border-[var(--border)]">
              {/* Sidebar - icon only */}
              <div className="md:w-14 shrink-0 p-2 md:border-r border-b md:border-b-0 border-[var(--border)] flex md:flex-col items-center gap-1 overflow-x-auto md:overflow-x-visible bg-[var(--bg-soft)]">
                {tabs.map((t) => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      title={t.label}
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0',
                        tab === t.id
                          ? 'bg-[var(--bg-elevated)] text-[var(--fg)] border border-[var(--border)] shadow-[var(--shadow-xs)]'
                          : 'text-[var(--fg-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--fg)]'
                      )}
                    >
                      <Icon size={16} />
                    </button>
                  )
                })}
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
                      <div className="grid grid-cols-3 gap-2">
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
                                'p-4 rounded-lg border flex flex-col items-center gap-2 transition-all',
                                theme === t.id
                                  ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                                  : 'border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-soft)]'
                              )}
                            >
                              <Icon size={18} strokeWidth={1.5} />
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
                      <div className="rounded-lg border border-[var(--border)] p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-[11px] font-medium text-[var(--fg-muted)] uppercase tracking-wider mb-1">Plan actuel</p>
                            <p className="text-[20px] font-semibold">Free</p>
                          </div>
                        </div>
                        <p className="text-[13px] text-[var(--fg-muted)] mb-4">Accès limité aux fonctionnalités essentielles.</p>
                        <button className="w-full h-10 rounded-md bg-[var(--accent)] text-[var(--bg)] text-[13px] font-medium hover:bg-[var(--accent-hover)] transition-colors">
                          Passer à Pro
                        </button>
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
