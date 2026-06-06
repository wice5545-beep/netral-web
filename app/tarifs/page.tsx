'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Sparkles, Zap, Shield, Infinity, CreditCard, X } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { MarketingNav } from '@/components/landing/MarketingNav'
import { AuroraBackground } from '@/components/landing/AuroraBackground'

interface Plan {
  id: string
  name: string
  monthly: number
  yearly: number
  description: string
  badge?: string
  features: { text: string; included: boolean }[]
  cta: string
  highlight?: boolean
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    monthly: 0,
    yearly: 0,
    description: 'Pour découvrir Netral et ses capacités de base.',
    features: [
      { text: '10 messages / jour', included: true },
      { text: 'Modèle NTRL 1.0', included: true },
      { text: 'Recherche web', included: true },
      { text: 'Mémoire contextuelle (10 messages)', included: true },
      { text: 'Extensions VS Code', included: true },
      { text: 'Intégrations Google', included: false },
      { text: 'Modèles avancés (NTRL 1.2, 2.0)', included: false },
      { text: 'Upload de fichiers', included: false },
      { text: 'Support prioritaire', included: false },
      { text: 'API personnelle', included: false },
    ],
    cta: 'Commencer gratuitement',
  },
  {
    id: 'plus',
    name: 'Plus',
    monthly: 5,
    yearly: 48,
    description: 'Pour les utilisateurs réguliers qui veulent plus de puissance.',
    features: [
      { text: '60 messages / jour', included: true },
      { text: 'NTRL 1.2 inclus', included: true },
      { text: 'Recherche web avancée', included: true },
      { text: 'Mémoire étendue (50 messages)', included: true },
      { text: 'Extensions VS Code', included: true },
      { text: 'Intégrations Google (Gmail, Calendar, Drive)', included: true },
      { text: 'Upload de fichiers (images, PDF)', included: true },
      { text: 'NTRL 2.0', included: false },
      { text: 'Support prioritaire', included: false },
      { text: 'API personnelle', included: false },
    ],
    cta: 'Passer à Plus',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 20,
    yearly: 192,
    description: 'Pour les professionnels qui exigent le meilleur.',
    badge: 'Populaire',
    highlight: true,
    features: [
      { text: 'Messages illimités*', included: true },
      { text: 'Tous les modèles (NTRL 1.0, 1.2, 2.0)', included: true },
      { text: 'Recherche web illimitée', included: true },
      { text: 'Mémoire complète (200 messages)', included: true },
      { text: 'Extensions VS Code avancées', included: true },
      { text: 'Intégrations Google complètes', included: true },
      { text: 'Upload de fichiers (tous formats)', included: true },
      { text: 'Support prioritaire 24/7', included: true },
      { text: 'API personnelle', included: true },
      { text: 'Accès anticipé aux nouvelles features', included: true },
    ],
    cta: 'Passer à Pro',
  },
  {
    id: 'pro_plus',
    name: 'Pro+',
    monthly: 60,
    yearly: 576,
    description: 'Pour les équipes et les power users. Puissance maximale.',
    badge: 'Power',
    features: [
      { text: 'Messages illimités*', included: true },
      { text: 'Tous les modèles en priorité', included: true },
      { text: 'Recherche web illimitée + deep search', included: true },
      { text: 'Mémoire illimitée', included: true },
      { text: 'Extensions VS Code premium', included: true },
      { text: 'Intégrations Google + automatisations', included: true },
      { text: 'Upload fichiers volumineux (100MB)', included: true },
      { text: 'Support dédié (Slack privé)', included: true },
      { text: 'API avec clés multiples', included: true },
      { text: 'Déploiements personnalisés', included: true },
    ],
    cta: 'Passer à Pro+',
  },
]

