'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Brain, Palette, Trash2, Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTheme } from '@/components/ui/ThemeProvider'
import { cn } from '@/lib/utils'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  user: { id: string; name?: string | null; email: string }
}

type Tab = 'profile' | 'memory' | 'appearance'

interface MemoryData {
  fullName: string
  profession: string
  interests: string
  tone: string
  customInstructions: string
}

const tones = [
  { id: 'balanced', label: 'Balanced' },
  { id: 'concise', label: 'Concise' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'technical', label: 'Technical' },
  { id: 'creative', label: 'Creative' },
]

export function SettingsModal({ open, onClose, user }: SettingsModalProps) {
  const [tab, setTab] = useState<Tab>('profile')
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
        }
      })
      .catch(() => {})
  }, [open])

  const saveMemory = async () => {
    setSaving(true)
    await fetch('/api/memory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memory),
    })
    setSaving(false)
    setSavedMessage('Saved')
    setTimeout(() => setSavedMessage(''), 2000)
  }

  const clearMemory = async () => {
    if (!confirm('Delete all memory? This cannot be undone.')) return
    await fetch('/api/memory', { method: 'DELETE' })
    setMemory({ fullName: '', profession: '', interests: '', tone: 'balanced', customInstructions: '' })
    setSavedMessage('Memory cleared')
    setTimeout(() => setSavedMessage(''), 2000)
  }

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'memory', label: 'Memory', icon: Brain },
    { id: 'appearance', label: 'Appearance', icon: Palette },
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-strong rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden pointer-events-auto shadow-2xl flex flex-col md:flex-row">
              {/* Tabs sidebar */}
              <div className="md:w-52 shrink-0 p-3 md:border-r border-b md:border-b-0 border-[var(--border)] flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
                <div className="hidden md:flex items-center justify-between mb-2 px-2">
                  <p className="text-sm font-semibold">Settings</p>
                </div>
                {tabs.map((t) => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors shrink-0',
                        tab === t.id
                          ? 'bg-[var(--border)] text-[var(--foreground)]'
                          : 'text-[var(--foreground-muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]'
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
                  className="absolute top-3 right-3 p-2 rounded-lg hover:bg-[var(--border)] text-[var(--foreground-muted)] z-10"
                >
                  <X size={16} />
                </button>

                <div className="p-6 md:p-8">
                  {tab === 'profile' && (
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-lg font-semibold mb-1">Profile</h2>
                        <p className="text-sm text-[var(--foreground-muted)]">Your account information.</p>
                      </div>
                      <Input label="Email" value={user.email} disabled />
                      <div className="text-xs text-[var(--foreground-subtle)]">
                        Your email cannot be changed.
                      </div>
                    </div>
                  )}

                  {tab === 'memory' && (
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-lg font-semibold mb-1">Memory</h2>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          Netral remembers this context across all conversations.
                        </p>
                      </div>

                      <Input
                        label="Your name"
                        value={memory.fullName}
                        onChange={(e) => setMemory({ ...memory, fullName: e.target.value })}
                        placeholder="e.g. Alex Rivera"
                      />
                      <Input
                        label="What you do"
                        value={memory.profession}
                        onChange={(e) => setMemory({ ...memory, profession: e.target.value })}
                        placeholder="e.g. Software engineer"
                      />
                      <Input
                        label="Your interests"
                        value={memory.interests}
                        onChange={(e) => setMemory({ ...memory, interests: e.target.value })}
                        placeholder="e.g. AI, design, philosophy…"
                      />

                      <div>
                        <label className="text-sm font-medium text-[var(--foreground-secondary)] mb-1.5 block">
                          Tone
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {tones.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setMemory({ ...memory, tone: t.id })}
                              className={cn(
                                'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
                                memory.tone === t.id
                                  ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)]'
                                  : 'border-[var(--border-strong)] text-[var(--foreground-muted)] hover:border-[var(--foreground-muted)]'
                              )}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-[var(--foreground-secondary)] mb-1.5 block">
                          Custom instructions
                        </label>
                        <textarea
                          value={memory.customInstructions}
                          onChange={(e) => setMemory({ ...memory, customInstructions: e.target.value })}
                          placeholder="Anything else Netral should know about how to respond…"
                          rows={4}
                          className="w-full px-3 py-2 rounded-xl bg-[var(--background-elevated)] border border-[var(--border-strong)] text-sm placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button onClick={saveMemory} loading={saving} variant="glow" size="sm">
                          Save memory
                        </Button>
                        <Button onClick={clearMemory} variant="ghost" size="sm" className="text-red-500 gap-1.5">
                          <Trash2 size={12} />
                          Clear all
                        </Button>
                        {savedMessage && (
                          <p className="text-xs text-[var(--accent)] ml-auto">{savedMessage}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {tab === 'appearance' && (
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-lg font-semibold mb-1">Appearance</h2>
                        <p className="text-sm text-[var(--foreground-muted)]">Customize how Netral looks.</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-[var(--foreground-secondary)] mb-2 block">
                          Theme
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'light', label: 'Light', icon: Sun },
                            { id: 'dark', label: 'Dark', icon: Moon },
                            { id: 'system', label: 'System', icon: Monitor },
                          ].map((t) => {
                            const Icon = t.icon
                            return (
                              <button
                                key={t.id}
                                onClick={() => setTheme(t.id as 'light' | 'dark' | 'system')}
                                className={cn(
                                  'p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all',
                                  theme === t.id
                                    ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)]'
                                    : 'border-[var(--border-strong)] text-[var(--foreground-muted)] hover:border-[var(--foreground-muted)]'
                                )}
                              >
                                <Icon size={16} />
                                <span className="text-xs font-medium">{t.label}</span>
                              </button>
                            )
                          })}
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
