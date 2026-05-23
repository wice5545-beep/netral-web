'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { completeOnboarding } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { ArrowUpRight, ArrowLeft, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const tones = [
  { id: 'balanced', label: 'Équilibré', desc: 'Clair et naturel' },
  { id: 'concise', label: 'Concis', desc: 'Court et direct' },
  { id: 'friendly', label: 'Amical', desc: 'Chaleureux et décontracté' },
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
    {
      num: 'I',
      title: 'Bienvenue',
      subtitle: 'Apprenons à nous connaître. Ces informations restent privées.',
    },
    {
      num: 'II',
      title: 'Votre métier',
      subtitle: 'Une ligne sur ce que vous faites m\'aide à mieux répondre.',
    },
    {
      num: 'III',
      title: 'Vos centres d\'intérêt',
      subtitle: 'Quelques sujets, outils ou curiosités.',
    },
    {
      num: 'IV',
      title: 'Mon ton',
      subtitle: 'Choisissez un style. Modifiable à tout moment.',
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

  const current = steps[step]

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative bg-[var(--bg)]">
      <div className="grain-paper" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-12">
          <NetralLogo size={28} />
          <span className="font-display text-[20px] tracking-tight">Netral</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-10">
          <span className="label-num">№ {String(step + 1).padStart(2, '0')}</span>
          <div className="rule flex-1" />
          <span className="label-num">{String(steps.length).padStart(2, '0')}</span>
        </div>

        {/* Card */}
        <div className="card-float p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16, filter: 'blur(2px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0)' }}
              exit={{ opacity: 0, x: -16, filter: 'blur(2px)' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[10px] text-[var(--jewel)] tracking-wider">{current.num}</span>
                <span className="rule flex-1 max-w-[24px]" />
              </div>
              <h2 className="font-display text-3xl tracking-tight mb-2">{current.title}</h2>
              <p className="text-[14px] text-[var(--fg-muted)] mb-6">{current.subtitle}</p>

              {step === 0 && (
                <Input
                  placeholder="Prénom (ex. Alex)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoFocus
                />
              )}

              {step === 1 && (
                <Input
                  placeholder="ex. Designer, étudiant, fondateur…"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  autoFocus
                />
              )}

              {step === 2 && (
                <Input
                  placeholder="ex. IA, design, philosophie, musique…"
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
                          'p-4 rounded-md border text-left transition-all duration-200',
                          active
                            ? 'border-[var(--jewel)] bg-[var(--jewel-soft)]'
                            : 'border-[var(--rule)] hover:border-[var(--rule-strong)] hover:bg-[var(--bg-soft)]'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-[13px]">{t.label}</p>
                          {active && <Check size={12} className="text-[var(--jewel)]" />}
                        </div>
                        <p className="text-[11px] text-[var(--fg-muted)]">{t.desc}</p>
                      </button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="rule my-6" />

          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={13} />
                Retour
              </Button>
            )}
            <div className="flex-1" />
            {step < steps.length - 1 ? (
              <Button
                variant="ink"
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
              >
                Continuer
                <ArrowUpRight size={13} />
              </Button>
            ) : (
              <Button variant="jewel" onClick={handleFinish} loading={loading}>
                Commencer
                <ArrowUpRight size={13} />
              </Button>
            )}
          </div>
        </div>

        {step !== steps.length - 1 && (
          <button
            onClick={handleFinish}
            className="block mx-auto mt-6 text-[12px] text-[var(--fg-subtle)] hover:text-[var(--fg-muted)] transition-colors"
          >
            Passer cette étape
          </button>
        )}
      </div>
    </div>
  )
}
