'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { completeOnboarding } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const tones = [
  { id: 'balanced', label: 'Balanced', desc: 'Clear and natural.' },
  { id: 'concise', label: 'Concise', desc: 'Short and direct.' },
  { id: 'friendly', label: 'Friendly', desc: 'Warm and casual.' },
  { id: 'technical', label: 'Technical', desc: 'Precise and expert.' },
]

interface OnboardingWizardProps {
  userId: string
  defaultName?: string
}

export function OnboardingWizard({ userId, defaultName }: OnboardingWizardProps) {
  const [step, setStep] = useState(0)
  const [fullName, setFullName] = useState(defaultName ?? '')
  const [profession, setProfession] = useState('')
  const [interests, setInterests] = useState('')
  const [tone, setTone] = useState('balanced')
  const [loading, setLoading] = useState(false)

  const steps = [
    {
      title: 'Welcome to Netral',
      subtitle: 'Let me get to know you. This stays between us.',
    },
    {
      title: 'What do you do?',
      subtitle: 'A line about your work helps me give better answers.',
    },
    {
      title: 'What interests you?',
      subtitle: 'A few topics, tools, or curiosities.',
    },
    {
      title: 'How should I sound?',
      subtitle: 'Pick a tone. You can change this anytime.',
    },
  ]

  const handleFinish = async () => {
    setLoading(true)
    await completeOnboarding({
      userId,
      fullName: fullName.trim() || undefined,
      profession: profession.trim() || undefined,
      interests: interests.trim() || undefined,
      tone,
    })
  }

  const canNext = () => {
    if (step === 0) return fullName.trim().length >= 2
    return true
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <AmbientBackground />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <NetralLogo size={32} animated />
          <span className="font-semibold tracking-tight text-xl">Netral</span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-1.5 mb-8 px-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 rounded-full transition-all duration-500 flex-1',
                i <= step
                  ? 'bg-gradient-to-r from-[var(--gradient-1)] to-[var(--gradient-2)]'
                  : 'bg-[var(--border)]'
              )}
            />
          ))}
        </div>

        <div className="glass-strong rounded-3xl p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-semibold mb-1">{steps[step].title}</h2>
              <p className="text-sm text-[var(--foreground-muted)] mb-6">{steps[step].subtitle}</p>

              {step === 0 && (
                <Input
                  label="Your name"
                  placeholder="e.g. Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoFocus
                />
              )}

              {step === 1 && (
                <Input
                  label="What you do"
                  placeholder="e.g. Software engineer, student, founder…"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  autoFocus
                />
              )}

              {step === 2 && (
                <Input
                  label="Topics you love"
                  placeholder="e.g. AI, design, philosophy, music…"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  autoFocus
                />
              )}

              {step === 3 && (
                <div className="grid grid-cols-2 gap-2">
                  {tones.map((t) => {
                    const active = tone === t.id
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className={cn(
                          'p-4 rounded-xl border text-left transition-all duration-200',
                          active
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-[0_0_30px_var(--accent-glow)]'
                            : 'border-[var(--border-strong)] hover:border-[var(--foreground-muted)]'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{t.label}</p>
                          {active && <Check size={14} className="text-[var(--accent)]" />}
                        </div>
                        <p className="text-xs text-[var(--foreground-muted)]">{t.desc}</p>
                      </button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 mt-7">
            {step > 0 && (
              <Button variant="ghost" onClick={() => setStep(step - 1)} className="gap-1.5">
                <ArrowLeft size={14} />
                Back
              </Button>
            )}
            <div className="flex-1" />
            {step < steps.length - 1 ? (
              <Button
                variant="glow"
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="gap-1.5"
              >
                Continue
                <ArrowRight size={14} />
              </Button>
            ) : (
              <Button variant="glow" onClick={handleFinish} loading={loading} className="gap-1.5">
                Start chatting
                <ArrowRight size={14} />
              </Button>
            )}
          </div>
        </div>

        {step !== steps.length - 1 && (
          <button
            onClick={handleFinish}
            className="block mx-auto mt-4 text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  )
}
