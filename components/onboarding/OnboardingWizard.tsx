'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { completeOnboarding } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const tones = [
  { id: 'balanced', label: 'Équilibré', desc: 'Clair et naturel', emoji: '⚖️' },
  { id: 'concise', label: 'Concis', desc: 'Court et direct', emoji: '⚡' },
  { id: 'friendly', label: 'Amical', desc: 'Chaleureux', emoji: '🤝' },
  { id: 'technical', label: 'Technique', desc: 'Précis et expert', emoji: '🔬' },
]

interface OnboardingWizardProps {
  userId: string
  defaultName?: string
}

export function OnboardingWizard({ userId, defaultName }: OnboardingWizardProps) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [fullName, setFullName] = useState(defaultName ?? '')
  const [profession, setProfession] = useState('')
  const [interests, setInterests] = useState('')
  const [tone, setTone] = useState('balanced')
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)

  const steps = [
    { title: 'Bienvenue sur Netral', subtitle: 'Personnalisons votre expérience en quelques secondes.' },
    { title: 'Que faites-vous ?', subtitle: 'Ça m\'aide à adapter mes réponses à votre domaine.' },
    { title: 'Vos passions', subtitle: 'Sujets, outils, curiosités — tout est bon.' },
    { title: 'Mon style', subtitle: 'Comment voulez-vous que je vous parle ?' },
  ]

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, steps.length - 1)) }
  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)) }

  const handleFinish = async () => {
    setLoading(true)
    setComplete(true)
    await new Promise(r => setTimeout(r, 800))
    await completeOnboarding({ userId, fullName: fullName.trim() || undefined, profession: profession.trim() || undefined, interests: interests.trim() || undefined, tone })
  }

  const canNext = step === 0 ? fullName.trim().length >= 2 : true

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0, scale: 0.95 }),
  }

  if (complete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] gradient-orb rounded-full" />
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 10 }}
            className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }}
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
              <Sparkles size={36} className="text-white" />
            </motion.div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-[28px] font-bold mb-2">
            C'est parti, {fullName || 'vous'} !
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-[var(--fg-muted)]">
            Netral est prêt. Redirection...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] gradient-orb rounded-full -z-10" />
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] -z-10" style={{ backgroundImage: 'radial-gradient(var(--fg) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 12, delay: 0.1 }} className="flex items-center justify-center gap-2 mb-10">
          <NetralLogo size={28} />
          <span className="font-bold text-[16px]">Netral</span>
        </motion.div>

        {/* Progress — animated bar */}
        <div className="relative h-1 rounded-full bg-[var(--border)] mb-8 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #f97316)' }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          />
        </div>

        {/* Step counter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-4 px-1">
          <span className="text-[11px] text-[var(--fg-subtle)] font-mono">{step + 1}/{steps.length}</span>
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                animate={{
                  scale: i === step ? 1.3 : 1,
                  backgroundColor: i <= step ? '#7c3aed' : 'var(--border)',
                }}
                transition={{ type: 'spring', damping: 15 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Card */}
        <div className="glass-card p-7 shadow-colored min-h-[320px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1"
            >
              <h2 className="text-[22px] font-bold tracking-[-0.02em] mb-1">{steps[step].title}</h2>
              <p className="text-[13px] text-[var(--fg-muted)] mb-7">{steps[step].subtitle}</p>

              {step === 0 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                  <label className="text-[12px] font-medium text-[var(--fg-muted)] mb-2 block">Comment vous appelez-vous ?</label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Prénom"
                    autoFocus
                    maxLength={100}
                    className="w-full h-12 px-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[16px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-[var(--border-strong)] focus:shadow-[0_0_0_3px_var(--accent-soft)] transition-all"
                  />
                </motion.div>
              )}

              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                  <input
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="ex. Designer, développeur, étudiant..."
                    autoFocus
                    maxLength={200}
                    className="w-full h-12 px-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[16px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-[var(--border-strong)] focus:shadow-[0_0_0_3px_var(--accent-soft)] transition-all"
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                  <input
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="ex. IA, design, musique, crypto..."
                    autoFocus
                    maxLength={300}
                    className="w-full h-12 px-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[16px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-[var(--border-strong)] focus:shadow-[0_0_0_3px_var(--accent-soft)] transition-all"
                  />
                </motion.div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-2 gap-3">
                  {tones.map((t, i) => {
                    const active = tone === t.id
                    return (
                      <motion.button
                        key={t.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.07 }}
                        onClick={() => setTone(t.id)}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'p-4 rounded-xl border text-left transition-all duration-200 relative overflow-hidden',
                          active
                            ? 'border-transparent shadow-colored'
                            : 'border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-soft)]'
                        )}
                      >
                        {active && <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }} />}
                        {active && <motion.div layoutId="tone-border" className="absolute inset-0 rounded-xl border-2" style={{ borderColor: '#7c3aed' }} transition={{ type: 'spring', damping: 20 }} />}
                        <div className="relative">
                          <span className="text-[18px] mb-2 block">{t.emoji}</span>
                          <p className="font-semibold text-[13px] mb-0.5">{t.label}</p>
                          <p className="text-[11px] text-[var(--fg-muted)]">{t.desc}</p>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[var(--border)]">
            {step > 0 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <Button variant="ghost" size="sm" onClick={goBack}>
                  <ArrowLeft size={13} />
                  Retour
                </Button>
              </motion.div>
            )}
            <div className="flex-1" />
            {step < steps.length - 1 ? (
              <Button variant="primary" onClick={goNext} disabled={!canNext}>
                Continuer
                <ArrowRight size={13} />
              </Button>
            ) : (
              <Button variant="primary" onClick={handleFinish} loading={loading}>
                <Sparkles size={13} />
                Commencer
              </Button>
            )}
          </div>
        </div>

        {step !== steps.length - 1 && (
          <motion.button
            onClick={handleFinish}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="block mx-auto mt-5 text-[12px] text-[var(--fg-subtle)] hover:text-[var(--fg-muted)] transition-colors"
          >
            Passer →
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}
