'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { completeOnboarding } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const tones = [
  { id: 'balanced', label: 'Équilibré', desc: 'Clair et naturel' },
  { id: 'concise', label: 'Concis', desc: 'Court et direct' },
  { id: 'friendly', label: 'Amical', desc: 'Chaleureux' },
  { id: 'technical', label: 'Technique', desc: 'Précis et expert' },
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
    { title: 'Bienvenue', subtitle: 'Apprenons à nous connaître. Ces informations restent privées.' },
    { title: 'Votre métier', subtitle: 'Une ligne sur ce que vous faites m\'aide à mieux répondre.' },
    { title: 'Vos centres d\'intérêt', subtitle: 'Quelques sujets, outils ou curiosités.' },
    { title: 'Mon ton', subtitle: 'Choisissez un style. Modifiable à tout moment.' },
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

  const canNext = step === 0 ? fullName.trim().length >= 2 : true

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-10">
          <NetralLogo size={28} />
          <span className="font-semibold text-[16px]">Netral</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors duration-300',
                i <= step ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
              )}
            />
          ))}
        </div>

        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-6 shadow-[var(--shadow-sm)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-[20px] font-semibold tracking-[-0.01em] mb-1">{steps[step].title}</h2>
              <p className="text-[13px] text-[var(--fg-muted)] mb-5">{steps[step].subtitle}</p>

              {step === 0 && (
                <Input
                  placeholder="Prénom"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoFocus
                  maxLength={100}
                />
              )}

              {step === 1 && (
                <Input
                  placeholder="ex. Designer, étudiant…"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  autoFocus
                  maxLength={200}
                />
              )}

              {step === 2 && (
                <Input
                  placeholder="ex. design, philosophie, code…"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  autoFocus
                  maxLength={300}
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
                          'p-3 rounded-md border text-left transition-all',
                          active
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                            : 'border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-soft)]'
                        )}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="font-medium text-[13px]">{t.label}</p>
                          {active && <Check size={12} />}
                        </div>
                        <p className="text-[11px] text-[var(--fg-muted)]">{t.desc}</p>
                      </button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 mt-6">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={13} />
                Retour
              </Button>
            )}
            <div className="flex-1" />
            {step < steps.length - 1 ? (
              <Button variant="primary" onClick={() => setStep(step + 1)} disabled={!canNext}>
                Continuer
                <ArrowRight size={13} />
              </Button>
            ) : (
              <Button variant="primary" onClick={handleFinish} loading={loading}>
                Commencer
                <ArrowRight size={13} />
              </Button>
            )}
          </div>
        </div>

        {step !== steps.length - 1 && (
          <button
            onClick={handleFinish}
            className="block mx-auto mt-5 text-[12px] text-[var(--fg-subtle)] hover:text-[var(--fg-muted)] transition-colors"
          >
            Passer cette étape
          </button>
        )}
      </div>
    </div>
  )
}
