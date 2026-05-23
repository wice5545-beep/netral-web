'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe2, Palette, Brain, Search, Shield, Bell, Keyboard, CreditCard, Info, Trash2, Sun, Moon, Monitor, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTheme } from '@/components/ui/ThemeProvider'
import { cn } from '@/lib/utils'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  user: { id: string; name?: string | null; email: string }
}

type Tab = 'general' | 'appearance' | 'models' | 'search' | 'privacy' | 'notifications' | 'shortcuts' | 'subscription' | 'about'

interface MemoryData {
  fullName: string
  profession: string
  interests: string
  tone: string
  customInstructions: string
}

export function SettingsModal({ open, onClose, user }: SettingsModalProps) {
  const [tab, setTab] = useState<Tab>('general')
  const { theme, setTheme } = useTheme()
  const [memory, setMemory] = useState<MemoryData>({
    fullName: '',
    profession: '',
    interests: '',
    tone: 'balanced',
    customInstructions: '',
  })
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')
  const [showSources, setShowSources] = useState(true)
  const [realtimeSearch, setRealtimeSearch] = useState(true)
  const [smartSuggestions, setSmartSuggestions] = useState(true)
  const [language, setLanguage] = useState('fr')
  const [responseTone, setResponseTone] = useState('balanced')

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
            tone: d.memory.tone ?? 'balanced',
            customInstructions: d.memory.customInstructions ?? '',
          })
          setResponseTone(d.memory.tone ?? 'balanced')
        }
      })
      .catch(() => {})
  }, [open])

  const saveMemory = async () => {
    setSaving(true)
    await fetch('/api/memory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...memory, tone: responseTone }),
    })
    setSaving(false)
    setSavedMessage('Enregistré')
    setTimeout(() => setSavedMessage(''), 2000)
  }

  const clearHistory = async () => {
    if (!confirm('Effacer tout l\'historique ? Cette action est irréversible.')) return
    await fetch('/api/conversations', { method: 'DELETE' })
    setSavedMessage('Historique effacé')
    setTimeout(() => setSavedMessage(''), 2000)
  }

  const clearMemory = async () => {
    if (!confirm('Supprimer toute la mémoire ?')) return
    await fetch('/api/memory', { method: 'DELETE' })
    setMemory({ fullName: '', profession: '', interests: '', tone: 'balanced', customInstructions: '' })
    setSavedMessage('Mémoire effacée')
    setTimeout(() => setSavedMessage(''), 2000)
  }

  const tabs: { id: Tab; label: string; icon: typeof Globe2 }[] = [
    { id: 'general', label: 'Général', icon: Globe2 },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'models', label: 'Modèles IA', icon: Brain },
    { id: 'search', label: 'Recherche', icon: Search },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'shortcuts', label: 'Raccourcis', icon: Keyboard },
    { id: 'subscription', label: 'Abonnement', icon: CreditCard },
    { id: 'about', label: 'À propos', icon: Info },
  ]

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-[var(--background-elevated)] rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden pointer-events-auto shadow-2xl flex flex-col md:flex-row border border-[var(--border)]">
              {/* Tabs sidebar */}
              <div className="md:w-52 shrink-0 p-2 md:border-r border-b md:border-b-0 border-[var(--border)] flex md:flex-col gap-0.5 overflow-x-auto md:overflow-x-visible bg-[var(--background-secondary)]">
                <div className="hidden md:flex items-center mb-2 px-3 pt-2">
                  <p className="text-sm font-bold text-[var(--foreground)]">Paramètres</p>
                </div>
                {tabs.map((t) => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors shrink-0',
                        tab === t.id
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'text-[var(--foreground-muted)] hover:bg-[var(--background-elevated)] hover:text-[var(--foreground)]'
                      )}
                    >
                      <Icon size={14} />
                      {t.label}
                    </button>
                  )
                })}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] z-10"
                >
                  <X size={16} />
                </button>

                <div className="p-6 md:p-8">
                  {tab === 'general' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-semibold mb-1">Général</h2>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-[var(--foreground-secondary)] mb-1.5 block">Langue</label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background-elevated)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="de">Deutsch</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-[var(--foreground-secondary)] mb-2 block">Thème</label>
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
                                  'px-3 py-2.5 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium transition-all',
                                  theme === t.id
                                    ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)]'
                                    : 'border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--border-strong)]'
                                )}
                              >
                                <Icon size={14} />
                                {t.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div className="border-t border-[var(--border)] pt-5">
                        <h3 className="text-sm font-semibold mb-3">Réponses</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--foreground-secondary)]">Ton de réponse</span>
                            <select
                              value={responseTone}
                              onChange={(e) => setResponseTone(e.target.value)}
                              className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background-elevated)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                            >
                              <option value="balanced">Équilibré</option>
                              <option value="concise">Concis</option>
                              <option value="friendly">Amical</option>
                              <option value="technical">Technique</option>
                            </select>
                          </div>
                          <ToggleRow label="Afficher les sources" value={showSources} onChange={setShowSources} />
                          <ToggleRow label="Recherche en temps réel" value={realtimeSearch} onChange={setRealtimeSearch} />
                          <ToggleRow label="Suggestions intelligentes" value={smartSuggestions} onChange={setSmartSuggestions} />
                        </div>
                      </div>

                      <div className="border-t border-[var(--border)] pt-5">
                        <h3 className="text-sm font-semibold mb-3">Données</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--foreground-secondary)]">Effacer l&apos;historique</span>
                            <button onClick={clearHistory} className="text-sm font-medium text-red-500 hover:text-red-600">Effacer</button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--foreground-secondary)]">Exporter mes données</span>
                            <button className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">Exporter</button>
                          </div>
                        </div>
                      </div>

                      {savedMessage && <p className="text-xs text-[var(--accent)]">{savedMessage}</p>}
                      <Button onClick={saveMemory} loading={saving} variant="glow" size="sm">Enregistrer</Button>
                    </div>
                  )}

                  {tab === 'appearance' && (
                    <div className="space-y-5">
                      <h2 className="text-lg font-semibold">Apparence</h2>
                      <div>
                        <label className="text-sm font-medium text-[var(--foreground-secondary)] mb-2.5 block">Thème</label>
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
                                  'p-4 rounded-xl border flex flex-col items-center gap-2 transition-all',
                                  theme === t.id
                                    ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)]'
                                    : 'border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--border-strong)]'
                                )}
                              >
                                <Icon size={20} />
                                <span className="text-xs font-medium">{t.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {tab === 'models' && (
                    <div className="space-y-5">
                      <h2 className="text-lg font-semibold">Modèles IA</h2>
                      <p className="text-sm text-[var(--foreground-muted)]">Choisissez le modèle par défaut pour vos conversations.</p>
                      <div className="space-y-2">
                        {[
                          { id: 'ntrl-1.3', name: 'Netral 1.3', desc: 'Le plus puissant — raisonnement avancé, web search', badge: 'Recommandé' },
                          { id: 'ntrl-1.2', name: 'Netral 1.2', desc: 'Rapide et polyvalent', badge: null },
                          { id: 'ntrl-1.0', name: 'Netral 1.0', desc: 'Ultra-rapide, réponses courtes', badge: null },
                        ].map((m) => (
                          <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors cursor-pointer">
                            <div className="w-9 h-9 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center">
                              <Brain size={16} className="text-[var(--accent)]" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{m.name}</p>
                                {m.badge && <span className="text-[9px] font-bold uppercase bg-[var(--accent-soft)] text-[var(--accent)] px-1.5 py-0.5 rounded">{m.badge}</span>}
                              </div>
                              <p className="text-xs text-[var(--foreground-muted)]">{m.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tab === 'search' && (
                    <div className="space-y-5">
                      <h2 className="text-lg font-semibold">Recherche</h2>
                      <p className="text-sm text-[var(--foreground-muted)]">Configurez le comportement de la recherche web.</p>
                      <div className="space-y-3">
                        <ToggleRow label="Recherche automatique quand pertinent" value={realtimeSearch} onChange={setRealtimeSearch} />
                        <ToggleRow label="Afficher les sources dans les réponses" value={showSources} onChange={setShowSources} />
                        <ToggleRow label="Suggestions de recherche" value={smartSuggestions} onChange={setSmartSuggestions} />
                      </div>
                    </div>
                  )}

                  {tab === 'privacy' && (
                    <div className="space-y-5">
                      <h2 className="text-lg font-semibold">Confidentialité</h2>
                      <p className="text-sm text-[var(--foreground-muted)]">Gérez vos données et votre vie privée.</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-sm font-medium">Mémoire</p>
                            <p className="text-xs text-[var(--foreground-muted)]">Netral se souvient de vos préférences</p>
                          </div>
                          <button onClick={clearMemory} className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1">
                            <Trash2 size={12} /> Effacer
                          </button>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-sm font-medium">Historique des conversations</p>
                            <p className="text-xs text-[var(--foreground-muted)]">Toutes vos conversations passées</p>
                          </div>
                          <button onClick={clearHistory} className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1">
                            <Trash2 size={12} /> Effacer
                          </button>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-sm font-medium">Exporter mes données</p>
                            <p className="text-xs text-[var(--foreground-muted)]">Télécharger toutes vos données</p>
                          </div>
                          <button className="text-sm font-medium text-[var(--accent)] flex items-center gap-1">
                            <Download size={12} /> Exporter
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {tab === 'notifications' && (
                    <div className="space-y-5">
                      <h2 className="text-lg font-semibold">Notifications</h2>
                      <p className="text-sm text-[var(--foreground-muted)]">Gérez vos préférences de notification.</p>
                      <div className="space-y-3">
                        <ToggleRow label="Notifications par email" value={false} onChange={() => {}} />
                        <ToggleRow label="Mises à jour produit" value={true} onChange={() => {}} />
                        <ToggleRow label="Conseils et astuces" value={true} onChange={() => {}} />
                      </div>
                    </div>
                  )}

                  {tab === 'shortcuts' && (
                    <div className="space-y-5">
                      <h2 className="text-lg font-semibold">Raccourcis clavier</h2>
                      <div className="space-y-2">
                        {[
                          { action: 'Nouveau chat', keys: 'Ctrl + N' },
                          { action: 'Rechercher', keys: 'Ctrl + K' },
                          { action: 'Envoyer message', keys: 'Enter' },
                          { action: 'Nouvelle ligne', keys: 'Shift + Enter' },
                          { action: 'Fermer sidebar', keys: 'Ctrl + B' },
                          { action: 'Paramètres', keys: 'Ctrl + ,' },
                        ].map((s) => (
                          <div key={s.action} className="flex items-center justify-between py-2">
                            <span className="text-sm text-[var(--foreground-secondary)]">{s.action}</span>
                            <kbd className="px-2 py-1 rounded bg-[var(--background-secondary)] border border-[var(--border)] text-xs font-mono text-[var(--foreground-muted)]">{s.keys}</kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tab === 'subscription' && (
                    <div className="space-y-5">
                      <h2 className="text-lg font-semibold">Abonnement</h2>
                      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center">
                            <CreditCard size={18} className="text-[var(--accent)]" />
                          </div>
                          <div>
                            <p className="font-semibold">Plan Free</p>
                            <p className="text-xs text-[var(--foreground-muted)]">Accès limité aux fonctionnalités</p>
                          </div>
                        </div>
                        <button className="w-full py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors">
                          Mettre à niveau — Pro
                        </button>
                      </div>
                      <p className="text-xs text-[var(--foreground-muted)]">Le plan Pro inclut : messages illimités, modèles avancés, recherche web prioritaire, et support dédié.</p>
                    </div>
                  )}

                  {tab === 'about' && (
                    <div className="space-y-5">
                      <h2 className="text-lg font-semibold">À propos</h2>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-1">
                          <span className="text-sm text-[var(--foreground-muted)]">Version</span>
                          <span className="text-sm font-medium">1.3.0</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-sm text-[var(--foreground-muted)]">Modèle actuel</span>
                          <span className="text-sm font-medium">Netral 1.3</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-sm text-[var(--foreground-muted)]">Compte</span>
                          <span className="text-sm font-medium">{user.email}</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-[var(--border)]">
                        <p className="text-xs text-[var(--foreground-muted)]">
                          Netral est un assistant IA qui recherche, analyse et comprend internet en temps réel.
                        </p>
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

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-[var(--foreground-secondary)]">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          'w-10 h-5.5 rounded-full relative transition-colors',
          value ? 'bg-[var(--accent)]' : 'bg-[var(--border-strong)]'
        )}
      >
        <div className={cn(
          'absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform',
          value ? 'translate-x-5' : 'translate-x-0.5'
        )} />
      </button>
    </div>
  )
}