const FAQS = [
  { q: 'Puis-je changer de plan à tout moment ?', a: 'Oui, vous pouvez upgrader ou downgrader à tout moment. Le changement prend effet immédiatement.' },
  { q: 'Y a-t-il un engagement de durée ?', a: 'Aucun engagement. Tous les plans sont sans engagement, vous pouvez annuler quand vous voulez.' },
  { q: 'Quels moyens de paiement acceptez-vous ?', a: 'Nous acceptons les cartes bancaires (Visa, Mastercard, American Express) via Stripe, un processeur de paiement certifié PCI-DSS.' },
  { q: 'Les messages illimités sont-ils vraiment illimités ?', a: 'Oui, avec une limite d\'usage raisonnable de 500 messages/jour pour éviter les abus. Au-delà, contactez-nous.' },
  { q: 'Proposez-vous des tarifs pour les équipes ?', a: 'Oui, le plan Pro+ est conçu pour les équipes. Pour les grandes organisations, contactez-nous pour un devis personnalisé.' },
  { q: 'Comment fonctionne la période d\'essai ?', a: 'Le plan Gratuit est permanent. Vous pouvez tester les fonctionnalités de base sans limite de temps, puis upgrader quand vous êtes prêt.' },
]

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="border border-[var(--border)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--border-strong)]"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="font-medium text-[15px] text-[var(--fg)]">{q}</span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <ArrowRight size={16} className="text-[var(--fg-muted)]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-[14px] text-[var(--fg-muted)] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function PriceDisplay({ price, yearly, animate }: { price: number; yearly: boolean; animate?: boolean }) {
  const displayPrice = yearly ? Math.round(price * 0.8 * 12) / 12 : price
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="text-lg font-medium text-[var(--fg-muted)]">€</span>
      <motion.span
        key={animate ? displayPrice : 'static'}
        initial={animate ? { opacity: 0, y: 10, filter: 'blur(4px)' } : undefined}
        animate={animate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-[42px] font-bold tracking-[-0.03em] text-[var(--fg)] leading-none"
      >
        {displayPrice % 1 === 0 ? displayPrice : displayPrice.toFixed(2)}
      </motion.span>
    </div>
  )
}

