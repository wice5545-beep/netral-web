'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  ArrowRight, ArrowUp, Globe, Brain, Zap, Code2, Calendar, Lock,
  Sparkles, Star, MessageSquare, Search, Shield, Plus, Square, Check, Cpu,
  ChevronDown, Mail, FileText, Database, Layers, PenTool, Camera, Music,
  Command, Terminal, GitBranch, Cloud, BarChart3, Clock, Users, TrendingUp,
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

const TYPING_WORDS = ['pense', 'code', 'crée', 'raisonne', 'imagine', 'analyse']

const BENTO_FEATURES = [
  {
    icon: Brain,
    title: 'Mémoire contextuelle',
    desc: "Netral retient vos préférences, votre métier et vos projets pour des réponses toujours pertinentes — sans avoir à se répéter.",
    span: 'lg' as const,
    accent: 'from-violet-500/15 via-violet-500/5 to-transparent',
    iconBg: 'from-violet-500/20 to-violet-600/10',
    decorative: 'memory',
  },
  {
    icon: Globe,
    title: 'Web temps réel',
    desc: "Recherche en direct, sources citées, citations cliquables.",
    span: 'sm' as const,
    accent: 'from-blue-500/15 to-cyan-500/5',
    iconBg: 'from-blue-500/20 to-cyan-500/10',
    decorative: 'web',
  },
  {
    icon: Zap,
    title: 'Sub-200ms',
    desc: "Streaming optimisé, première réponse en moins d'un battement de cils.",
    span: 'sm' as const,
    accent: 'from-amber-500/15 to-orange-500/5',
    iconBg: 'from-amber-500/20 to-orange-500/10',
    decorative: 'speed',
  },
  {
    icon: Code2,
    title: 'Agent VS Code',
    desc: "Extension native qui lit, écrit et corrige votre code directement dans l'éditeur. Multi-fichiers, multi-langages.",
    span: 'lg' as const,
    accent: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
    iconBg: 'from-emerald-500/20 to-teal-500/10',
    decorative: 'code',
  },
  {
    icon: Calendar,
    title: 'Intégrations',
    desc: 'Gmail · Calendar · Drive · Docs · Sheets',
    span: 'sm' as const,
    accent: 'from-rose-500/15 to-pink-500/5',
    iconBg: 'from-rose-500/20 to-pink-500/10',
    decorative: 'integrations',
  },
  {
    icon: Lock,
    title: 'Privé par défaut',
    desc: "Aucun entraînement sur vos données. Chiffrement bout-en-bout.",
    span: 'sm' as const,
    accent: 'from-slate-500/10 to-gray-500/5',
    iconBg: 'from-slate-500/20 to-gray-500/10',
    decorative: 'privacy',
  },
]

const TESTIMONIALS = [
  { name: 'Marie L.', role: 'Designer · Doctolib', avatar: 'M', text: "Netral comprend vraiment le contexte. C'est bluffant. Je l'utilise tous les jours pour mes specs design.", color: 'from-violet-400 to-fuchsia-400' },
  { name: 'Thomas R.', role: 'Senior Dev · Qonto', avatar: 'T', text: "Le meilleur assistant que j'ai testé. Plus rapide que Claude, plus précis que GPT-4 sur mon stack.", color: 'from-blue-400 to-cyan-400' },
  { name: 'Sarah K.', role: 'Product · Alan', avatar: 'S', text: "L'extension VS Code change tout. Je code 2x plus vite, sans interruption mentale.", color: 'from-amber-400 to-orange-400' },
  { name: 'Lucas D.', role: 'Founder · indie', avatar: 'L', text: "Mémoire contextuelle = killer feature. Il sait que je code en TypeScript et m'évite des explications.", color: 'from-emerald-400 to-teal-400' },
]

