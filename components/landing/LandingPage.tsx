'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  ArrowRight, ArrowUp, Globe, Brain, Zap, Code2, Calendar, Lock,
  Sparkles, Star, MessageSquare, Search, Shield, Plus, Square, Check, Cpu,
} from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { useI18n } from '@/lib/i18n'
import { MarketingNav } from './MarketingNav'
import { AuroraBackground } from './AuroraBackground'
import { AnimatedCounter } from './AnimatedCounter'
import { Marquee } from './Marquee'

/* ──────────────────────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────────────────────── */

const BENTO_FEATURES = [
  {
    icon: Brain,
    title: 'Memoire contextuelle',
    desc: "Netral retient vos preferences, votre metier et vos projets pour des reponses toujours pertinentes — sans avoir a se repeter.",
    span: 'lg' as const,
    accent: 'from-violet-500/15 via-violet-500/5 to-transparent',
    iconBg: 'from-violet-500/20 to-violet-600/10',
    decorative: 'memory',
  },
  {
    icon: Globe,
    title: 'Web temps reel',
    desc: "Recherche en direct, sources citees, citations cliquables.",
    span: 'sm' as const,
    accent: 'from-blue-500/15 to-cyan-500/5',
    iconBg: 'from-blue-500/20 to-cyan-500/10',
    decorative: 'web',
  },
  {
    icon: Zap,
    title: 'Sub-200ms',
    desc: "Streaming optimise, premiere reponse en moins d'un battement de cils.",
    span: 'sm' as const,
    accent: 'from-amber-500/15 to-orange-500/5',
    iconBg: 'from-amber-500/20 to-orange-500/10',
    decorative: 'speed',
  },
  {
    icon: Code2,
    title: 'Agent VS Code',
    desc: "Extension native qui lit, ecrit et corrige votre code directement dans l'editeur. Multi-fichiers, multi-langages.",
    span: 'lg' as const,
    accent: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
    iconBg: 'from-emerald-500/20 to-teal-500/10',
    decorative: 'code',
  },
  {
    icon: Calendar,
    title: 'Integrations',
    desc: 'Gmail · Calendar · Drive · Docs · Sheets',
    span: 'sm' as const,
    accent: 'from-rose-500/15 to-pink-500/5',
    iconBg: 'from-rose-500/20 to-pink-500/10',
    decorative: 'integrations',
  },
  {
    icon: Lock,
    title: 'Prive par defaut',
    desc: "Aucun entrainement sur vos donnees. Chiffrement bout-en-bout.",
    span: 'sm' as const,
    accent: 'from-slate-500/10 to-gray-500/5',
    iconBg: 'from-slate-500/20 to-gray-500/10',
    decorative: 'privacy',
  },
]

const TESTIMONIALS = [
  { name: 'Marie L.', role: 'Designer · Doctolib', avatar: 'M', text: "Netral comprend vraiment le contexte. C'est bluffant. Je l'utilise tous les jours pour mes specs design.", color: 'from-violet-400 to-fuchsia-400' },
  { name: 'Thomas R.', role: 'Senior Dev · Qonto', avatar: 'T', text: "Le meilleur assistant que j'ai teste. Plus rapide que Claude, plus precis que GPT-4 sur mon stack.", color: 'from-blue-400 to-cyan-400' },
  { name: 'Sarah K.', role: 'Product · Alan', avatar: 'S', text: "L'extension VS Code change tout. Je code 2x plus vite, sans interruption mentale.", color: 'from-amber-400 to-orange-400' },
  { name: 'Lucas D.', role: 'Founder · indie', avatar: 'L', text: "Memoire contextuelle = killer feature. Il sait que je code en TypeScript et m'evite des explications.", color: 'from-emerald-400 to-teal-400' },
]

const FAQ = [
  { q: 'En quoi Netral differe de ChatGPT ?', a: "Netral combine plusieurs modeles (Mistral, Gemini, Kimi K2) avec une memoire persistante et une recherche web temps reel native. Pas de plugins a activer — tout est integre." },
  { q: 'Mes donnees sont-elles utilisees pour entrainer des modeles ?', a: "Jamais. Vos messages restent strictement prives. Aucun fournisseur tiers n'a acces aux conversations pour entrainer ses modeles." },
  { q: 'Puis-je essayer gratuitement ?', a: "Oui. Le plan Free vous donne acces a NTRL 1.3 (1 message/jour). Les plans payants commencent a 5E/mois." },
  { q: "L'extension VS Code est-elle disponible ?", a: "Oui, gratuite et open-source. Elle se synchronise avec votre compte Netral via un token API genere depuis les parametres." },
]

