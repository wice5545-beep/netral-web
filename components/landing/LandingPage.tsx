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
  { q: 'En quoi Netral diffère de ChatGPT ?', a: "Netral combine plusieurs modèles (Mistral, Gemini) avec une mémoire persistante et une recherche web temps réel native. Pas de plugins à activer — tout est intégré." },
  { q: 'Mes données sont-elles utilisées pour entraîner des modèles ?', a: "Jamais. Vos messages restent strictement privés. Aucun fournisseur tiers n'a accès aux conversations pour entraîner ses modèles." },
  { q: 'Puis-je essayer gratuitement ?', a: "Oui. Le plan Free vous donne accès à Netral IA (1 message/jour). Les plans payants commencent à 5€/mois." },
  { q: "L'extension VS Code est-elle disponible ?", a: "Oui, gratuite et open-source. Elle se synchronise avec votre compte Netral via un token API généré depuis les paramètres." },
]

const MODELS_LOGOS = [
  { name: 'Mistral Large', tag: 'Premium' },
  { name: 'Gemini 2.5', tag: 'Pro' },
  { name: 'Mistral', tag: 'Standard' },
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
   STARS DATA
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
const STARFIELD = generateStars(120)

/* ──────────────────────────────────────────────────────────────
   ORB DATA — animated background orbs
   ────────────────────────────────────────────────────────────── */
const ORBS = [
  { color: '#7c3aed', size: 600, x: '20%', y: '30%', duration: 20, delay: 0, blur: 120 },
  { color: '#ec4899', size: 500, x: '80%', y: '60%', duration: 25, delay: -5, blur: 100 },
  { color: '#3b82f6', size: 450, x: '50%', y: '20%', duration: 22, delay: -10, blur: 110 },
  { color: '#f59e0b', size: 350, x: '10%', y: '80%', duration: 18, delay: -15, blur: 90 },
]

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export function LandingPage() {
  const { t } = useI18n()
  const heroRef = useRef<HTMLDivElement>(null)
  const [landingInput, setLandingInput] = useState('')
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92])

  // Mouse position for spotlight
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const spotX = useSpring(mouseX, { stiffness: 50, damping: 30 })
  const spotY = useSpring(mouseY, { stiffness: 50, damping: 30 })

  // Custom cursor
  const cursorX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const cursorY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  const [isHovering, setIsHovering] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
    
  }

  const statsLabels = [t.stats?.latency ?? 'Latence', t.stats?.uptime ?? 'Uptime', t.stats?.users ?? 'Utilisateurs']

  const globalScroll = useScroll()
  const scrollProgressBar = useTransform(globalScroll.scrollYProgress, [0, 0.8], ['0%', '100%'])

  return (
    <div
      className="min-h-screen bg-[var(--bg)] text-[var(--fg)] overflow-x-hidden noise-soft"
      onMouseMove={handleMouseMove}
    >
      {/* ─── CUSTOM CURSOR (desktop only) ─── */}
      <motion.div
        className="fixed pointer-events-none z-[9999] hidden md:block"
        style={{
          left: useMotionTemplate`calc(${cursorX.get() * 100}% + 0px)`,
          top: useMotionTemplate`calc(${cursorY.get() * 100}% + 0px)`,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          opacity: cursorVisible ? 1 : 0,
          borderColor: isHovering ? 'rgba(124,58,237,0.5)' : 'rgba(124,58,237,0.2)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div
          className={`rounded-full border transition-all duration-300 ${isHovering ? 'w-6 h-6 border-2 bg-violet-500/10' : 'w-8 h-8 border'}`}
          style={{ borderColor: 'inherit' }}
        />
      </motion.div>

      {/* ─── SCROLL PROGRESS BAR ─── */}
      <motion.div
        className="fixed top-0 left-0 h-[2.5px] z-[60] pointer-events-none rounded-r-full"
        style={{
          width: scrollProgressBar,
          background: 'linear-gradient(90deg, #7c3aed, #ec4899, #f97316)',
          boxShadow: '0 0 12px rgba(124,58,237,0.4)',
        }}
      />

      <MarketingNav />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section
        ref={heroRef}
        className="relative pt-32 md:pt-44 pb-24 overflow-hidden"
      >
        <AuroraBackground intensity="strong" />

        {/* ─── ANIMATED ORBS ─── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {ORBS.map((orb, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: orb.x,
                top: orb.y,
                width: orb.size,
                height: orb.size,
                background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                filter: `blur(${orb.blur}px)`,
                opacity: 0.15,
              }}
              animate={{
                x: [0, 40, -30, 20, 0],
                y: [0, -30, 20, -15, 0],
                scale: [1, 1.1, 0.9, 1.05, 1],
              }}
              transition={{
                duration: orb.duration,
                delay: orb.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* ─── STARFIELD ─── */}
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
                opacity: [star.opacity, star.opacity * 3, star.opacity],
                scale: [1, 2, 1],
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

        {/* ─── FLOATING ICONS ─── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {FLOATING_ICONS.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                className={`absolute ${item.color}`}
                style={{ left: item.x, top: item.y }}
                animate={{
                  y: [0, -25, 0, 20, 0],
                  x: [0, 12, -8, -12, 0],
                  rotate: [0, 8, -5, 10, 0],
                  opacity: [0.3, 0.6, 0.3, 0.5, 0.3],
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

        {/* ─── SPOTLIGHT ─── */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.1]"
          style={{
            background: useMotionTemplate`radial-gradient(700px circle at ${spotX.get() * 100}% ${spotY.get() * 100}%, rgba(124,58,237,0.6), rgba(236,72,153,0.2), transparent 60%)`,
          }}
        />

        {/* ─── GRID MESH PATTERN ─── */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="max-w-4xl mx-auto px-6 text-center relative"
        >
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card text-[12.5px] text-[var(--fg-muted)] mb-8 group cursor-default hover-lift"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="tracking-wide font-medium">{t.hero?.badge ?? 'Netral IA — Disponible maintenant'}</span>
            <ArrowRight size={11} className="text-[var(--fg-subtle)] group-hover:translate-x-0.5 transition-transform opacity-60 group-hover:opacity-100" />
          </motion.div>

          {/* Title */}
          <h1 className="text-[clamp(3.5rem,10vw,7rem)] font-bold tracking-[-0.05em] leading-[0.95] mb-8">
            <SplitLine text={t.hero?.title1 ?? "L'IA qui"} delayBase={0.1} />
            {' '}
            <span className="hero-gradient-text inline-block">
              <ChatGPTLoop words={TYPING_WORDS} />
            </span>
            <br />
            <span className="inline-block">
              <SplitLine text={t.hero?.title2 ?? 'avec vous.'} delayBase={0.35} />
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[19px] md:text-[22px] text-[var(--fg-muted)] max-w-xl mx-auto mb-12 leading-[1.6]"
          >
            {t.hero?.subtitle ?? "Un assistant qui consulte le web en temps réel, retient ce qui compte et raisonne avec vous."}
          </motion.p>

          {/* HERO INPUT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto mb-8"
          >
            <div
              className="mega-input glass-card overflow-hidden glow-accent"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="flex items-center gap-2 px-2.5 py-2.5 relative">
                <button
                  onClick={() => landingInput.trim() && setShowLoginPopup(true)}
                  className="shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--accent-soft)] transition-all"
                  aria-label="Ajouter"
                >
                  <Plus size={17} />
                </button>
                <input
                  value={landingInput}
                  onChange={(e) => setLandingInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && landingInput.trim()) setShowLoginPopup(true) }}
                  placeholder={t.hero?.cta ?? "Demandez n'importe quoi à Netral..."}
                  className="flex-1 h-12 bg-transparent text-[16px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none"
                />
                <button
                  onClick={() => landingInput.trim() && setShowLoginPopup(true)}
                  className="shrink-0 h-10 w-10 rounded-xl bg-[var(--accent)] text-[var(--bg)] flex items-center justify-center hover:scale-[1.08] active:scale-95 transition-all shadow-lg hover:shadow-xl"
                  aria-label="Envoyer"
                >
                  <ArrowUp size={16} strokeWidth={2.5} />
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--glass-border)] px-4 py-2.5 text-[11.5px] text-[var(--fg-subtle)]">
                <div className="flex items-center gap-2">
                  <Cpu size={10} />
                  <span className="font-medium">Netral</span>
                  <span className="opacity-40">·</span>
                  <Globe size={10} />
                  <span>Web</span>
                </div>
                <span className="hidden sm:flex items-center gap-1.5">
                  <span className="kbd text-[9px]">↵</span>
                  pour envoyer
                </span>
              </div>
            </div>
          </motion.div>

          {/* AI Thinking Preview */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl mx-auto mb-8"
          >
            <AIThinkingPreview />
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <div className="flex -space-x-2">
              {['M', 'T', 'S', 'A', 'L'].map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.08, type: 'spring', stiffness: 300 }}
                  className="w-8 h-8 rounded-full border-2 border-[var(--bg)] flex items-center justify-center text-[10px] font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, hsl(${260 + i * 15}, 80%, 60%), hsl(${20 + i * 10}, 85%, 55%))`,
                    zIndex: 5 - i,
                  }}
                >
                  {l}
                </motion.div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-[12.5px] text-[var(--fg-muted)]">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold">4.9/5</span>
              <span className="text-[var(--fg-subtle)]">— +50 000 utilisateurs</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.span
            animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-[var(--fg-subtle)]"
          >
            <ChevronDown size={18} strokeWidth={1.5} />
          </motion.span>
          <span className="text-[10px] text-[var(--fg-subtle)] uppercase tracking-[0.2em] font-medium">Défiler</span>
        </motion.div>

        {/* Login popup */}
        <AnimatePresence>
          {showLoginPopup && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setShowLoginPopup(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-50" />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(8px)' }}
                  transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                  className="glass-card p-8 w-full max-w-sm pointer-events-auto shadow-colored relative overflow-hidden"
                >
                  <div className="beam-scan" style={{ ['--beam-delay' as string]: '0.3s' }} />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                    className="flex justify-center mb-5 relative"
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)' }}>
                      <NetralLogo size={32} />
                    </div>
                  </motion.div>
                  <h3 className="text-[20px] font-bold mb-2 text-center tracking-[-0.02em]">Connectez-vous pour continuer</h3>
                  <p className="text-[13.5px] text-[var(--fg-muted)] text-center mb-7">Vos messages sont privés et chiffrés.</p>
                  <div className="space-y-3">
                    <Link href={`/login?q=${encodeURIComponent(landingInput)}`} className="block">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full h-12 rounded-xl bg-[var(--accent)] text-[var(--bg)] text-[14px] font-semibold transition-all shadow-md hover:shadow-lg"
                      >
                        Se connecter
                      </motion.button>
                    </Link>
                    <Link href={`/register?q=${encodeURIComponent(landingInput)}`} className="block">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full h-12 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/50 text-[14px] font-medium hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)] transition-all"
                      >
                        Créer un compte
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </section>

      {/* ═══════════════════ MARQUEE ═══════════════════ */}
      <section className="py-12 border-y border-[var(--border)] bg-[var(--bg-soft)]/30 relative overflow-hidden">
        <p className="text-center text-[11px] uppercase tracking-[0.2em] text-[var(--fg-subtle)] mb-6 font-semibold">
          Propulsé par les meilleurs modèles · Intégré à vos outils
        </p>
        <Marquee speed={45}>
          {MODELS_LOGOS.map((m, i) => (
            <motion.div
              key={`${m.name}-${i}`}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border-strong)] hover:shadow-sm transition-all cursor-default"
            >
              <span className="font-semibold text-[var(--fg)]">{m.name}</span>
              <span className="text-[10px] font-mono text-[var(--fg-subtle)] uppercase tracking-wider bg-[var(--accent-soft)] px-1.5 py-0.5 rounded">{m.tag}</span>
            </motion.div>
          ))}
        </Marquee>
      </section>

      {/* ═══════════════════ DEMO CHAT WINDOW ═══════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-28 md:py-36">
        <ScrollReveal direction="up">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] text-[11px] font-medium text-[var(--fg-muted)] mb-5 uppercase tracking-wider">
              <Terminal size={12} className="text-violet-500" />
              Démo interactive
            </div>
            <h2 className="text-[28px] md:text-[38px] font-bold tracking-[-0.03em] mb-3">Voyez Netral en action</h2>
            <p className="text-[15px] text-[var(--fg-muted)] max-w-md mx-auto">Recherche web, code, analyse — tout en un seul assistant.</p>
          </div>
          <ChatDemoWindow />
        </ScrollReveal>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section className="border-y border-[var(--border)] py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), rgba(236,72,153,0.04), transparent 70%)' }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <StatCard display="< 200ms" label={statsLabels[0]} />
          <StatCard display="99.9%" label={statsLabels[1]} />
          <StatCard value={50000} suffix="+" label={statsLabels[2]} />
        </div>
      </section>

      {/* ═══════════════════ BENTO FEATURES ═══════════════════ */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] text-[11px] font-medium text-[var(--fg-muted)] mb-5 uppercase tracking-wider">
                <Sparkles size={11} className="text-violet-500" />
                Fonctionnalités
              </div>
              <h2 className="text-[40px] md:text-[56px] font-bold tracking-[-0.045em] mb-5 leading-[1.05]">
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
                      className={`magnetic-card group relative p-7 rounded-2xl border border-[var(--border)] bg-gradient-to-br ${f.accent} bg-[var(--bg-elevated)] overflow-hidden ${f.span === 'lg' ? 'md:col-span-2' : ''}`}
                      style={{ minHeight: 240 }}
                    >
                      <div className="beam-scan" style={{ ['--beam-delay' as string]: `${i * 0.7}s` }} />
                      <DecorativeFeature kind={f.decorative} />
                      <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${f.iconBg} border border-[var(--border)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-400`}>
                        <Icon size={20} className="text-[var(--fg)]" strokeWidth={1.8} />
                      </div>
                      <h3 className="relative z-10 text-[18px] font-semibold mb-2.5 tracking-[-0.01em]">{f.title}</h3>
                      <p className="relative z-10 text-[14px] text-[var(--fg-muted)] leading-[1.65] max-w-xs">
                        {f.desc}
                      </p>
                    </div>
                  </ScrollReveal>
                </TiltCard>
              )
            })}
          </div>

          <ScrollReveal delay={0.2} direction="up">
            <div className="text-center mt-14">
              <Link
                href="/fonctionnalites"
                className="inline-flex items-center gap-2 text-[14px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors group px-6 py-3 rounded-full hover:bg-[var(--accent-soft)] border border-[var(--border)] hover:border-[var(--border-strong)]"
              >
                {t.features?.seeAll ?? 'Voir toutes les fonctionnalités'}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="border-t border-[var(--border)] py-28 relative">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <div className="flex justify-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: -30 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.4, type: 'spring', stiffness: 300 }}
                  >
                    <Star size={20} className="fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>
              <h2 className="text-[32px] md:text-[42px] font-bold tracking-[-0.035em] mb-3">
                Aimé par les meilleurs.
              </h2>
              <p className="text-[15px] text-[var(--fg-muted)]">Note 4.9/5 par +50 000 utilisateurs.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((r, i) => (
              <ScrollReveal key={i} delay={i * 0.08} direction="up">
                <div className="magnetic-card p-7 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] relative overflow-hidden card-interactive">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-[15px] text-[var(--fg)] leading-[1.65] mb-6 font-medium">"{r.text}"</p>
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center text-[13px] font-bold text-white shrink-0 shadow-md`}>
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
      <section className="border-t border-[var(--border)] py-28">
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-[32px] md:text-[42px] font-bold tracking-[-0.035em]">Questions fréquentes</h2>
            </div>
          </ScrollReveal>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="relative border-t border-[var(--border)] py-36 overflow-hidden">
        <AuroraBackground intensity="subtle" showGrid={false} />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.08), transparent 60%)' }} />
        </motion.div>
        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <ScrollReveal direction="up">
            <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.05em] leading-[0.98] mb-6">
              {t.pricing?.title1 ?? 'Commencez en 30 secondes.'}<br />
              <span className="hero-gradient-text">{t.pricing?.title2 ?? 'Gratuit pour toujours.'}</span>
            </h2>
            <p className="text-[18px] text-[var(--fg-muted)] max-w-md mx-auto mb-12">
              {t.pricing?.subtitle ?? 'Aucune carte bancaire requise. Annulez quand vous voulez.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className="group h-14 px-10 text-[16px] font-semibold rounded-full bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all inline-flex items-center gap-3 shadow-lg hover:shadow-xl hover:shadow-[var(--accent)]/20"
                >
                  {t.pricing?.cta ?? 'Commencer gratuitement'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/tarifs">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-14 px-10 text-[16px] font-medium rounded-full border border-[var(--border)] hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)] transition-all"
                >
                  {t.pricing?.seePricing ?? 'Voir les tarifs'}
                </motion.button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 mt-12 text-[13px] text-[var(--fg-subtle)]">
              <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" strokeWidth={3} /> Sans CB</span>
              <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" strokeWidth={3} /> Annulable</span>
              <span className="flex items-center gap-1.5"><Shield size={12} /> Privé</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[var(--border)] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)' }}>
                <NetralLogo size={20} />
              </div>
              <span className="font-bold text-[15px]">Netral</span>
              <span className="text-[12px] text-[var(--fg-subtle)] ml-1">© {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center flex-wrap gap-x-7 gap-y-2 text-[13px] text-[var(--fg-muted)]">
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

/* ─── SPLIT LINE — letter by letter with stagger ─── */
function SplitLine({ text, delayBase }: { text: string; delayBase: number }) {
  return (
    <span className="inline-block">
      {text.split('').map((char, i) => (
        <motion.span
          key={`c-${i}`}
          initial={{ opacity: 0, y: 32, filter: 'blur(14px)', rotateX: 20 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0 }}
          transition={{
            delay: delayBase + i * 0.025,
            duration: 0.6,
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

/* ─── CHATGPT-STYLE TEXT LOOP ─── */
function ChatGPTLoop({ words }: { words: string[] }) {
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <span className="relative inline-block">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[wordIndex]}
          initial={{ opacity: 0, y: 14, filter: 'blur(8px)', scale: 0.95 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
          exit={{ opacity: 0, y: -14, filter: 'blur(8px)', scale: 1.05 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {words[wordIndex]}
        </motion.span>
      </AnimatePresence>
      <motion.span
        animate={{ opacity: [0.8, 0.05, 0.8] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-block w-[3px] h-[0.75em] bg-current ml-0.5 align-middle rounded-full"
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <p className="text-[48px] md:text-[64px] font-bold tracking-[-0.05em] leading-none">
        <AnimatedCounter value={value} display={display} suffix={suffix} className="hero-gradient-text" />
      </p>
      <p className="text-[13px] text-[var(--fg-muted)] mt-3 uppercase tracking-[0.18em] font-semibold">
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden hover:border-[var(--border-strong)] transition-all duration-200"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-[15px] font-semibold tracking-[-0.005em]">{q}</span>
        <motion.span
          animate={{ rotate: open ? 135 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-[14.5px] text-[var(--fg-muted)] leading-[1.7]">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── SCROLL REVEAL ─── */
function ScrollReveal({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right' }) {
  const dirMap = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 },
  }
  const offset = dirMap[direction]
  return (
    <motion.div
      initial={{ opacity: 0, ...offset, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ─── TILT CARD (3D perspective) ─── */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [2, -2]), { stiffness: 200, damping: 40 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-2, 2]), { stiffness: 200, damping: 40 })

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
      style={{ rotateX, rotateY, perspective: 1000 }}
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
      <div aria-hidden className="absolute top-6 right-6 opacity-50 group-hover:opacity-100 transition-opacity duration-400">
        <div className="flex flex-col gap-1.5">
          {['Designer', 'TypeScript', 'Paris'].map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.45 }}
              className="text-[9.5px] px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-500 dark:text-violet-300 border border-violet-500/20 self-end font-mono"
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
      <div aria-hidden className="absolute top-6 right-6 opacity-60 group-hover:opacity-100 transition-opacity duration-400">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        >
          <Globe size={40} className="text-blue-500/40" />
        </motion.div>
      </div>
    )
  }
  if (kind === 'speed') {
    return (
      <div aria-hidden className="absolute top-6 right-6 opacity-60 flex flex-col items-end gap-0.5 font-mono text-[9.5px] text-amber-500/80">
        <span>180ms</span>
        <span>192ms</span>
        <span>201ms</span>
      </div>
    )
  }
  if (kind === 'code') {
    return (
      <div aria-hidden className="absolute top-6 right-6 opacity-50 group-hover:opacity-80 transition-opacity duration-400 font-mono text-[10px] text-emerald-500/80 leading-tight">
        <div>{'function fix() {'}</div>
        <div className="ml-2">{'// done by Netral'}</div>
        <div>{'}'}</div>
      </div>
    )
  }
  if (kind === 'integrations') {
    return (
      <div aria-hidden className="absolute top-6 right-6 opacity-70 flex gap-1.5">
        {['✉️', '📅', '📁'].map((e, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.12 }}
            className="text-[15px]"
          >
            {e}
          </motion.span>
        ))}
      </div>
    )
  }
  if (kind === 'privacy') {
    return (
      <div aria-hidden className="absolute top-6 right-6 opacity-60 group-hover:opacity-100 transition-opacity duration-400">
        <Shield size={32} className="text-slate-500/60" />
      </div>
    )
  }
  return null
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATED CHAT DEMO WINDOW
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
      { text: "Dans l'App Router Next.js, les <strong>Route Handlers</strong> remplacent les API Routes classiques. Voici le pattern avec Zod :", citations: [] },
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

/* ─── AI THINKING PREVIEW (petit aperçu du raisonnement) ─── */
const THINKING_CYCLES = [
  [
    { phase: 'Recherche web…', detail: 'Interrogation des sources en temps réel' },
    { phase: 'Analyse du contexte', detail: 'Mémoire : vous êtes développeur TypeScript' },
    { phase: 'Raisonnement', detail: 'Évaluation multi-angle des approches' },
    { phase: 'Synthèse', detail: 'Rédaction de la réponse avec citations' },
  ],
  [
    { phase: 'Scan des fichiers…', detail: 'Analyse du workspace VS Code' },
    { phase: 'Recherche web…', detail: 'Documentation Next.js 15 + React 19' },
    { phase: 'Validation', detail: 'Vérification syntaxe et bonnes pratiques' },
    { phase: 'Génération', detail: 'Code prêt à être intégré' },
  ],
]

function AIThinkingPreview() {
  const [cycleIndex, setCycleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const cycle = THINKING_CYCLES[cycleIndex]

  useEffect(() => {
    const advance = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= cycle.length - 1) {
          setCycleIndex((c) => (c + 1) % THINKING_CYCLES.length)
          return 0
        }
        return prev + 1
      })
    }, 2000)
    return () => clearInterval(advance)
  }, [cycle.length])

  return (
    <div className="glass-card rounded-xl p-4 text-left overflow-hidden relative">
      <div className="beam-scan" style={{ ['--beam-delay' as string]: '1s' }} />
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-violet-400"
          />
        </motion.div>
        <span className="text-[11px] font-medium text-[var(--fg-muted)] uppercase tracking-[0.15em]">
          Netral IA · Thinking
        </span>
      </div>
      <div className="space-y-0.5">
        {cycle.map((step, i) => {
          const isActive = i === stepIndex
          const isDone = i < stepIndex
          const isPending = i > stepIndex
          return (
            <motion.div
              key={`${cycleIndex}-${i}`}
              animate={{ opacity: isPending ? 0.2 : 1 }}
              className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all ${isActive ? 'bg-violet-500/8 border border-violet-500/15' : isDone ? 'text-[var(--fg-muted)]' : 'text-[var(--fg-subtle)]'}`}
            >
              <span className="shrink-0">
                {isDone ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500"
                  >
                    <Check size={11} strokeWidth={3} />
                  </motion.span>
                ) : isActive ? (
                  <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-500/15 text-violet-500"
                  >
                    <Brain size={12} strokeWidth={2} />
                  </motion.span>
                ) : (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--bg-soft)] text-[var(--fg-subtle)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-current/30" />
                  </span>
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-[12px] font-medium ${isDone ? 'line-through decoration-emerald-500/30' : ''} ${isActive ? 'text-violet-400' : ''}`}>
                  {step.phase}
                </p>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-[10px] text-[var(--fg-subtle)] mt-0.5 truncate"
                  >
                    {step.detail}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function ChatDemoWindow() {
  const [cycleIndex, setCycleIndex] = useState(0)
  const [step, setStep] = useState(0)
  const cycle = DEMO_CYCLES[cycleIndex]
  const maxSteps = 5 + (cycle.code ? 1 : 0)

  useEffect(() => { setStep(0) }, [cycleIndex])

  useEffect(() => {
    if (step >= maxSteps) {
      const t = setTimeout(() => {
        setCycleIndex((prev) => (prev + 1) % DEMO_CYCLES.length)
      }, 7000)
      return () => clearTimeout(t)
    }
    const delays = [800, 1400, 1500, 1900, 1700, 2200]
    const t = setTimeout(() => setStep((s) => s + 1), delays[step] ?? 1500)
    return () => clearTimeout(t)
  }, [step, maxSteps])

  return (
    <div className="window-mock relative">
      {/* Title bar */}
      <div className="h-12 flex items-center gap-2.5 px-5 border-b border-[var(--border)] bg-[var(--bg-soft)]/60 rounded-t-2xl">
        <div className="flex gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f57]" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#febc2e]" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1.5 rounded-lg bg-[var(--bg)]/70 border border-[var(--glass-border)] text-[11px] font-mono text-[var(--fg-muted)] flex items-center gap-2">
            <Lock size={10} className="text-emerald-500" />
            netral.app/chat
          </div>
        </div>
        <div className="w-12" />
      </div>

      {/* Chat area */}
      <div className="bg-[var(--bg-elevated)] border-x border-[var(--border)] p-6 space-y-6 rounded-b-2xl border-b">
        {/* User message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
          className="flex justify-end"
        >
          <div className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5 bg-[var(--accent)] text-[var(--bg)] text-[14px] leading-[1.55] shadow-sm">
            {cycle.user}
          </div>
        </motion.div>

        {/* Thinking label + search */}
        <AnimatePresence>
          {step >= 2 && step < 3 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] text-[11.5px] text-[var(--fg-muted)]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                >
                  <Globe size={11} className="text-violet-500" />
                </motion.div>
                <span className="streaming-shimmer">{cycle.searchLabel}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Assistant response */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)' }}>
                <NetralLogo size={14} />
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                {/* Lines */}
                {cycle.lines.map((line, li) => (
                  <motion.p
                    key={li}
                    initial={{ opacity: 0, x: -6 }}
                    animate={step >= 4 + li * 0.5 ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4 }}
                    className="text-[14px] text-[var(--fg)] leading-[1.6]"
                    dangerouslySetInnerHTML={{ __html: line.text }}
                  />
                ))}

                {/* Code block */}
                {step >= 4 && cycle.code && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={step >= 5 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="relative rounded-lg bg-[var(--bg-soft)] border border-[var(--border)] overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] text-[10px] font-mono text-[var(--fg-subtle)]">
                      <span>{cycle.code.lang}</span>
                      <span className="text-[var(--fg-subtle)]">Copier</span>
                    </div>
                    <pre className="p-4 text-[12px] font-mono text-[var(--fg)] leading-[1.6] overflow-x-auto">
                      <code>{cycle.code.content}</code>
                    </pre>
                    {step < 6 && <motion.span className="stream-cursor" />}
                  </motion.div>
                )}

                {/* Sources */}
                {step >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2"
                  >
                    {cycle.sources.map((src, si) => (
                      <span
                        key={si}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] text-[11px] text-[var(--fg-muted)]"
                      >
                        <Globe size={10} />
                        {src}
                        <span className="font-mono text-[9px] text-[var(--fg-subtle)]">[{si + 1}]</span>
                      </span>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}