'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Sparkles, Zap } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    badge: null,
    accent: false,
    features: ['1 message/jour', 'NTRL 1.0 uniquement', 'Historique 7 jours'],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '5',
    badge: null,
    accent: false,
    features: ['150 messages/mois', 'NTRL 1.0 & 1.3', 'Recherche web', 'Historique illimité'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '20',
    badge: 'Populaire',
    accent: true,
    features: ['750 messages/mois', 'Tous les modèles', 'Upload images & fichiers', 'Recherche web avancée', 'Support prioritaire'],
  },
  {
    id: 'pro_plus',
    name: 'Pro+',
    price: '60',
    badge: 'Power',
    accent: false,
    features: ['2000 messages/mois', 'Tous les modèles', 'Agent IA autonome', 'Accès anticipé', 'Fonctionnalités preview', 'Support dédié'],
  },
]

export default function TarifsPage() {
  const { t, locale } = useI18n()
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const [changing, setChanging] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    fetch('/api/user/plan').then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.plan) { setCurrentPlan(d.plan.plan); setIsLoggedIn(true) } })
      .catch(() => {})
  }, [])

  const handleChangePlan = async (planId: string) => {
    if (!isLoggedIn || planId === currentPlan) return
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 nav-pill px-2 py-1.5">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2 px-3 py-1.5">
            <NetralLogo size={20} />
            <span className="font-semibold text-[14px]">Netral</span>
          </Link>
          <div className="flex items-center gap-1.5 ml-2">
            <LanguageSwitcher />
            <Link href="/register">
              <button className="h-8 px-3.5 text-[13px] font-medium rounded-full bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-colors">{t.nav.start}</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-28 pb-12 text-center">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors mb-10">
          <ArrowLeft size={14} />
          {t.pricingPage.back}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-[12px] text-[var(--fg-muted)] mb-6">
            <Sparkles size={11} />
            Simple et transparent
          </div>
          <h1 className="text-[38px] md:text-[52px] font-bold tracking-[-0.04em] leading-[1.05] mb-4">
            {t.pricingPage.title1}<br />
            <span className="gradient-text">{t.pricingPage.title2}</span>
          </h1>
          <p className="text-[17px] text-[var(--fg-muted)] max-w-md mx-auto leading-relaxed">
            {t.pricingPage.subtitle}
          </p>
        </motion.div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <div className="grid md:grid-cols-4 gap-4">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                plan.accent
                  ? 'border-transparent shadow-colored bg-[var(--bg-elevated)]'
                  : 'border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]'
              }`}
              style={plan.accent ? {
                background: 'var(--bg-elevated)',
                boxShadow: '0 0 0 1.5px rgba(124,58,237,0.4), 0 8px 32px rgba(124,58,237,0.12)',
              } : undefined}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border shadow-sm ${
                    plan.accent
                      ? 'bg-[var(--bg-elevated)] border-violet-500/30 text-violet-500'
                      : 'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--fg-muted)]'
                  }`}>
                    {plan.accent ? <Zap size={10} className="fill-violet-500" /> : <Sparkles size={10} />}
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                {/* Plan name */}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[15px] font-bold tracking-[-0.01em]">{plan.name}</h3>
                  {currentPlan === plan.id && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Actif
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mt-3 mb-5">
                  <span className={`text-[38px] font-bold tracking-[-0.03em] ${plan.accent ? 'gradient-text' : ''}`}>
                    {plan.price}€
                  </span>
                  <span className="text-[12px] text-[var(--fg-muted)]">/mois</span>
                </div>

                {/* CTA */}
                {isLoggedIn ? (
                  <button
                    onClick={() => handleChangePlan(plan.id)}
                    disabled={currentPlan === plan.id || changing === plan.id}
                    className={`w-full h-9 text-[13px] font-semibold rounded-xl transition-all active:scale-[0.97] mb-5 ${
                      currentPlan === plan.id
                        ? 'bg-[var(--bg-soft)] text-[var(--fg-muted)] border border-[var(--border)] cursor-default'
                        : plan.accent
                        ? 'bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md'
                        : 'bg-[var(--bg-soft)] border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    {changing === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/><path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Changement...
                      </span>
                    ) : currentPlan === plan.id ? 'Plan actuel' : plan.id === 'free' ? 'Commencer' : `Passer à ${plan.name}`}
                  </button>
                ) : (
                  <Link href="/register" className="block mb-5">
                    <button className={`w-full h-9 text-[13px] font-semibold rounded-xl transition-all active:scale-[0.97] ${
                      plan.accent
                        ? 'bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md'
                        : 'bg-[var(--bg-soft)] border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]'
                    }`}>
                      {plan.id === 'free' ? 'Commencer gratuitement' : `Essayer ${plan.name}`}
                    </button>
                  </Link>
                )}

                {/* Divider */}
                <div className="border-t border-[var(--border)] mb-4" />

                {/* Features */}
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.09 + j * 0.04 + 0.3 }}
                      className="flex items-start gap-2.5"
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        plan.accent ? 'bg-violet-500/15' : 'bg-[var(--bg-soft)]'
                      }`}>
                        <Check size={9} className={plan.accent ? 'text-violet-500' : 'text-[var(--fg-muted)]'} strokeWidth={3} />
                      </div>
                      <span className="text-[12.5px] leading-snug text-[var(--fg-muted)]">{f}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-10 text-[12px] text-[var(--fg-subtle)]"
        >
          {['Annulation à tout moment', 'Paiement sécurisé', 'Sans engagement', 'Support inclus'].map(s => (
            <div key={s} className="flex items-center gap-1.5">
              <Check size={11} className="text-emerald-500" strokeWidth={3} />
              {s}
            </div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="max-w-2xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[24px] font-bold tracking-[-0.02em] mb-8 text-center"
          >
            {t.pricingPage.faqTitle}
          </motion.h2>
          <div className="space-y-3">
            {t.pricingPage.faq.map((faq: { q: string; a: string }, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/50 hover:border-[var(--border-strong)] transition-colors"
              >
                <h4 className="text-[14px] font-semibold mb-1.5">{faq.q}</h4>
                <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