const MODELS_LOGOS = [
  { name: 'Mistral', tag: 'NTRL 1.3' },
  { name: 'Gemini 2.5', tag: 'NTRL 1.2' },
  { name: 'Kimi K2', tag: 'NTRL 2.0' },
  { name: 'Web Search', tag: 'Live' },
  { name: 'Gmail', tag: 'API' },
  { name: 'Calendar', tag: 'API' },
  { name: 'Drive', tag: 'API' },
  { name: 'VS Code', tag: 'Agent' },
]

/* ──────────────────────────────────────────────────────────────
   COMPONENT
   ────────────────────────────────────────────────────────────── */

export function LandingPage() {
  const { t } = useI18n()
  const heroRef = useRef<HTMLDivElement>(null)
  const [landingInput, setLandingInput] = useState('')
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.94])

  const statsLabels = [t.stats?.latency ?? 'Latence', t.stats?.uptime ?? 'Uptime', t.stats?.users ?? 'Utilisateurs']

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] overflow-x-hidden noise-soft">
      <MarketingNav />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section ref={heroRef} className="relative pt-32 md:pt-44 pb-20 overflow-hidden">
        <AuroraBackground intensity="normal" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="max-w-4xl mx-auto px-6 text-center relative"
        >
          {/* Live status badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-[12px] text-[var(--fg-muted)] mb-7 group cursor-default"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="tracking-wide">{t.hero?.badge ?? 'Maintenant disponible — NTRL 2.0'}</span>
            <ArrowRight size={11} className="text-[var(--fg-subtle)] group-hover:translate-x-0.5 transition-transform" />
          </motion.div>

          {/* Title — split letter-by-letter */}
          <h1 className="text-[clamp(3rem,9.5vw,6.5rem)] font-bold tracking-[-0.045em] leading-[0.98] mb-7">
            <SplitLine text={t.hero?.title1 ?? "L'IA qui pense"} delayBase={0.1} />
            <br />
            <span className="hero-gradient-text inline-block">
              <SplitLine text={t.hero?.title2 ?? 'avec vous.'} delayBase={0.32} />
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="text-[18px] md:text-[20px] text-[var(--fg-muted)] max-w-xl mx-auto mb-10 leading-[1.55]"
          >
            {t.hero?.subtitle ?? "Un assistant qui consulte le web en temps reel, retient ce qui compte et raisonne avec vous."}
          </motion.p>

          {/* HERO INPUT — MEGA glow on focus */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="w-full max-w-2xl mx-auto mb-7"
          >
            <div className="mega-input glass-card overflow-hidden">
              <div className="flex items-center gap-2 px-2 py-2 relative">
                <button
                  onClick={() => landingInput.trim() && setShowLoginPopup(true)}
                  className="shrink-0 h-9 w-9 rounded-xl flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--accent-soft)] transition-all"
                  aria-label="Ajouter"
                >
                  <Plus size={16} />
                </button>
                <input
                  value={landingInput}
                  onChange={(e) => setLandingInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && landingInput.trim()) setShowLoginPopup(true) }}
                  placeholder={t.hero?.cta ?? "Demandez n'importe quoi a Netral..."}
                  className="flex-1 h-11 bg-transparent text-[15.5px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none"
                />
                <button
                  onClick={() => landingInput.trim() && setShowLoginPopup(true)}
                  className="shrink-0 h-9 w-9 rounded-xl bg-[var(--accent)] text-[var(--bg)] flex items-center justify-center hover:scale-[1.06] active:scale-95 transition-all shadow-sm"
                  aria-label="Envoyer"
                >
                  <ArrowUp size={15} strokeWidth={2.5} />
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--glass-border)] px-3 py-2 text-[11px] text-[var(--fg-subtle)]">
                <div className="flex items-center gap-1.5">
                  <Cpu size={10} />
                  <span>NTRL 1.3</span>
                  <span className="opacity-40">·</span>
                  <Globe size={10} />
                  <span>Web</span>
                </div>
                <span className="hidden sm:flex items-center gap-1">
                  <span className="kbd text-[9px]">↵</span>
                  pour envoyer
                </span>
              </div>
            </div>
          </motion.div>

          {/* Social proof avatars + stars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <div className="flex -space-x-2">
              {['M', 'T', 'S', 'A', 'L'].map((l, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-[var(--bg)] flex items-center justify-center text-[10px] font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, hsl(${260 + i * 15}, 80%, 60%), hsl(${20 + i * 10}, 85%, 55%))`,
                    zIndex: 5 - i,
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[var(--fg-muted)]">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
              </div>
              <span className="font-medium">4.9/5</span>
              <span className="text-[var(--fg-subtle)]">— +50 000 utilisateurs</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Login popup */}
        <AnimatePresence>
          {showLoginPopup && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLoginPopup(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-50" />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 20 }}
                  transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                  className="glass-card p-7 w-full max-w-sm pointer-events-auto shadow-colored relative overflow-hidden"
                >
                  <div className="beam-scan" style={{ ['--beam-delay' as string]: '0.3s' }} />
                  <div className="flex justify-center mb-4 relative">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)' }}>
                      <NetralLogo size={28} />
                    </div>
                  </div>
                  <h3 className="text-[18px] font-bold mb-1.5 text-center tracking-[-0.01em]">Connectez-vous pour continuer</h3>
                  <p className="text-[13px] text-[var(--fg-muted)] text-center mb-6">Vos messages sont prives et chiffres.</p>
                  <div className="space-y-2.5">
                    <Link href={`/login?q=${encodeURIComponent(landingInput)}`} className="block">
                      <button className="w-full h-11 rounded-xl bg-[var(--accent)] text-[var(--bg)] text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-all hover:shadow-lg active:scale-[0.97]">
                        Se connecter
                      </button>
                    </Link>
                    <Link href={`/register?q=${encodeURIComponent(landingInput)}`} className="block">
                      <button className="w-full h-11 rounded-xl border border-[var(--border)] text-[14px] font-medium hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)] transition-all">
                        Creer un compte
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </section>

      {/* ═══════════════════ MARQUEE — MODELS / INTEGRATIONS ═══════════════════ */}
      <section className="py-10 border-y border-[var(--border)] bg-[var(--bg-soft)]/40">
        <p className="text-center text-[11px] uppercase tracking-[0.18em] text-[var(--fg-subtle)] mb-5 font-medium">
          Propulse par les meilleurs modeles · Integre a vos outils
        </p>
        <Marquee speed={45}>
          {MODELS_LOGOS.map((m, i) => (
            <div
              key={`${m.name}-${i}`}
              className="flex items-center gap-2.5 px-5 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border-strong)] transition-colors"
            >
              <span className="font-semibold text-[var(--fg)]">{m.name}</span>
              <span className="text-[10px] font-mono text-[var(--fg-subtle)] uppercase tracking-wider">{m.tag}</span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* ═══════════════════ DEMO — animated chat mock ═══════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChatDemoWindow />
        </motion.div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section className="border-y border-[var(--border)] py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent 70%)' }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard display="< 200ms" label={statsLabels[0]} />
          <StatCard display="99.9%" label={statsLabels[1]} />
          <StatCard value={50000} suffix="+" label={statsLabels[2]} />
        </div>
      </section>

      {/* ═══════════════════ BENTO FEATURES ═══════════════════ */}
      <section className="py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] text-[11px] font-medium text-[var(--fg-muted)] mb-5 uppercase tracking-wider">
              <Sparkles size={11} className="text-violet-500" />
              Fonctionnalites
            </div>
            <h2 className="text-[36px] md:text-[52px] font-bold tracking-[-0.04em] mb-4 leading-[1.05]">
              {t.features?.title ?? "Tout ce qu'il vous faut."}
              <br />
              <span className="text-[var(--fg-muted)]">{t.features?.subtitle ?? 'Rien de plus.'}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BENTO_FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`magnetic-card group relative p-6 rounded-2xl border border-[var(--border)] bg-gradient-to-br ${f.accent} bg-[var(--bg-elevated)] overflow-hidden ${f.span === 'lg' ? 'md:col-span-2' : ''}`}
                  style={{ minHeight: 220 }}
                >
                  <div className="beam-scan" style={{ ['--beam-delay' as string]: `${i * 0.7}s` }} />

                  {/* Decorative element top-right */}
                  <DecorativeFeature kind={f.decorative} />

                  <div className={`relative z-10 w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${f.iconBg} border border-[var(--border)] group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={18} className="text-[var(--fg)]" strokeWidth={1.8} />
                  </div>

                  <h3 className="relative z-10 text-[17px] font-semibold mb-2 tracking-[-0.01em]">{f.title}</h3>
                  <p className="relative z-10 text-[13.5px] text-[var(--fg-muted)] leading-[1.6] max-w-xs">
                    {f.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/fonctionnalites"
              className="inline-flex items-center gap-2 text-[14px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors group px-5 py-2.5 rounded-full hover:bg-[var(--accent-soft)] border border-[var(--border)] hover:border-[var(--border-strong)]"
            >
              {t.features?.seeAll ?? 'Voir toutes les fonctionnalites'}
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="border-t border-[var(--border)] py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="flex justify-center gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-amber-400 text-amber-400" />)}
            </div>
            <h2 className="text-[28px] md:text-[36px] font-bold tracking-[-0.03em] mb-2">
              Aime par les meilleurs.
            </h2>
            <p className="text-[14px] text-[var(--fg-muted)]">Note 4.9/5 par +50 000 utilisateurs.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTIMONIALS.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="magnetic-card p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] relative overflow-hidden"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-[15px] text-[var(--fg)] leading-[1.6] mb-5 font-medium">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center text-[12px] font-bold text-white shrink-0`}>
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold">{r.name}</p>
                    <p className="text-[11.5px] text-[var(--fg-muted)]">{r.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <section className="border-t border-[var(--border)] py-24">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-[28px] md:text-[36px] font-bold tracking-[-0.03em]">Questions frequentes</h2>
          </motion.div>
          <div className="space-y-2">
            {FAQ.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="relative border-t border-[var(--border)] py-32 overflow-hidden">
        <AuroraBackground intensity="subtle" showGrid={false} />
        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h2 className="text-[40px] md:text-[60px] font-bold tracking-[-0.045em] leading-[0.98] mb-5">
              {t.pricing?.title1 ?? 'Commencez en 30 secondes.'}<br />
              <span className="hero-gradient-text">{t.pricing?.title2 ?? 'Gratuit pour toujours.'}</span>
            </h2>
            <p className="text-[17px] text-[var(--fg-muted)] max-w-md mx-auto mb-10">
              {t.pricing?.subtitle ?? 'Aucune carte bancaire requise. Annulez quand vous voulez.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <button className="group h-13 px-8 text-[15px] font-semibold rounded-full bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all hover:scale-[1.04] active:scale-[0.98] inline-flex items-center gap-2.5 shadow-md hover:shadow-xl" style={{ height: 52 }}>
                  {t.pricing?.cta ?? 'Commencer gratuitement'}
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/tarifs">
                <button className="h-13 px-8 text-[15px] font-medium rounded-full border border-[var(--border)] hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)] transition-all" style={{ height: 52 }}>
                  {t.pricing?.seePricing ?? 'Voir les tarifs'}
                </button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-10 text-[12px] text-[var(--fg-subtle)]">
              <span className="flex items-center gap-1.5"><Check size={11} className="text-emerald-500" strokeWidth={3} /> Sans CB</span>
              <span className="flex items-center gap-1.5"><Check size={11} className="text-emerald-500" strokeWidth={3} /> Annulable</span>
              <span className="flex items-center gap-1.5"><Shield size={11} /> Prive</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[var(--border)] py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <NetralLogo size={20} />
              <span className="font-semibold text-[14px]">Netral</span>
              <span className="text-[12px] text-[var(--fg-subtle)] ml-1">© {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-[var(--fg-muted)]">
              <Link href="/fonctionnalites" className="hover:text-[var(--fg)] transition-colors">Fonctionnalites</Link>
              <Link href="/tarifs" className="hover:text-[var(--fg)] transition-colors">Tarifs</Link>
              <Link href="/extensions" className="hover:text-[var(--fg)] transition-colors">VS Code</Link>
              <Link href="/integrations" className="hover:text-[var(--fg)] transition-colors">Integrations</Link>
              <Link href="/changelog" className="hover:text-[var(--fg)] transition-colors">Changelog</Link>
              <Link href="/privacy" className="hover:text-[var(--fg)] transition-colors">{t.footer?.privacy ?? 'Confidentialite'}</Link>
              <Link href="/terms" className="hover:text-[var(--fg)] transition-colors">CGU</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   SUB-COMPONENTS
   ────────────────────────────────────────────────────────────── */

function SplitLine({ text, delayBase }: { text: string; delayBase: number }) {
  return (
    <span className="inline-block">
      {text.split('').map((char, i) => (
        <motion.span
          key={`c-${i}`}
          initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            delay: delayBase + i * 0.022,
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

function StatCard({
  value, display, suffix, label,
}: {
  value?: number; display?: string; suffix?: string; label: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <p className="text-[44px] md:text-[56px] font-bold tracking-[-0.045em] leading-none">
        <AnimatedCounter value={value} display={display} suffix={suffix} className="hero-gradient-text" />
      </p>
      <p className="text-[12px] text-[var(--fg-muted)] mt-2.5 uppercase tracking-[0.15em] font-medium">
        {label}
      </p>
    </motion.div>
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
        <span className="text-[15px] font-semibold tracking-[-0.005em]">{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} className="text-[var(--fg-muted)] shrink-0">
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
            <div className="px-5 pb-5 text-[14px] text-[var(--fg-muted)] leading-[1.65]">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function DecorativeFeature({ kind }: { kind: string }) {
  if (kind === 'memory') {
    return (
      <div aria-hidden className="absolute top-5 right-5 opacity-50 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col gap-1">
          {['Designer', 'TypeScript', 'Paris'].map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              className="text-[9px] px-1.5 py-0.5 rounded-md bg-violet-500/10 text-violet-500 dark:text-violet-300 border border-violet-500/20 self-end font-mono"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    )
  }
  if (kind === 'web') {
    return (
      <div aria-hidden className="absolute top-5 right-5 opacity-60">
        <Globe size={36} className="text-blue-500/40 animate-spin" style={{ animationDuration: '12s' }} />
      </div>
    )
  }
  if (kind === 'speed') {
    return (
      <div aria-hidden className="absolute top-5 right-5 opacity-60 flex flex-col items-end gap-0.5 font-mono text-[9px] text-amber-500/80">
        <span>180ms</span>
        <span>192ms</span>
        <span>201ms</span>
      </div>
    )
  }
  if (kind === 'code') {
    return (
      <div aria-hidden className="absolute top-5 right-5 opacity-50 font-mono text-[10px] text-emerald-500/80 leading-tight">
        <div>{'function fix() {'}</div>
        <div className="ml-2">{'// done by Netral'}</div>
        <div>{'}'}</div>
      </div>
    )
  }
  if (kind === 'integrations') {
    return (
      <div aria-hidden className="absolute top-5 right-5 opacity-70 flex gap-1">
        {['✉️', '📅', '📁'].map((e, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: -4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="text-[14px]"
          >
            {e}
          </motion.span>
        ))}
      </div>
    )
  }
  if (kind === 'privacy') {
    return (
      <div aria-hidden className="absolute top-5 right-5 opacity-60">
        <Shield size={28} className="text-slate-500/60" />
      </div>
    )
  }
  return null
}

/* ──────────────────────────────────────────────────────────────
   ANIMATED CHAT DEMO WINDOW
   Auto-cycling fake conversation showing Netral capabilities.
   ────────────────────────────────────────────────────────────── */

function ChatDemoWindow() {
  const [step, setStep] = useState(0)
  const [typed, setTyped] = useState('')

  const userMsg = 'Compare Mistral et Gemini en 2026'

  useEffect(() => {
    if (step !== 0) return
    let i = 0
    const interval = setInterval(() => {
      if (i <= userMsg.length) {
        setTyped(userMsg.slice(0, i))
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setStep(1), 400)
      }
    }, 45)
    return () => clearInterval(interval)
  }, [step])

  useEffect(() => {
    if (step < 1) return
    if (step >= 5) {
      // restart loop
      const t = setTimeout(() => { setStep(0); setTyped('') }, 7000)
      return () => clearTimeout(t)
    }
    const delays = [800, 1200, 1500, 1800, 1500]
    const t = setTimeout(() => setStep((s) => s + 1), delays[step - 1] ?? 1500)
    return () => clearTimeout(t)
  }, [step])

  return (
    <div className="window-mock relative">
      {/* Title bar */}
      <div className="h-11 flex items-center gap-2 px-4 border-b border-[var(--border)] bg-[var(--bg-soft)]/60">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1.5 rounded-lg bg-[var(--bg)]/70 border border-[var(--glass-border)] text-[11px] font-mono text-[var(--fg-muted)] flex items-center gap-1.5">
            <Lock size={9} className="text-emerald-500" />
            netral.app/chat
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Chat content */}
      <div className="p-6 md:p-10 space-y-5 min-h-[440px]">
        {/* User message */}
        <div className="flex justify-end">
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-[75%] px-4 py-3 rounded-2xl rounded-br-md bg-[var(--accent)] text-[var(--bg)] text-[14.5px] leading-relaxed shadow-sm"
          >
            {typed}
            {step === 0 && <span className="inline-block w-[2px] h-[14px] bg-current ml-0.5 animate-pulse align-middle" />}
          </motion.div>
        </div>

        {/* Status pill — searching */}
        <AnimatePresence>
          {step >= 1 && step <= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 text-[12.5px] text-[var(--fg-muted)]"
            >
              <div className="relative w-4 h-4">
                <span className="absolute inset-0 rounded-full bg-violet-500/40 animate-ping" />
                <span className="relative w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                  <Search size={9} className="text-white" />
                </span>
              </div>
              <span className="streaming-shimmer font-medium">
                {step === 1 ? 'Recherche sur le web...' : 'Lecture de 4 sources...'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reasoning collapsed */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-[12px] text-[var(--fg-muted)]"
            >
              <span className="w-5 h-5 rounded-md bg-[var(--bg-soft)] border border-[var(--border)] flex items-center justify-center">
                <Brain size={11} className="text-violet-500" />
              </span>
              <span className="font-medium">Reflechi pendant 2.4s</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Assistant response */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex gap-3"
            >
              <div className="shrink-0 mt-0.5">
                <div className="w-7 h-7 rounded-lg glass-card flex items-center justify-center">
                  <NetralLogo size={16} />
                </div>
              </div>
              <div className="flex-1 text-[14.5px] leading-[1.7] text-[var(--fg-soft)] space-y-2.5 max-w-prose">
                <DemoLine show={step >= 3} delay={0}>
                  <strong className="text-[var(--fg)]">Mistral Medium</strong> excelle en raisonnement structure et cout/token, tandis que <strong className="text-[var(--fg)]">Gemini 2.5</strong> domine sur les contextes longs (1M tokens) et le multimodal natif.
                </DemoLine>
                <DemoLine show={step >= 4} delay={0.3}>
                  Pour du <strong className="text-[var(--fg)]">code en francais</strong>, Mistral garde un leger avantage en 2026, surtout avec les tool-calls
                  <a data-citation>1</a><a data-citation>2</a>.
                </DemoLine>
                {step >= 5 && (
                  <DemoLine show delay={0.3}>
                    Vous voulez que je detaille un aspect precis ?
                    <span className="stream-cursor" />
                  </DemoLine>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sources pills */}
        <AnimatePresence>
          {step >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="ml-10 pt-3 border-t border-[var(--border)]"
            >
              <p className="text-[10px] font-medium text-[var(--fg-muted)] uppercase tracking-wider mb-2">Sources (2)</p>
              <div className="flex flex-wrap gap-1.5">
                {['mistral.ai', 'deepmind.google'].map((d, i) => (
                  <span key={d} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md glass-card text-[11px] text-[var(--fg-muted)]">
                    <span className="w-3 h-3 rounded-sm bg-gradient-to-br from-violet-400 to-orange-400" />
                    {d}
                    <span className="text-[var(--fg-subtle)] font-mono">[{i + 1}]</span>
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function DemoLine({ children, show, delay }: { children: React.ReactNode; show: boolean; delay: number }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.p>
  )
}
