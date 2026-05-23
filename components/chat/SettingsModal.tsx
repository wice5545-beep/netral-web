'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe2, Palette, Brain, Search, Shield, Bell, Keyboard, CreditCard, Info, Trash2, Sun, Moon, Monitor, Download } from 'lucide-react'
import { useTheme } from '@/components/ui/ThemeProvider'
import { cn } from '@/lib/utils'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  user: { id: string; name?: string | null; email: string }
}

type Tab = 'general' | 'appearance' | 'models' | 'search' | 'privacy' | 'notifications' | 'shortcuts' | 'subscription' | 'about'

export function SettingsModal({ open, onClose, user }: SettingsModalProps) {
  const [tab, setTab] = useState<Tab>('general')
  const { theme, setTheme } = useTheme()
  const [responseTone, setResponseTone] = useState('balanced')
  const [language, setLanguage] = useState('fr')
  const [showSources, setShowSources] = useState(true)
  const [realtimeSearch, setRealtimeSearch] = useState(true)
  const [smartSuggestions, setSmartSuggestions] = useState(true)
  const [savedMsg, setSavedMsg] = useState('')

  // Close on escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const clearHistory = async () => {
    if (!confirm("Effacer tout l'historique ? Action irréversible.")) return
    await fetch('/api/conversations', { method: 'DELETE' })
    setSavedMsg('Historique effacé')
    setTimeout(() => setSavedMsg(''), 2000)
  }

  const clearMemory = async () => {
    if (!confirm('Supprimer toute la mémoire ?')) return
    await fetch('/api/memory', { method: 'DELETE' })
    setSavedMsg('Mémoire effacée')
    setTimeout(() => setSavedMsg(''), 2000)
  }

  const tabs: { id: Tab; label: string; icon: typeof Globe2; num: string }[] = [
    { id: 'general', label: 'Général', icon: Globe2, num: 'I' },
    { id: 'appearance', label: 'Apparence', icon: Palette, num: 'II' },
    { id: 'models', label: 'Modèles', icon: Brain, num: 'III' },
    { id: 'search', label: 'Recherche', icon: Search, num: 'IV' },
    { id: 'privacy', label: 'Confidentialité', icon: Shield, num: 'V' },
    { id: 'notifications', label: 'Notifications', icon: Bell, num: 'VI' },
    { id: 'shortcuts', label: 'Raccourcis', icon: Keyboard, num: 'VII' },
    { id: 'subscription', label: 'Abonnement', icon: CreditCard, num: 'VIII' },
    { id: 'about', label: 'À propos', icon: Info, num: 'IX' },
  ]

  const currentTab = tabs.find(t => t.id === tab)

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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-[var(--bg-elevated)] rounded-[16px] w-full max-w-4xl max-h-[88vh] overflow-hidden pointer-events-auto shadow-[var(--shadow-press)] flex flex-col md:flex-row border border-[var(--rule)]">
              {/* ━ Sidebar ━ */}
              <div className="md:w-60 shrink-0 p-4 md:border-r border-b md:border-b-0 border-[var(--rule)] flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible bg-[var(--bg-soft)]">
                <div className="hidden md:block px-2 mb-4">
                  <p className="label">Paramètres</p>
                  <p className="font-display text-2xl mt-1 leading-none">Réglages</p>
                </div>
                {tabs.map((t) => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all shrink-0 group',
                        tab === t.id
                          ? 'bg-[var(--bg-elevated)] text-[var(--fg)] font-medium border border-[var(--rule)] shadow-sm'
                          : 'text-[var(--fg-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--fg)]'
                      )}
                    >
                      <span className="font-mono text-[10px] tracking-wider opacity-50">{t.num}</span>
                      <Icon size={13} strokeWidth={1.8} className="opacity-70" />
                      {t.label}
                    </button>
                  )
                })}
              </div>

              {/* ━ Content ━ */}
              <div className="flex-1 overflow-y-auto relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-md hover:bg-[var(--bg-soft)] text-[var(--fg-muted)] z-10"
                  aria-label="Fermer"
                >
                  <X size={16} />
                </button>

                <div className="p-8 lg:p-12">
                  {/* Section header */}
                  <div className="mb-8 flex items-center gap-3">
                    <span className="label-num">{currentTab?.num}</span>
                    <span className="rule flex-1 max-w-[40px]" />
                    <span className="label">{currentTab?.label}</span>
                  </div>

                  {tab === 'general' && (
                    <div className="space-y-6">
                      <h2 className="font-display text-3xl tracking-tight">Préférences générales</h2>

                      <div className="space-y-5 pt-4">
                        <Field label="Langue d'interface">
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="input h-10"
                          >
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="de">Deutsch</option>
                          </select>
                        </Field>

                        <Field label="Ton des réponses" hint="Style de communication par défaut">
                          <select
                            value={responseTone}
                            onChange={(e) => setResponseTone(e.target.value)}
                            className="input h-10"
                          >
                            <option value="balanced">Équilibré</option>
                            <option value="concise">Concis</option>
                            <option value="friendly">Amical</option>
                            <option value="technical">Technique</option>
                            <option value="creative">Créatif</option>
                          </select>
                        </Field>

                        <div className="rule" />

                        <Toggle label="Afficher les sources dans les réponses" value={showSources} onChange={setShowSources} />
                        <Toggle label="Recherche web automatique" value={realtimeSearch} onChange={setRealtimeSearch} />
                        <Toggle label="Suggestions intelligentes" value={smartSuggestions} onChange={setSmartSuggestions} />

                        <div className="rule" />

                        <div>
                          <p className="text-[13px] font-medium mb-3">Données</p>
                          <div className="space-y-2">
                            <ActionRow label="Effacer l'historique" desc="Toutes vos conversations" onClick={clearHistory} danger />
                            <ActionRow label="Effacer la mémoire" desc="Préférences enregistrées" onClick={clearMemory} danger />
                            <ActionRow label="Exporter mes données" desc="Téléchargement complet" onClick={() => {}} icon={<Download size={12} />} />
                          </div>
                        </div>

                        {savedMsg && <p className="text-[12px] text-[var(--jewel)]">{savedMsg}</p>}
                      </div>
                    </div>
                  )}

                  {tab === 'appearance' && (
                    <div className="space-y-6">
                      <h2 className="font-display text-3xl tracking-tight">Apparence</h2>
                      <p className="text-[14px] text-[var(--fg-muted)]">Choisissez l'esthétique qui vous convient.</p>
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        {[
                          { id: 'light', label: 'Clair', icon: Sun, desc: 'Cream paper' },
                          { id: 'dark', label: 'Sombre', icon: Moon, desc: 'Ink night' },
                          { id: 'system', label: 'Système', icon: Monitor, desc: 'Suit votre OS' },
                        ].map((t) => {
                          const Icon = t.icon
                          return (
                            <button
                              key={t.id}
                              onClick={() => setTheme(t.id as 'light' | 'dark' | 'system')}
                              className={cn(
                                'p-5 rounded-[12px] border flex flex-col items-start gap-2 transition-all',
                                theme === t.id
                                  ? 'bg-[var(--jewel-soft)] border-[var(--jewel)] text-[var(--jewel)]'
                                  : 'border-[var(--rule)] text-[var(--fg-muted)] hover:border-[var(--rule-strong)] hover:bg-[var(--bg-soft)]'
                              )}
                            >
                              <Icon size={18} strokeWidth={1.5} />
                              <div>
                                <p className="text-[13px] font-medium text-[var(--fg)]">{t.label}</p>
                                <p className="text-[11px] text-[var(--fg-subtle)]">{t.desc}</p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {tab === 'models' && (
                    <div className="space-y-6">
                      <h2 className="font-display text-3xl tracking-tight">Modèles IA</h2>
                      <p className="text-[14px] text-[var(--fg-muted)]">Le modèle utilisé par défaut.</p>
                      <div className="space-y-2 pt-2">
                        {[
                          { id: 'ntrl-1.3', name: 'Netral 1.3', desc: 'Le plus puissant — raisonnement avancé, recherche web', badge: 'Recommandé' },
                          { id: 'ntrl-1.2', name: 'Netral 1.2', desc: 'Rapide et polyvalent', badge: null },
                          { id: 'ntrl-1.0', name: 'Netral 1.0', desc: 'Ultra-rapide, réponses brèves', badge: null },
                        ].map((m) => (
                          <div key={m.id} className="flex items-center gap-4 p-4 rounded-[10px] border border-[var(--rule)] hover:border-[var(--jewel)]/40 transition-colors">
                            <div className="w-10 h-10 rounded-md bg-[var(--jewel-soft)] flex items-center justify-center">
                              <Brain size={16} className="text-[var(--jewel)]" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-[14px] font-medium">{m.name}</p>
                                {m.badge && <span className="text-[9px] font-medium uppercase tracking-wider text-[var(--jewel)]">{m.badge}</span>}
                              </div>
                              <p className="text-[12px] text-[var(--fg-muted)]">{m.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tab === 'search' && (
                    <div className="space-y-6">
                      <h2 className="font-display text-3xl tracking-tight">Recherche</h2>
                      <p className="text-[14px] text-[var(--fg-muted)]">Comment Netral consulte le web.</p>
                      <div className="space-y-3 pt-2">
                        <Toggle label="Recherche automatique quand pertinent" value={realtimeSearch} onChange={setRealtimeSearch} />
                        <Toggle label="Afficher les sources dans les réponses" value={showSources} onChange={setShowSources} />
                        <Toggle label="Suggestions de recherche" value={smartSuggestions} onChange={setSmartSuggestions} />
                      </div>
                    </div>
                  )}

                  {tab === 'privacy' && (
                    <div className="space-y-6">
                      <h2 className="font-display text-3xl tracking-tight">Confidentialité</h2>
                      <p className="text-[14px] text-[var(--fg-muted)]">Vos données vous appartiennent.</p>
                      <div className="space-y-3 pt-2">
                        <ActionRow label="Mémoire" desc="Préférences mémorisées" onClick={clearMemory} danger icon={<Trash2 size={12} />} />
                        <ActionRow label="Historique des conversations" desc="Toutes les conversations passées" onClick={clearHistory} danger icon={<Trash2 size={12} />} />
                        <ActionRow label="Exporter mes données" desc="Archive téléchargeable" onClick={() => {}} icon={<Download size={12} />} />
                      </div>
                      <div className="rule" />
                      <div className="bg-[var(--bg-soft)] rounded-[10px] p-4 border border-[var(--rule)]">
                        <div className="flex items-start gap-3">
                          <Shield size={14} className="text-[var(--jewel)] mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[13px] font-medium mb-1">Sécurité</p>
                            <p className="text-[12px] text-[var(--fg-muted)] leading-relaxed">
                              Chiffrement TLS en transit. Sessions sécurisées via cookies HttpOnly. Aucune utilisation de vos conversations pour entraînement.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {tab === 'notifications' && (
                    <div className="space-y-6">
                      <h2 className="font-display text-3xl tracking-tight">Notifications</h2>
                      <p className="text-[14px] text-[var(--fg-muted)]">Quand vous contacter.</p>
                      <div className="space-y-3 pt-2">
                        <Toggle label="Notifications par email" value={false} onChange={() => {}} />
                        <Toggle label="Mises à jour produit" value={true} onChange={() => {}} />
                        <Toggle label="Conseils & astuces" value={false} onChange={() => {}} />
                      </div>
                    </div>
                  )}

                  {tab === 'shortcuts' && (
                    <div className="space-y-6">
                      <h2 className="font-display text-3xl tracking-tight">Raccourcis clavier</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-2">
                        {[
                          { action: 'Nouvelle conversation', keys: '⌘ N' },
                          { action: 'Rechercher', keys: '⌘ K' },
                          { action: 'Envoyer le message', keys: '↵' },
                          { action: 'Nouvelle ligne', keys: '⇧ ↵' },
                          { action: 'Basculer la sidebar', keys: '⌘ B' },
                          { action: 'Paramètres', keys: '⌘ ,' },
                          { action: 'Fermer modal', keys: 'Esc' },
                          { action: 'Régénérer', keys: '⌘ R' },
                        ].map((s) => (
                          <div key={s.action} className="flex items-center justify-between py-2 border-b border-[var(--rule-faint)]">
                            <span className="text-[13px] text-[var(--fg-soft)]">{s.action}</span>
                            <span className="kbd">{s.keys}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tab === 'subscription' && (
                    <div className="space-y-6">
                      <h2 className="font-display text-3xl tracking-tight">Abonnement</h2>
                      <div className="bg-[var(--fg)] text-[var(--bg)] rounded-[14px] p-6 lg:p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="label opacity-50 mb-1" style={{ color: 'inherit' }}>Plan actuel</p>
                            <p className="font-display text-3xl tracking-tight">Free</p>
                          </div>
                          <CreditCard size={20} className="opacity-40" strokeWidth={1.5} />
                        </div>
                        <p className="text-[13px] opacity-60 mb-6">Accès limité aux fonctionnalités essentielles.</p>
                        <button className="btn-jewel w-full h-11">
                          Passer à Pro
                        </button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[13px] font-medium">Le plan Pro inclut :</p>
                        <ul className="space-y-1.5 text-[13px] text-[var(--fg-muted)]">
                          {['Messages illimités', 'Modèles avancés (Netral 1.3+)', 'Recherche web prioritaire', 'Support dédié', 'Accès anticipé aux nouvelles features'].map(f => (
                            <li key={f} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-[var(--jewel)]" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {tab === 'about' && (
                    <div className="space-y-6">
                      <h2 className="font-display text-3xl tracking-tight">À propos</h2>
                      <div className="space-y-3 pt-2">
                        <InfoRow label="Version" value="1.3.0" />
                        <InfoRow label="Modèle actuel" value="Netral 1.3" />
                        <InfoRow label="Compte" value={user.email} />
                        <InfoRow label="Build" value="2026.05" />
                      </div>
                      <div className="rule" />
                      <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed">
                        Netral est un assistant IA éditorial. Il consulte, lit, et synthétise le web en temps réel. Conçu pour les esprits curieux qui exigent des réponses sourcées.
                      </p>
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[13px] font-medium text-[var(--fg-soft)] mb-1.5 block flex items-center gap-2">
        {label}
        {hint && <span className="text-[11px] text-[var(--fg-subtle)] font-normal">— {hint}</span>}
      </label>
      {children}
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[13px] text-[var(--fg-soft)]">{label}</span>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        className={cn(
          'w-10 h-6 rounded-full relative transition-colors',
          value ? 'bg-[var(--jewel)]' : 'bg-[var(--rule-strong)]'
        )}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          animate={{ left: value ? 20 : 2 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </button>
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
          'flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-md transition-colors',
          danger
            ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
            : 'text-[var(--jewel)] hover:bg-[var(--jewel-soft)]'
        )}
      >
        {icon}
        {danger ? 'Effacer' : 'Exporter'}
      </button>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[var(--rule-faint)]">
      <span className="text-[12px] text-[var(--fg-muted)]">{label}</span>
      <span className="text-[12px] font-medium font-mono">{value}</span>
    </div>
  )
}
