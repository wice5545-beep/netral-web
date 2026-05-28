'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, Sparkles, Zap, Plus } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { MarketingNav } from '@/components/landing/MarketingNav'
import { AuroraBackground } from '@/components/landing/AuroraBackground'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    badge: null,
    accent: false,
    description: 'Pour decouvrir Netral.',
    features: ['1 message/jour', 'NTRL 1.3 uniquement', 'Historique 7 jours'],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 5,
    badge: null,
    accent: false,
    description: 'Pour un usage quotidien.',
    features: ['150 messages/mois', 'NTRL 1.3 & 1.2', 'Recherche web', 'Historique illimite'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 20,
    badge: 'Populaire',
    accent: true,
    description: 'Pour les professionnels.',
    features: ['750 messages/mois', 'Tous les modeles', 'Upload images & fichiers', 'Recherche web avancee', 'Support prioritaire'],
  },
  {
    id: 'pro_plus',
    name: 'Pro+',
    price: 60,
    badge: 'Power',
    accent: false,
    description: 'Sans limite, acces anticipe.',
    features: ['2000 messages/mois', 'Tous les modeles', 'Agent IA autonome', 'Acces anticipe', 'Fonctionnalites preview', 'Support dedie'],
  },
]

export default function TarifsPage() {
  const { t } = useI18n()
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const [changing, setChanging] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [yearly, setYearly] = useState(false)

  useEffect(() => {
    fetch('/api/user/plan')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.plan) {
          setCurrentPlan(d.plan.plan)
          setIsLoggedIn(true)
        }
      })
      .catch(() => {})
  }, [])

  const handleChangePlan = async (planId: string) => {
    if (!isLoggedIn || currentPlan === planId) return
    setChanging(planId)
    try {
      const res = await fetch('/api/user/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      if (res.ok) setCurrentPlan(planId)
    } catch {}
    setChanging(null)
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] overflow-x-hidden noise-soft">
      <MarketingNav />

      {/* HERO */}
      <section className="relative max-w-4xl mx-auto px-6 pt-32 md:pt-40 pb-12 text-center">
        <AuroraBackground intensity="subtle" />

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          {t.pricingPage?.back ?? 'Retour'}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-[12px] text-[var(--fg-muted)] mb-6">
            <Sparkles size={11} className="text-violet-500" />
            Simple et transparent
          </div>
          <h1 className="text-[44px] md:text-[64px] font-bold tracking-[-0.045em] leading-[1.0] mb-5">
            {t.pricingPage?.title1 ?? 'Choisissez votre plan.'}
            <br />
            <span className="hero-gradient-text">{t.pricingPage?.title2 ?? 'Annulez quand vous voulez.'}</span>
          </h1>
          <p className="text-[17px] text-[var(--fg-muted)] max-w-md mx-auto leading-[1.55]">
            {t.pricingPage?.subtitle ?? 'Aucune carte bancaire requise pour commencer.'}
          </p>

          {/* Yearly toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] mt-8">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                'px-4 h-8 rounded-full text-[12.5px] font-medium transition-all',
                !yearly ? 'bg-[var(--bg-elevated)] text-[var(--fg)] shadow-sm' : 'text-[var(--fg-muted)]'
              )}
            >
              Mensuel
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                'px-4 h-8 rounded-full text-[12.5px] font-medium transition-all flex items-center gap-1.5',
                yearly ? 'bg-[var(--bg-elevated)] text-[var(--fg)] shadow-sm' : 'text-[var(--fg-muted)]'
              )}
            >
              Annuel
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold">
                -20%
              </span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* PRICING CARDS */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 pt-6">
          {PLANS.map((plan, i) => {
            const monthly = plan.price
            const yearlyPrice = Math.round(plan.price * 12 * 0.8)
            const displayedPrice = yearly && plan.price > 0 ? Math.round(yearlyPrice / 12) : monthly

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'relative flex flex-col rounded-2xl transition-all duration-300 hover:-translate-y-1',
                  plan.accent
                    ? 'border-transparent bg-[var(--bg-elevated)] glow-breathe'
                    : 'border border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]'
                )}
                style={
                  plan.accent
                    ? {
                        boxShadow:
                          '0 0 0 1.5px rgba(124,58,237,0.4), 0 12px 40px -8px rgba(124,58,237,0.18), 0 4px 16px rgba(249,115,22,0.08)',
                      }
                    : undefined
                }
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border shadow-sm',
                        plan.accent
                          ? 'bg-[var(--bg-elevated)] border-violet-500/40 text-violet-600 dark:text-violet-300'
                          : 'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--fg-muted)]'
                      )}
                    >
                      {plan.accent ? <Zap size={10} className="fill-violet-500 text-violet-500" /> : <Sparkles size={10} />}
                      {plan.badge}
                    </div>
                  </div>
                )}

                {plan.accent && <div className="beam-scan" style={{ ['--beam-delay' as string]: '0.5s' }} />}

                <div className="p-6 flex-1 flex flex-col relative">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[16px] font-bold tracking-[-0.01em]">{plan.name}</h3>
                    {currentPlan === plan.id && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                        Actif
                      </span>
                    )}
                  </div>
                  <p className="text-[12.5px] text-[var(--fg-muted)] mb-5">{plan.description}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={cn('text-[40px] font-bold tracking-[-0.035em]', plan.accent && 'hero-gradient-text')}>
                      {displayedPrice}€
                    </span>
                    <span className="text-[12px] text-[var(--fg-muted)]">/mois</span>
                  </div>
                  {yearly && plan.price > 0 && (
                    <p className="text-[10.5px] text-[var(--fg-subtle)] mb-4 -mt-0.5">
                      Facture {yearlyPrice}€/an
                    </p>
                  )}
                  {!yearly && <div className="mb-4" />}

                  {/* CTA */}
                  {isLoggedIn ? (
                    <button
                      onClick={() => handleChangePlan(plan.id)}
                      disabled={currentPlan === plan.id || changing === plan.id}
                      className={cn(
                        'w-full h-10 text-[13px] font-semibold rounded-xl transition-all active:scale-[0.97] mb-5',
                        currentPlan === plan.id
                          ? 'bg-[var(--bg-soft)] text-[var(--fg-muted)] border border-[var(--border)] cursor-default'
                          : plan.accent
                          ? 'bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-lg'
                          : 'bg-[var(--bg-soft)] border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]'
                      )}
                    >
                      {changing === plan.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Changement...
                        </span>
                      ) : currentPlan === plan.id ? (
                        'Plan actuel'
                      ) : plan.id === 'free' ? (
                        'Commencer'
                      ) : (
                        `Passer a ${plan.name}`
                      )}
                    </button>
                  ) : (
                    <Link href="/register" className="block mb-5">
                      <button
                        className={cn(
                          'w-full h-10 text-[13px] font-semibold rounded-xl transition-all active:scale-[0.97]',
                          plan.accent
                            ? 'bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-lg'
                            : 'bg-[var(--bg-soft)] border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]'
                        )}
                      >
                        {plan.id === 'free' ? 'Commencer gratuitement' : `Essayer ${plan.name}`}
                      </button>
                    </Link>
                  )}

                  <div className="border-t border-[var(--border)] mb-4" />

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 + j * 0.04 + 0.3 }}
                        className="flex items-start gap-2.5"
                      >
                        <div
                          className={cn(
                            'mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0',
                            plan.accent ? 'bg-violet-500/20' : 'bg-[var(--bg-soft)]'
                          )}
                        >
                          <Check
                            size={9}
                            className={plan.accent ? 'text-violet-500' : 'text-[var(--fg-muted)]'}
                            strokeWidth={3}
                          />
                        </div>
                        <span className="text-[12.5px] leading-snug text-[var(--fg-muted)]">{f}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12 text-[12px] text-[var(--fg-subtle)]"
        >
          {['Annulation a tout moment', 'Paiement securise · Stripe', 'Sans engagement', 'Support inclus'].map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <Check size={11} className="text-emerald-500" strokeWidth={3} />
              {s}
            </div>
          ))}
        </motion.div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[28px] md:text-[36px] font-bold tracking-[-0.03em] mb-8 text-center"
          >
            Comparaison detaillee
          </motion.h2>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
            <ComparisonRow header label="Fonctionnalite" cells={['Free', 'Plus', 'Pro', 'Pro+']} />
            <ComparisonRow label="Messages / mois" cells={['30', '150', '750', '2 000']} />
            <ComparisonRow label="NTRL 1.3" cells={['✓', '✓', '✓', '✓']} />
            <ComparisonRow label="NTRL 1.2 multimodal" cells={['—', '✓', '✓', '✓']} />
            <ComparisonRow label="NTRL 2.0 raisonnement" cells={['—', '—', '✓', '✓']} />
            <ComparisonRow label="Recherche web" cells={['—', '✓', '✓', '✓']} />
            <ComparisonRow label="Upload fichiers" cells={['—', '—', '✓', '✓']} />
            <ComparisonRow label="Agent VS Code" cells={['—', '—', '✓', '✓']} />
            <ComparisonRow label="Integrations Google" cells={['—', '—', '✓', '✓']} />
            <ComparisonRow label="Acces anticipe" cells={['—', '—', '—', '✓']} />
            <ComparisonRow label="Support" cells={['Communaute', 'Email', 'Prioritaire', 'Dedie']} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="max-w-2xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[28px] md:text-[36px] font-bold tracking-[-0.03em] mb-8 text-center"
          >
            {t.pricingPage?.faqTitle ?? 'Questions frequentes'}
          </motion.h2>
          <div className="space-y-2">
            {(t.pricingPage?.faq ?? []).map((faq: { q: string; a: string }, i: number) => (
              <FaqItem key={i} q={faq.q} a={faq.a} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-[12.5px] text-[var(--fg-muted)]">
          © {new Date().getFullYear()} Netral · Made with ♥ in Paris
        </div>
      </footer>
    </div>
  )
}

function ComparisonRow({
  label, cells, header,
}: {
  label: string; cells: string[]; header?: boolean
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-5 gap-2 items-center px-5 py-3.5 border-b border-[var(--border)] last:border-0',
        header ? 'bg-[var(--bg-soft)] text-[12px] uppercase tracking-wider font-semibold text-[var(--fg-muted)]' : 'text-[13.5px]'
      )}
    >
      <div className={header ? '' : 'font-medium'}>{label}</div>
      {cells.map((c, i) => (
        <div
          key={i}
          className={cn(
            'text-center',
            header ? '' : c === '—' ? 'text-[var(--fg-subtle)]' : c === '✓' ? 'text-emerald-500 font-bold' : 'text-[var(--fg-muted)]'
          )}
        >
          {c}
        </div>
      ))}
    </div>
  )
}

function FaqItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden hover:border-[var(--border-strong)] transition-colors"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-[14.5px] font-semibold tracking-[-0.005em]">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[var(--fg-muted)] shrink-0"
        >
          <Plus size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-[13.5px] text-[var(--fg-muted)] leading-[1.6]">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
