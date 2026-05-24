'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export default function TarifsPage() {
  const { t, locale } = useI18n()
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const [changing, setChanging] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    fetch('/api/user/plan').then(r => {
      if (r.ok) return r.json()
      return null
    }).then(d => {
      if (d?.plan) { setCurrentPlan(d.plan.plan); setIsLoggedIn(true) }
    }).catch(() => {})
  }, [])

  const handleChangePlan = async (planId: string) => {
    if (!isLoggedIn) return
    if (planId === currentPlan) return
    setChanging(planId)
    try {
      const res = await fetch('/api/user/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      if (res.ok) {
        setCurrentPlan(planId)
        alert(planId === 'free' ? 'Plan changé en Free.' : `Plan changé en ${planId}. Actif pendant 30 jours.`)
      }
    } catch {}
    setChanging(null)
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
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

      <section className="max-w-4xl mx-auto px-6 pt-24 pb-12">
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
            { id: 'free', name: 'Free', price: '0€', period: '/mois', desc: locale === 'en' ? 'To discover.' : locale === 'es' ? 'Para descubrir.' : locale === 'de' ? 'Zum Entdecken.' : 'Pour découvrir.', cta: locale === 'en' ? 'Get started' : locale === 'es' ? 'Empezar' : locale === 'de' ? 'Starten' : 'Commencer', features: locale === 'en' ? ['1 message/day', 'NTRL 1.0 only', 'No web search'] : locale === 'es' ? ['1 mensaje/día', 'Solo NTRL 1.0', 'Sin búsqueda web'] : locale === 'de' ? ['1 Nachricht/Tag', 'Nur NTRL 1.0', 'Keine Websuche'] : ['1 message/jour', 'NTRL 1.0 uniquement', 'Pas de recherche web'], highlighted: false },
            { id: 'plus', name: 'Plus', price: '5€', period: '/mois', desc: locale === 'en' ? 'For regular use.' : locale === 'es' ? 'Para uso regular.' : locale === 'de' ? 'Für regelmäßige Nutzung.' : 'Pour un usage régulier.', cta: locale === 'en' ? 'Upgrade to Plus' : locale === 'es' ? 'Pasar a Plus' : locale === 'de' ? 'Zu Plus wechseln' : 'Passer à Plus', features: locale === 'en' ? ['150 messages/month', 'NTRL 1.0 & 1.3', 'Web search', 'Unlimited history'] : locale === 'es' ? ['150 mensajes/mes', 'NTRL 1.0 & 1.3', 'Búsqueda web', 'Historial ilimitado'] : locale === 'de' ? ['150 Nachrichten/Monat', 'NTRL 1.0 & 1.3', 'Websuche', 'Unbegrenzter Verlauf'] : ['150 messages/mois', 'NTRL 1.0 & 1.3', 'Recherche web', 'Historique illimité'], highlighted: false },
            { id: 'pro', name: 'Pro', price: '20€', period: '/mois', desc: locale === 'en' ? 'For professionals.' : locale === 'es' ? 'Para profesionales.' : locale === 'de' ? 'Für Profis.' : 'Pour les professionnels.', cta: locale === 'en' ? 'Upgrade to Pro' : locale === 'es' ? 'Pasar a Pro' : locale === 'de' ? 'Zu Pro wechseln' : 'Passer à Pro', features: locale === 'en' ? ['750 messages/month', 'All models', 'Image & file upload', 'Advanced web search', 'Priority support'] : locale === 'es' ? ['750 mensajes/mes', 'Todos los modelos', 'Subir imágenes y archivos', 'Búsqueda web avanzada', 'Soporte prioritario'] : locale === 'de' ? ['750 Nachrichten/Monat', 'Alle Modelle', 'Bild- & Datei-Upload', 'Erweiterte Websuche', 'Prioritäts-Support'] : ['750 messages/mois', 'Tous les modèles', 'Upload images & fichiers', 'Recherche web avancée', 'Support prioritaire'], highlighted: true },
            { id: 'pro_plus', name: 'Pro+', price: '60€', period: '/mois', desc: locale === 'en' ? 'For power users.' : locale === 'es' ? 'Para power users.' : locale === 'de' ? 'Für Power-User.' : 'Pour les power users.', cta: locale === 'en' ? 'Upgrade to Pro+' : locale === 'es' ? 'Pasar a Pro+' : locale === 'de' ? 'Zu Pro+ wechseln' : 'Passer à Pro+', features: locale === 'en' ? ['2000 messages/month', 'All models', 'AI Agent', 'Early access to updates', 'Preview features', 'Dedicated support'] : locale === 'es' ? ['2000 mensajes/mes', 'Todos los modelos', 'Agente IA', 'Acceso anticipado', 'Funciones en vista previa', 'Soporte dedicado'] : locale === 'de' ? ['2000 Nachrichten/Monat', 'Alle Modelle', 'KI-Agent', 'Früher Zugang zu Updates', 'Vorschau-Funktionen', 'Dedizierter Support'] : ['2000 messages/mois', 'Tous les modèles', 'Agent IA', 'Accès anticipé mises à jour', 'Fonctionnalités en avant-première', 'Support dédié'], highlighted: false },
          ].map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 ${plan.highlighted ? 'gradient-border bg-[var(--bg-elevated)] border-transparent shadow-colored' : 'bg-[var(--bg-elevated)] border-[var(--border)] hover:border-[var(--border-strong)]'}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium border border-[var(--border)] shadow-sm" style={{ background: 'var(--bg-elevated)' }}>
                  <span className="gradient-text font-bold">{t.pricingPage.popular}</span>
                </div>
              )}
              <h3 className="text-[16px] font-semibold mb-1">{plan.name}</h3>
              <p className={`text-[12px] mb-3 text-[var(--fg-muted)]`}>{plan.desc}</p>
              <div className="flex items-baseline gap-0.5 mb-5">
                <span className="text-[32px] font-bold tracking-[-0.02em]">{plan.price}</span>
                <span className={`text-[12px] text-[var(--fg-muted)]`}>{plan.period}</span>
              </div>
              <div className="mb-5">
                {isLoggedIn ? (
                  <button
                    onClick={() => handleChangePlan(plan.id)}
                    disabled={currentPlan === plan.id || changing === plan.id}
                    className={`w-full h-9 text-[13px] font-medium rounded-lg transition-all active:scale-[0.97] disabled:opacity-50 ${currentPlan === plan.id ? 'bg-[var(--bg-soft)] text-[var(--fg-muted)] border border-[var(--border)] cursor-default' : plan.highlighted ? 'bg-[var(--accent)] text-[var(--bg)] shadow-sm hover:shadow-md' : 'bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md'}`}
                  >
                    {changing === plan.id ? '...' : currentPlan === plan.id ? (locale === 'en' ? 'Current plan' : 'Plan actuel') : plan.cta}
                  </button>
                ) : (
                  <Link href="/register" className="block">
                    <button className={`w-full h-9 text-[13px] font-medium rounded-lg transition-all active:scale-[0.97] ${plan.highlighted ? 'bg-[var(--accent)] text-[var(--bg)] shadow-sm hover:shadow-md' : 'bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md'}`}>{plan.cta}</button>
                  </Link>
                )}
              </div>
              <ul className="space-y-2">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <Check size={13} className="mt-0.5 shrink-0 text-[var(--fg-subtle)]" />
                    <span className="text-[12px] leading-snug text-[var(--fg-muted)]">{f}</span>
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
              <div key={i} className="p-4 rounded-xl glass-card">
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
