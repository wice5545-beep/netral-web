'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { completeOnboarding } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Briefcase, Code2, Palette, BarChart3, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const profiles = [
  { id: 'developer', label: 'Developer', icon: Code2, desc: 'Build and ship products' },
  { id: 'designer', label: 'Designer', icon: Palette, desc: 'Create beautiful experiences' },
  { id: 'manager', label: 'Manager', icon: Briefcase, desc: 'Lead teams and projects' },
  { id: 'analyst', label: 'Analyst', icon: BarChart3, desc: 'Data and insights' },
]

const preferences = [
  { id: 'realtime', label: 'Real-time collaboration' },
  { id: 'analytics', label: 'Analytics & reporting' },
  { id: 'api', label: 'API integrations' },
  { id: 'automation', label: 'Workflow automation' },
  { id: 'security', label: 'Advanced security' },
  { id: 'mobile', label: 'Mobile access' },
]

interface OnboardingWizardProps {
  userId: string
}

export function OnboardingWizard({ userId }: OnboardingWizardProps) {
  const [step, setStep] = useState(0)
  const [selectedProfile, setSelectedProfile] = useState<string>()
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const steps = [
    { title: 'Who are you?', subtitle: 'Help us personalize your experience.' },
    { title: 'What matters to you?', subtitle: 'Select all that apply.' },
    { title: "You're all set!", subtitle: 'Your workspace is ready.' },
  ]

  const togglePref = (id: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleFinish = async () => {
    setLoading(true)
    await completeOnboarding(userId)
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500',
                i <= step ? 'bg-[var(--accent)]' : 'bg-[var(--border)]',
                i === step ? 'flex-[3]' : 'flex-1'
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">{steps[step].title}</h1>
            <p className="text-[var(--foreground-muted)] mb-8">{steps[step].subtitle}</p>

            {step === 0 && (
              <div className="grid grid-cols-2 gap-4">
                {profiles.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedProfile(id)}
                    className={cn(
                      'p-5 rounded-2xl border text-left transition-all duration-200',
                      selectedProfile === id
                        ? 'border-[var(--accent)] bg-[var(--accent-light)] shadow-lg shadow-[var(--accent)]/10'
                        : 'border-[var(--border)] hover:border-[var(--accent)] bg-[var(--card)]'
                    )}
                  >
                    <Icon size={24} className={selectedProfile === id ? 'text-[var(--accent)]' : 'text-[var(--foreground-muted)]'} />
                    <p className="font-semibold text-[var(--foreground)] mt-3 mb-1">{label}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{desc}</p>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {preferences.map(({ id, label }) => {
                  const selected = selectedPrefs.includes(id)
                  return (
                    <button
                      key={id}
                      onClick={() => togglePref(id)}
                      className={cn(
                        'p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-200',
                        selected
                          ? 'border-[var(--accent)] bg-[var(--accent-light)]'
                          : 'border-[var(--border)] hover:border-[var(--foreground-muted)] bg-[var(--card)]'
                      )}
                    >
                      <span className={cn('text-sm font-medium', selected ? 'text-[var(--accent)]' : 'text-[var(--foreground)]')}>
                        {label}
                      </span>
                      {selected && <Check size={16} className="text-[var(--accent)] shrink-0" />}
                    </button>
                  )
                })}
              </div>
            )}

            {step === 2 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[var(--accent)]/30">
                  <Check size={28} className="text-white" />
                </div>
                <p className="text-[var(--foreground-muted)] mb-2">Your workspace is configured and ready.</p>
                <p className="text-[var(--foreground-muted)] text-sm">You can customize everything later in Settings.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-10">
          {step > 0 && step < 2 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
          ) : (
            <div />
          )}
          {step < 2 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !selectedProfile}
              className="gap-2"
            >
              Continue
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleFinish} loading={loading} className="gap-2">
              Go to Dashboard
              <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
