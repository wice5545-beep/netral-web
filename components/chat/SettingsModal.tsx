'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap } from 'lucide-react'
import { UserIcon } from '@/components/ui/user'
import { BrainIcon } from '@/components/ui/brain'
import { ShieldCheckIcon } from '@/components/ui/shield-check'
import { SettingsIcon } from '@/components/ui/settings'
import { LanguagesIcon } from '@/components/ui/languages'
import { LockIcon } from '@/components/ui/lock'
import { useTheme } from '@/components/ui/ThemeProvider'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import {
  TabGeneral,
  TabAppearance,
  TabMemory,
  TabPrivacy,
  TabSecurity,
  TabShortcuts,
  TabAccount,
  TabSubscription,
  TabIntegrations,
  TabVSCode,
} from './settings'

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
  const [integrations, setIntegrations] = useState<{ service: string; updatedAt: string }[]>([])

  useEffect(() => {
    if (!open) return
    fetch('/api/memory').then(r => r.json()).then(d => {
      if (d.memory) {
        setMemory({ fullName: d.memory.fullName ?? '', profession: d.memory.profession ?? '', interests: d.memory.interests ?? '', customInstructions: d.memory.customInstructions ?? '' })
        setResponseTone(d.memory.tone ?? 'balanced')
      }
    }).catch(() => {})
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
    await fetch('/api/memory', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...memory, tone: responseTone }) })
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

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
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

  const renderTab = () => {
    switch (tab) {
      case 'general': return <TabGeneral locale={locale} setLocale={setLocale} responseTone={responseTone} setResponseTone={setResponseTone} saving={saving} savedMsg={savedMsg} onSave={saveMemory} />
      case 'appearance': return <TabAppearance theme={theme} setTheme={setTheme} />
      case 'memory': return <TabMemory memory={memory} setMemory={setMemory} saving={saving} savedMsg={savedMsg} onSave={saveMemory} onClear={clearMemory} />
      case 'privacy': return <TabPrivacy onClearHistory={clearHistory} onClearMemory={clearMemory} />
      case 'security': return <TabSecurity />
      case 'shortcuts': return <TabShortcuts />
      case 'account': return <TabAccount user={user} />
      case 'subscription': return <TabSubscription userPlan={userPlan} />
      case 'integrations': return <TabIntegrations integrations={integrations} onClose={onClose} />
      case 'vscode': return <TabVSCode />
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="glass-card w-full max-w-3xl max-h-[85vh] overflow-hidden pointer-events-auto shadow-colored flex flex-col md:flex-row" role="dialog" aria-modal="true" aria-label="Paramètres">
              {/* Sidebar tabs */}
              <div className="md:w-14 shrink-0 p-2 md:border-r border-b md:border-b-0 border-[var(--border)] flex md:flex-col items-center gap-1 overflow-x-auto md:overflow-x-visible bg-[var(--bg-soft)]">
                {tabs.map((t) => {
                  const Icon = t.icon
                  const isActive = tab === t.id
                  return (
                    <button key={t.id} onClick={() => setTab(t.id)} title={t.label} aria-label={t.label} className={cn('w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 shrink-0', isActive ? 'bg-[var(--bg-elevated)] text-[var(--fg)] border border-[var(--border)] shadow-[var(--shadow-xs)]' : 'text-[var(--fg-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--fg)]')}>
                      <Icon size={16} />
                    </button>
                  )
                })}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto relative">
                <button onClick={onClose} aria-label="Fermer les paramètres" className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-[var(--bg-soft)] text-[var(--fg-muted)] z-10 transition-colors">
                  <X size={15} />
                </button>
                <div className="p-6 md:p-8">{renderTab()}</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
