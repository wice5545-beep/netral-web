'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export default function TarifsPage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg-overlay)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <NetralLogo size={24} />
            <span className="font-semibold text-[15px]">Netral</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/register">
              <button className="h-8 px-3.5 text-[13px] font-medium rounded-[8px] bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-colors">{t.nav.start}</button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors mb-8">
          <ArrowLeft size={14} />
          {t.pricingPage.back}
        </Link>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="text-[36px] md:text-[48px] font-semibold tracking-[-0.025em] leading-[1.1] mb-4">
          {t.pricingPage.title1}<br /><span className="text-[var(--fg-muted)]">{t.pricingPage.title2}</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="text-[17px] text-[var(--fg-muted)] max-w-xl leading-relaxed">
          {t.pricingPage.subtitle}
        </motion.p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-4 gap-3">
          {[
            { name: 'Free', price: '0€', period: '/mois', desc: 'Pour découvrir.', cta: 'Commencer', features: ['1 message/jour', 'NTRL 1.0 uniquement', 'Pas de recherche web'], highlighted: false },
            { name: 'Plus', price: '5€', period: '/mois', desc: 'Pour un usage régulier.', cta: 'Passer à Plus', features: ['150 messages/mois', 'NTRL 1.0 & 1.3', 'Recherche web', 'Historique illimité'], highlighted: false },
            { name: 'Pro', price: '20€', period: '/mois', desc: 'Pour les professionnels.', cta: 'Passer à Pro', features: ['750 messages/mois', 'Tous les modèles', 'Upload images & fichiers', 'Recherche web avancée', 'Support prioritaire'], highlighted: true },
            { name: 'Pro+', price: '60€', period: '/mois', desc: 'Pour les power users.', cta: 'Passer à Pro+', features: ['2000 messages/mois', 'Tous les modèles', 'Agent IA', 'Accès anticipé mises à jour', 'Fonctionnalités en avant-première', 'Support dédié'], highlighted: false },
          ].map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`relative p-5 rounded-xl border transition-all duration-300 hover:shadow-[var(--shadow-md)] ${plan.highlighted ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]' : 'bg-[var(--bg-elevated)] border-[var(--border)] hover:border-[var(--border-strong)]'}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--bg)] text-[var(--fg)] text-[11px] font-medium border border-[var(--border)]">
                  <Sparkles size={11} />
                  {t.pricingPage.popular}
                </div>
              )}
              <h3 className="text-[16px] font-semibold mb-1">{plan.name}</h3>
              <p className={`text-[12px] mb-3 ${plan.highlighted ? 'opacity-80' : 'text-[var(--fg-muted)]'}`}>{plan.desc}</p>
              <div className="flex items-baseline gap-0.5 mb-5">
                <span className="text-[30px] font-bold tracking-tight">{plan.price}</span>
                <span className={`text-[12px] ${plan.highlighted ? 'opacity-70' : 'text-[var(--fg-muted)]'}`}>{plan.period}</span>
              </div>
              <Link href="/register" className="block mb-5">
                <button className={`w-full h-9 text-[13px] font-medium rounded-lg transition-all ${plan.highlighted ? 'bg-[var(--bg)] text-[var(--fg)] hover:opacity-90' : 'bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)]'}`}>{plan.cta}</button>
              </Link>
              <ul className="space-y-2">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <Check size={13} className={`mt-0.5 shrink-0 ${plan.highlighted ? 'opacity-80' : 'text-[var(--fg-subtle)]'}`} />
                    <span className={`text-[12px] leading-snug ${plan.highlighted ? 'opacity-90' : 'text-[var(--fg-muted)]'}`}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--border)] py-20">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-[24px] font-semibold tracking-[-0.02em] mb-8 text-center">{t.pricingPage.faqTitle}</h2>
          <div className="space-y-4">
            {t.pricingPage.faq.map((faq: { q: string; a: string }, i: number) => (
              <div key={i} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
                <h4 className="text-[14px] font-medium mb-1.5">{faq.q}</h4>
                <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