export default function TarifsPage() {
  const { t, locale } = useI18n()
  const [yearly, setYearly] = useState(false)
  const [plan, setPlan] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/user/plan')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.plan) setPlan(d.plan) })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] relative">
      <MarketingNav />
      <AuroraBackground />

      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.08] blur-[120px]"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px]"
          style={{ background: 'radial-gradient(circle, #f97316, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.04] blur-[150px]"
          style={{ background: 'radial-gradient(ellipse, #ec4899, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-[14px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors group">
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Retour
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] text-[12px] font-medium text-[var(--fg-muted)] mb-6">
            <Sparkles size={12} className="text-[var(--accent)]" />
            Plans transparents, sans surprise
          </div>
          <h1 className="text-[42px] md:text-[56px] font-bold tracking-[-0.04em] leading-[1.05] mb-4">
            <span className="gradient-text">Tarifs</span> simples
          </h1>
          <p className="text-[16px] text-[var(--fg-muted)] max-w-lg mx-auto leading-relaxed">
            Commencez gratuitement, passez à un plan payant quand vous avez besoin de plus de puissance. Annulez à tout moment.
          </p>

          {/* Yearly/Monthly toggle */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-3 mt-8 p-1 rounded-full bg-[var(--bg-soft)] border border-[var(--border)]"
          >
            <button
              onClick={() => setYearly(false)}
              className={`relative px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                !yearly ? 'text-[var(--fg)]' : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
              }`}
            >
              {!yearly && (
                <motion.div layoutId="toggle-pill" className="absolute inset-0 rounded-full bg-[var(--bg)] border border-[var(--border-strong)] shadow-[var(--shadow-sm)]" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <span className="relative z-10">Mensuel</span>
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`relative px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                yearly ? 'text-[var(--fg)]' : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
              }`}
            >
              {yearly && (
                <motion.div layoutId="toggle-pill" className="absolute inset-0 rounded-full bg-[var(--bg)] border border-[var(--border-strong)] shadow-[var(--shadow-sm)]" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <span className="relative z-10 flex items-center gap-2">
                Annuel
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  -20%
                </span>
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-24">
          {PLANS.map((p, i) => {
            const isCurrentPlan = plan === p.id
            const isHovered = hoveredCard === p.id
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredCard(p.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative rounded-3xl p-[1px] transition-all duration-500 ${
                  p.highlight
                    ? 'bg-gradient-to-b from-[#7c3aed] via-[#ec4899] to-[#f97316] shadow-[0_0_40px_rgba(124,58,237,0.15)]'
                    : 'bg-[var(--border)]'
                }`}
              >
                <div className={`relative h-full rounded-[22px] p-6 flex flex-col transition-all duration-300 ${
                  p.highlight ? 'bg-[var(--bg)]' : 'bg-[var(--bg)]'
                }`}>
                  {/* Badge */}
                  {p.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      p.badge === 'Populaire'
                        ? 'bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]'
                        : 'bg-[var(--fg)] text-[var(--bg)]'
                    }`}>
                      {p.badge}
                    </div>
                  )}

                  {/* Plan name & description */}
                  <div className="mb-5 mt-1">
                    <h3 className="text-[18px] font-bold text-[var(--fg)] mb-1">{p.name}</h3>
                    <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed">{p.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-1">
                    {p.monthly === 0 ? (
                      <div className="text-[42px] font-bold tracking-[-0.03em] text-[var(--fg)] leading-none">Gratuit</div>
                    ) : (
                      <>
                        <PriceDisplay price={p.monthly} yearly={yearly} animate />
                        <div className="text-[13px] text-[var(--fg-muted)] mt-1">
                          {yearly ? (
                            <>
                              <span className="line-through mr-1">{p.monthly}€</span>
                              /mois
                            </>
                          ) : '/mois'}
                        </div>
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={isCurrentPlan ? '/chat' : `/register?plan=${p.id}`}
                    className={`w-full py-2.5 rounded-xl text-[13px] font-semibold text-center transition-all duration-200 mt-4 mb-5 ${
                      isCurrentPlan
                        ? 'bg-[var(--bg-soft)] text-[var(--fg-muted)] border border-[var(--border)] cursor-default'
                        : p.highlight
                          ? 'bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_24px_rgba(124,58,237,0.5)] hover:-translate-y-0.5'
                          : 'bg-[var(--fg)] text-[var(--bg)] hover:opacity-90'
                    }`}
                  >
                    {isCurrentPlan ? 'Plan actuel' : p.cta}
                  </Link>

                  {/* Features */}
                  <div className="space-y-2.5 mt-1">
                    {p.features.map((f, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: isHovered ? 1 : 1, x: 0 }}
                        transition={{ delay: j * 0.03 }}
                        className="flex items-start gap-2.5"
                      >
                        {f.included ? (
                          <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        ) : (
                          <X size={14} className="text-[var(--fg-faint)] mt-0.5 shrink-0" />
                        )}
                        <span className={`text-[13px] leading-tight ${f.included ? 'text-[var(--fg)]' : 'text-[var(--fg-faint)]'}`}>
                          {f.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 mb-24 py-6 px-8 rounded-3xl bg-[var(--bg-soft)] border border-[var(--border)]"
        >
          <div className="flex items-center gap-2.5 text-[13px] text-[var(--fg-muted)]">
            <Shield size={16} className="text-emerald-500" />
            Paiements sécurisés via Stripe
          </div>
          <div className="w-px h-5 bg-[var(--border)] hidden sm:block" />
          <div className="flex items-center gap-2.5 text-[13px] text-[var(--fg-muted)]">
            <CreditCard size={16} className="text-[var(--accent)]" />
            Sans engagement, annulez quand vous voulez
          </div>
          <div className="w-px h-5 bg-[var(--border)] hidden sm:block" />
          <div className="flex items-center gap-2.5 text-[13px] text-[var(--fg-muted)]">
            <Zap size={16} className="text-amber-500" />
            Mise à niveau instantanée
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="text-[28px] md:text-[34px] font-bold tracking-[-0.03em] mb-3">Questions fréquentes</h2>
            <p className="text-[15px] text-[var(--fg-muted)]">Tout ce que vous devez savoir sur nos plans</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}