const FAQ = [
  { q: 'En quoi Netral diffère de ChatGPT ?', a: "Netral combine plusieurs modèles (Mistral, Gemini, Kimi K2) avec une mémoire persistante et une recherche web temps réel native. Pas de plugins à activer — tout est intégré." },
  { q: 'Mes données sont-elles utilisées pour entraîner des modèles ?', a: "Jamais. Vos messages restent strictement privés. Aucun fournisseur tiers n'a accès aux conversations pour entraîner ses modèles." },
  { q: 'Puis-je essayer gratuitement ?', a: "Oui. Le plan Free vous donne accès à NTRL 1.3 (1 message/jour). Les plans payants commencent à 5€/mois." },
  { q: "L'extension VS Code est-elle disponible ?", a: "Oui, gratuite et open-source. Elle se synchronise avec votre compte Netral via un token API généré depuis les paramètres." },
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

const FLOATING_ICONS = [
  { icon: Brain, x: '5%', y: '15%', duration: 6, delay: 0.2, color: 'text-violet-400/30' },
  { icon: Code2, x: '92%', y: '10%', duration: 7, delay: 0.8, color: 'text-emerald-400/30' },
  { icon: Globe, x: '10%', y: '75%', duration: 5.5, delay: 1.5, color: 'text-blue-400/30' },
  { icon: Zap, x: '88%', y: '70%', duration: 6.5, delay: 0.4, color: 'text-amber-400/30' },
  { icon: MessageSquare, x: '15%', y: '45%', duration: 8, delay: 2.0, color: 'text-pink-400/25' },
  { icon: Lock, x: '80%', y: '40%', duration: 7.5, delay: 1.2, color: 'text-slate-400/25' },
  { icon: Star, x: '3%', y: '55%', duration: 5, delay: 2.5, color: 'text-yellow-400/30' },
  { icon: Database, x: '95%', y: '30%', duration: 6.8, delay: 0.6, color: 'text-cyan-400/25' },
  { icon: Command, x: '50%', y: '85%', duration: 7.2, delay: 1.8, color: 'text-rose-400/25' },
  { icon: Terminal, x: '25%', y: '20%', duration: 5.8, delay: 3.0, color: 'text-green-400/25' },
]

/* ──────────────────────────────────────────────────────────────
   STARS DATA (generated once)
   ────────────────────────────────────────────────────────────── */
function generateStars(count: number) {
  const stars: { x: number; y: number; size: number; opacity: number; delay: number; duration: number }[] = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    })
  }
  return stars
}
const STARFIELD = generateStars(80)

/* ──────────────────────────────────────────────────────────────
   COMPONENT
   ────────────────────────────────────────────────────────────── */

export function LandingPage() {
  const { t } = useI18n()
  const heroRef = useRef<HTMLDivElement>(null)
  const [landingInput, setLandingInput] = useState('')
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92])

  // Mouse position for spotlight effect
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const spotX = useSpring(mouseX, { stiffness: 50, damping: 30 })
  const spotY = useSpring(mouseY, { stiffness: 50, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const statsLabels = [t.stats?.latency ?? 'Latence', t.stats?.uptime ?? 'Uptime', t.stats?.users ?? 'Utilisateurs']

  // Scroll progress for the thin bar at top
  const globalScroll = useScroll()
  const scrollProgressBar = useTransform(globalScroll.scrollYProgress, [0, 0.8], ['0%', '100%'])

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] overflow-x-hidden noise-soft">
      {/* ─── SCROLL PROGRESS BAR ─── */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] z-[60] pointer-events-none"
        style={{
          width: scrollProgressBar,
          background: 'linear-gradient(90deg, #7c3aed, #ec4899, #f97316)',
        }}
      />

      <MarketingNav />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative pt-32 md:pt-44 pb-20 overflow-hidden"
      >
        <AuroraBackground intensity="normal" />

        {/* ─── STARFIELD PARTICLES ─── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {STARFIELD.map((star, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
              }}
              animate={{
                opacity: [star.opacity, star.opacity * 2.5, star.opacity],
                scale: [1, 1.8, 1],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* ─── FLOATING ICONS (parallax) ─── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {FLOATING_ICONS.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                className={`absolute ${item.color}`}
                style={{ left: item.x, top: item.y }}
                animate={{
                  y: [0, -20, 0, 15, 0],
                  x: [0, 10, -5, -10, 0],
                  rotate: [0, 5, -3, 8, 0],
                }}
                transition={{
                  duration: item.duration,
                  repeat: Infinity,
                  delay: item.delay,
                  ease: 'easeInOut',
                }}
              >
                <Icon size={i < 4 ? 22 : 18} strokeWidth={1.5} />
              </motion.div>
            )
          })}
        </div>

        {/* ─── SPOTLIGHT FOLLOW ─── */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-[0.07] dark:opacity-[0.12]"
          style={{
            background: useMotionTemplate`radial-gradient(600px circle at ${spotX.get() * 100}% ${spotY.get() * 100}%, rgba(124,58,237,0.5), transparent 60%)`,
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="max-w-4xl mx-auto px-6 text-center relative"
        >
          {/* Live status badge — pulse enhanced */}
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

          {/* Title — split letter-by-letter + typewriter loop */}
          <h1 className="text-[clamp(3rem,9.5vw,6.5rem)] font-bold tracking-[-0.045em] leading-[0.98] mb-7">
            <SplitLine text={t.hero?.title1 ?? "L'IA qui"} delayBase={0.1} />
            {' '}
            <span className="hero-gradient-text inline-block">
              <TypewriterLoop words={TYPING_WORDS} />
            </span>
            <br />
            <span className="inline-block">
              <SplitLine text={t.hero?.title2 ?? 'avec vous.'} delayBase={0.35} />
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="text-[18px] md:text-[20px] text-[var(--fg-muted)] max-w-xl mx-auto mb-10 leading-[1.55]"
          >
            {t.hero?.subtitle ?? "Un assistant qui consulte le web en temps réel, retient ce qui compte et raisonne avec vous."}
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
                  placeholder={t.hero?.cta ?? "Demandez n'importe quoi à Netral..."}
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

        {/* Scroll indicator arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="text-[var(--fg-subtle)]"
          >
            <ChevronDown size={16} strokeWidth={1.5} />
          </motion.span>
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
                  <p className="text-[13px] text-[var(--fg-muted)] text-center mb-6">Vos messages sont privés et chiffrés.</p>
                  <div className="space-y-2.5">
                    <Link href={`/login?q=${encodeURIComponent(landingInput)}`} className="block">
                      <button className="w-full h-11 rounded-xl bg-[var(--accent)] text-[var(--bg)] text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-all hover:shadow-lg active:scale-[0.97]">
                        Se connecter
                      </button>
                    </Link>
                    <Link href={`/register?q=${encodeURIComponent(landingInput)}`} className="block">
                      <button className="w-full h-11 rounded-xl border border-[var(--border)] text-[14px] font-medium hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)] transition-all">
                        Créer un compte
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
          Propulsé par les meilleurs modèles · Intégré à vos outils
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

      {/* ═══════════════════ DEMO — animated chat mock (IMPROVED) ═══════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <ScrollReveal>
          <ChatDemoWindow />
        </ScrollReveal>
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
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] text-[11px] font-medium text-[var(--fg-muted)] mb-5 uppercase tracking-wider">
                <Sparkles size={11} className="text-violet-500" />
                Fonctionnalités
              </div>
              <h2 className="text-[36px] md:text-[52px] font-bold tracking-[-0.04em] mb-4 leading-[1.05]">
                {t.features?.title ?? "Tout ce qu'il vous faut."}
                <br />
                <span className="text-[var(--fg-muted)]">{t.features?.subtitle ?? 'Rien de plus.'}</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BENTO_FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <TiltCard key={i}>
                  <ScrollReveal delay={i * 0.06} direction="up">
                    <div
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
                    </div>
                  </ScrollReveal>
                </TiltCard>
              )
            })}
          </div>

          <ScrollReveal delay={0.2}>
            <div className="text-center mt-12">
              <Link
                href="/fonctionnalites"
                className="inline-flex items-center gap-2 text-[14px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors group px-5 py-2.5 rounded-full hover:bg-[var(--accent-soft)] border border-[var(--border)] hover:border-[var(--border-strong)]"
              >
                {t.features?.seeAll ?? 'Voir toutes les fonctionnalités'}
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="border-t border-[var(--border)] py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="flex justify-center gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.3, type: 'spring', stiffness: 300 }}
                  >
                    <Star size={18} className="fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>
              <h2 className="text-[28px] md:text-[36px] font-bold tracking-[-0.03em] mb-2">
                Aimé par les meilleurs.
              </h2>
              <p className="text-[14px] text-[var(--fg-muted)]">Note 4.9/5 par +50 000 utilisateurs.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTIMONIALS.map((r, i) => (
              <ScrollReveal key={i} delay={i * 0.08} direction="up">
                <div className="magnetic-card p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] relative overflow-hidden">
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
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <section className="border-t border-[var(--border)] py-24">
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-[28px] md:text-[36px] font-bold tracking-[-0.03em]">Questions fréquentes</h2>
            </div>
          </ScrollReveal>
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
          <ScrollReveal>
            <h2 className="text-[40px] md:text-[60px] font-bold tracking-[-0.045em] leading-[0.98] mb-5">
              {t.pricing?.title1 ?? 'Commencez en 30 secondes.'}<br />
              <span className="hero-gradient-text">{t.pricing?.title2 ?? 'Gratuit pour toujours.'}</span>
            </h2>
            <p className="text-[17px] text-[var(--fg-muted)] max-w-md mx-auto mb-10">
              {t.pricing?.subtitle ?? 'Aucune carte bancaire requise. Annulez quand vous voulez.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="group h-13 px-8 text-[15px] font-semibold rounded-full bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all inline-flex items-center gap-2.5 shadow-md hover:shadow-xl"
                  style={{ height: 52 }}
                >
                  {t.pricing?.cta ?? 'Commencer gratuitement'}
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
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
              <span className="flex items-center gap-1.5"><Shield size={11} /> Privé</span>
            </div>
          </ScrollReveal>
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
              <Link href="/fonctionnalites" className="hover:text-[var(--fg)] transition-colors">Fonctionnalités</Link>
              <Link href="/tarifs" className="hover:text-[var(--fg)] transition-colors">Tarifs</Link>
              <Link href="/extensions" className="hover:text-[var(--fg)] transition-colors">VS Code</Link>
              <Link href="/integrations" className="hover:text-[var(--fg)] transition-colors">Intégrations</Link>
              <Link href="/changelog" className="hover:text-[var(--fg)] transition-colors">Changelog</Link>
              <Link href="/privacy" className="hover:text-[var(--fg)] transition-colors">{t.footer?.privacy ?? 'Confidentialité'}</Link>
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

/* ─── SPLIT LINE (letter-by-letter reveal) ─── */
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

/* ─── TYPEWRITER LOOP (cycles through words) ─── */
function TypewriterLoop({ words }: { words: string[] }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]

    if (isWaiting) {
      const t = setTimeout(() => {
        setIsWaiting(false)
        setIsDeleting(true)
      }, 2000)
      return () => clearTimeout(t)
    }

    if (isDeleting) {
      if (charIndex === 0) {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % words.length)
        return
      }
      const t = setTimeout(() => setCharIndex((p) => p - 1), 40)
      return () => clearTimeout(t)
    }

    if (charIndex < currentWord.length) {
      const t = setTimeout(() => setCharIndex((p) => p + 1), 60)
      return () => clearTimeout(t)
    }

    // Word fully typed
    const t = setTimeout(() => setIsWaiting(true), 1500)
    return () => clearTimeout(t)
  }, [charIndex, isDeleting, isWaiting, wordIndex, words])

  const displayText = words[wordIndex].slice(0, charIndex)

  return (
    <span className="relative inline-block">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[3px] h-[0.8em] bg-current ml-0.5 align-middle rounded-full"
      />
    </span>
  )
}

/* ─── STAT CARD ─── */
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

/* ─── FAQ ITEM ─── */
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

/* ─── SCROLL REVEAL (generic wrapper) ─── */
function ScrollReveal({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right' }) {
  const dirMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  }
  const offset = dirMap[direction]
  return (
    <motion.div
      initial={{ opacity: 0, ...offset, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ─── TILT CARD (3D perspective on hover) ─── */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 800 }}
      className="transform-gpu"
    >
      {children}
    </motion.div>
  )
}

/* ─── DECORATIVE FEATURE ─── */
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

/* ═══════════════════════════════════════════════════════════════
   ANIMATED CHAT DEMO WINDOW — IMPROVED
   Realistic coding assistant conversation with streaming,
   web search, reasoning, code blocks and citations.
   ═══════════════════════════════════════════════════════════════ */

const DEMO_CYCLES: {
  user: string
  searchLabel: string
  reasoningTime: string
  lines: { text: string; citations?: number[] }[]
  code?: { lang: string; content: string }
  sources: string[]
}[] = [
  {
    user: 'Optimise ce composant React qui lag quand je tape dans l\'input',
    searchLabel: 'Recherche React useMemo useCallback optimization...',
    reasoningTime: '1.8s',
    lines: [
      { text: "Le lag vient probablement d'un re-render de toute la liste à chaque frappe. Voici les optimisations clés :", citations: [] },
      { text: "• <strong>useMemo</strong> sur la liste filtrée pour éviter de la recalculer à chaque render", citations: [1] },
      { text: "• <strong>useCallback</strong> sur le handler onChange pour stabiliser la référence", citations: [1] },
      { text: "• Extraire l'input dans un composant séparé pour isoler son state", citations: [2] },
    ],
    code: {
      lang: 'tsx',
      content: '// 1. Extraire l\'input dans son propre composant\nconst SearchInput = React.memo(({ onSearch }) => {\n  const [value, setValue] = useState("");\n  const handleChange = (e) => {\n    setValue(e.target.value);\n    onSearch(e.target.value);\n  };\n  return <input value={value} onChange={handleChange} />;\n});\n\n// 2. Memoizer la liste filtrée dans le parent\nconst filtered = useMemo(() =>\n  items.filter(i => i.name.includes(query)),\n  [items, query]\n);',
    },
    sources: ['react.dev', 'kentcdodds.com'],
  },
  {
    user: 'Génère une API route Next.js avec validation Zod',
    searchLabel: 'Recherche Next.js App Router Zod validation...',
    reasoningTime: '2.1s',
    lines: [
      { text: 'Dans l\'App Router Next.js, les <strong>Route Handlers</strong> remplacent les API Routes classiques. Voici le pattern avec Zod :', citations: [] },
      { text: '• Définir un schéma Zod pour valider le body entrant', citations: [1] },
      { text: '• Utiliser <code>safeParse</code> pour une validation sans throw', citations: [1] },
      { text: '• Retourner les erreurs formatées avec le bon status code', citations: [2] },
    ],
    code: {
      lang: 'typescript',
      content: 'import { NextRequest, NextResponse } from "next/server";\nimport { z } from "zod";\n\nconst schema = z.object({\n  email: z.string().email(),\n  name: z.string().min(2).max(100),\n});\n\nexport async function POST(req: NextRequest) {\n  const body = await req.json();\n  const parsed = schema.safeParse(body);\n  if (!parsed.success) {\n    return NextResponse.json(\n      { error: parsed.error.flatten() },\n      { status: 400 }\n    );\n  }\n  // ...logique métier\n  return NextResponse.json({ ok: true });\n}',
    },
    sources: ['nextjs.org', 'zod.dev'],
  },
]

function ChatDemoWindow() {
  const [cycleIndex, setCycleIndex] = useState(0)
  const [step, setStep] = useState(0)

  const cycle = DEMO_CYCLES[cycleIndex]
  const maxSteps = 5 + (cycle.code ? 1 : 0)

  // Reset when cycle changes
  useEffect(() => {
    setStep(0)
  }, [cycleIndex])

  useEffect(() => {
    if (step >= maxSteps) {
      const t = setTimeout(() => {
        setCycleIndex((prev) => (prev + 1) % DEMO_CYCLES.length)
      }, 7000)
      return () => clearTimeout(t)
    }
    const delays = [700, 1200, 1400, 1800, 1600, 2000]
    const t = setTimeout(() => setStep((s) => s + 1), delays[step] ?? 1500)
    return () => clearTimeout(t)
  }, [step, maxSteps])

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
      <div className="p-6 md:p-10 space-y-4 min-h-[500px]">
        {/* User message */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              key="user-msg"
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex justify-end"
            >
              <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md bg-[var(--accent)] text-[var(--bg)] text-[14px] leading-relaxed shadow-sm">
                {cycle.user}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status pill — searching */}
        <AnimatePresence>
          {step >= 2 && step <= 3 && (
            <motion.div
              key="searching"
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
                {step === 2 ? cycle.searchLabel : 'Analyse des résultats...'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reasoning */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              key="reasoning"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-[12px] text-[var(--fg-muted)]"
            >
              <span className="w-5 h-5 rounded-md bg-[var(--bg-soft)] border border-[var(--border)] flex items-center justify-center">
                <Brain size={11} className="text-violet-500" />
              </span>
              <span className="font-medium">Réfléchi pendant {cycle.reasoningTime}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Assistant response with streaming blocks */}
        <div className="flex gap-3">
          <AnimatePresence>
            {step >= 4 && (
              <motion.div
                key="avatar"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="shrink-0 mt-0.5"
              >
                <div className="w-7 h-7 rounded-lg glass-card flex items-center justify-center">
                  <NetralLogo size={16} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 4 && (
              <motion.div
                key="response"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex-1 text-[14px] leading-[1.7] text-[var(--fg-soft)] space-y-2 max-w-prose"
              >
                {cycle.lines.map((line, i) => (
                  <DemoLine key={i} show={step >= 4 + Math.floor(i / 2)} delay={i * 0.2}>
                    <span dangerouslySetInnerHTML={{ __html: line.text }} />
                    {line.citations?.map((n) => (
                      <a key={n} data-citation>{n}</a>
                    ))}
                  </DemoLine>
                ))}

                {/* Code block */}
                {step >= 5 && cycle.code && (
                  <DemoLine show delay={0.3}>
                    <StreamingCodeBlock code={cycle.code.content} lang={cycle.code.lang} />
                  </DemoLine>
                )}

                {/* Typing indicator at end */}
                {step >= 5 && (
                  <span className="stream-cursor !mt-1" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sources */}
        <AnimatePresence>
          {step >= 5 && (
            <motion.div
              key="sources"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="ml-10 pt-3 border-t border-[var(--border)]"
            >
              <p className="text-[10px] font-medium text-[var(--fg-muted)] uppercase tracking-wider mb-2">
                Sources ({cycle.sources.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cycle.sources.map((d, i) => (
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

/* ─── STREAMING CODE BLOCK (char-by-char reveal) ─── */
function StreamingCodeBlock({ code, lang }: { code: string; lang: string }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
  }, [code])

  useEffect(() => {
    if (displayed.length < code.length) {
      // Type character by character, with variable speed to simulate streaming
      const speed = displayed.length < 50 ? 15 : 8
      const t = setTimeout(() => {
        setDisplayed(code.slice(0, displayed.length + 1))
      }, speed)
      return () => clearTimeout(t)
    } else {
      setDone(true)
    }
  }, [displayed, code])

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-[var(--border)] bg-[#0d1117] group">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--bg-soft)]/40 border-b border-[var(--border)]">
        <span className="text-[10.5px] font-mono text-[var(--fg-muted)] uppercase tracking-wider">{lang}</span>
      </div>
      <pre className="px-3.5 py-3 text-[12.5px] font-mono text-[#c9d1d9] leading-[1.7] overflow-x-auto max-h-[200px]">
        <code>{displayed}</code>
        {!done && (
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="inline-block w-[8px] h-[14px] bg-[var(--accent)] ml-0.5 align-middle rounded-sm"
          />
        )}
      </pre>
    </div>
  )
}

/* ─── TYPING TEXT (word-by-word reveal) ─── */
function TypingText({ text, speed = 40, loop = false }: { text: string; speed?: number; loop?: boolean }) {
  const [displayed, setDisplayed] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const t = setTimeout(() => {
        setDisplayed(text.slice(0, index + 1))
        setIndex(index + 1)
      }, speed)
      return () => clearTimeout(t)
    }
    // When loop is enabled (for the demo), restart after full typing
    if (loop) return
  }, [index, text, speed, loop])

  // Reset on text change or loop
  useEffect(() => {
    if (loop) {
      setDisplayed('')
      setIndex(0)
    }
  }, [loop])

  return (
    <span>
      {displayed}
      {index < text.length && (
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
          className="inline-block w-[2px] h-[15px] bg-current ml-0.5 align-middle rounded-full"
        />
      )}
    </span>
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
