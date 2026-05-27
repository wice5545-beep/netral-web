'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowRight, ArrowUp, Globe, Brain, Zap, Search, Lock, MessageSquare, Star, Sparkles, Code2, Calendar } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

const featureIcons = [Globe, Brain, MessageSquare, Zap, Search, Lock]
const stats = [{ value: '< 200ms' }, { value: '99.9%' }, { value: '50k+' }]

const SOCIAL_PROOF = [
  { name: 'Marie L.', role: 'Designer', avatar: 'M', text: 'Netral comprend vraiment le contexte. C\'est bluffant.' },
  { name: 'Thomas R.', role: 'Dev Senior', avatar: 'T', text: 'Le meilleur assistant IA que j\'ai utilisé. Rapide et précis.' },
  { name: 'Sarah K.', role: 'Product Manager', avatar: 'S', text: 'Je l\'utilise tous les jours. Indispensable.' },
]

const BENTO_FEATURES = [
  {
    icon: Brain,
    title: 'Mémoire contextuelle',
    desc: 'Netral retient vos préférences, votre métier et vos projets pour des réponses toujours pertinentes.',
    size: 'lg',
    accent: 'from-violet-500/10 to-purple-500/5',
  },
  {
    icon: Globe,
    title: 'Recherche web temps réel',
    desc: 'Accès aux dernières informations du web, directement dans la conversation.',
    size: 'sm',
    accent: 'from-blue-500/10 to-cyan-500/5',
  },
  {
    icon: Zap,
    title: 'Ultra rapide',
    desc: 'Réponses en moins de 200ms grâce à une infrastructure optimisée.',
    size: 'sm',
    accent: 'from-amber-500/10 to-orange-500/5',
  },
  {
    icon: Code2,
    title: 'Agent VS Code',
    desc: 'Extension native qui lit, écrit et corrige votre code directement dans l\'éditeur.',
    size: 'lg',
    accent: 'from-emerald-500/10 to-teal-500/5',
  },
  {
    icon: Calendar,
    title: 'Intégrations',
    desc: 'Gmail, Calendar et plus — Netral agit dans vos outils.',
    size: 'sm',
    accent: 'from-rose-500/10 to-pink-500/5',
  },
  {
    icon: Lock,
    title: 'Privé & sécurisé',
    desc: 'Vos données ne sont jamais utilisées pour entraîner des modèles.',
    size: 'sm',
    accent: 'from-slate-500/10 to-gray-500/5',
  },
]

export function LandingPage() {
  const { t } = useI18n()
  const heroRef = useRef<HTMLDivElement>(null)
  const [landingInput, setLandingInput] = useState('')
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const statsLabels = [t.stats.latency, t.stats.uptime, t.stats.users]

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 nav-pill px-2 py-1.5">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2 px-3 py-1.5">
            <NetralLogo size={20} />
            <span className="font-semibold text-[14px] tracking-[-0.3px]">Netral</span>
          </Link>
          <div className="hidden md:flex items-center">
            <Link href="/fonctionnalites" className="px-3 py-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] rounded-full hover:bg-[var(--accent-soft)] transition-all">{t.nav.features}</Link>
            <Link href="/tarifs" className="px-3 py-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] rounded-full hover:bg-[var(--accent-soft)] transition-all">{t.nav.pricing}</Link>
            <Link href="/extensions" className="px-3 py-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] rounded-full hover:bg-[var(--accent-soft)] transition-all">VS Code</Link>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <LanguageSwitcher />
            <Link href="/login" className="px-3 py-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">{t.nav.login}</Link>
            <Link href="/register">
              <button className="h-8 px-4 text-[13px] font-medium rounded-full bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all shadow-sm">{t.nav.start}</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-36 md:pt-48 pb-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 gradient-orb rounded-full -z-10" />
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] -z-10" style={{ backgroundImage: 'radial-gradient(var(--fg) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-3xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-[12px] text-[var(--fg-muted)] mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t.hero.badge}
          </motion.div>

          {/* Title */}
          <h1 className="text-[clamp(2.8rem,9vw,5.2rem)] font-bold tracking-[-0.045em] leading-[1.0] mb-6">
            <span className="inline-block">
              {t.hero.title1.split('').map((char: string, i: number) => (
                <motion.span key={`t1-${i}`} initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 0.1 + i * 0.025, duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>{char}</motion.span>
              ))}
            </span>
            <br />
            <span className="gradient-text inline-block">
              {t.hero.title2.split('').map((char: string, i: number) => (
                <motion.span key={`t2-${i}`} initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 0.1 + (t.hero.title1.length + i) * 0.025, duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>{char}</motion.span>
              ))}
            </span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-[18px] md:text-[21px] text-[var(--fg-muted)] max-w-lg mx-auto mb-10 leading-[1.6]">
            {t.hero.subtitle}
          </motion.p>

          {/* Hero input — premium */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }} className="w-full max-w-xl mx-auto">
            <div className="relative group">
              {/* Glow ring on focus */}
              <div className="absolute -inset-[1px] rounded-[14px] bg-gradient-to-r from-violet-500/20 via-transparent to-orange-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative glass-card shadow-colored hover:shadow-lg transition-all duration-300">
                <input
                  value={landingInput}
                  onChange={(e) => setLandingInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && landingInput.trim()) setShowLoginPopup(true) }}
                  placeholder={t.hero.cta}
                  className="w-full h-14 px-5 pr-14 bg-transparent text-[15px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none rounded-xl"
                />
                <button
                  onClick={() => { if (landingInput.trim()) setShowLoginPopup(true) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-[var(--accent)] text-[var(--bg)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
                >
                  <ArrowUp size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Social proof — avatars */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="flex items-center justify-center gap-3 mt-7">
            <div className="flex -space-x-2">
              {['M', 'T', 'S', 'A', 'L'].map((l, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-[var(--bg)] bg-gradient-to-br from-violet-400 to-orange-400 flex items-center justify-center text-[10px] font-bold text-white" style={{ zIndex: 5 - i }}>
                  {l}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[var(--fg-muted)]">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
              </div>
              <span>+50k utilisateurs</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Login popup */}
        {showLoginPopup && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowLoginPopup(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', damping: 25 }} className="bg-[var(--bg-elevated)] rounded-2xl p-7 w-full max-w-sm border border-[var(--border)] shadow-[var(--shadow-xl)]">
                <div className="flex justify-center mb-4"><NetralLogo size={32} /></div>
                <h3 className="text-[18px] font-bold mb-1.5 text-center">{t.chat?.loginTitle ?? 'Connectez-vous'}</h3>
                <p className="text-[13px] text-[var(--fg-muted)] text-center mb-6">{t.chat?.loginSubtitle ?? 'Pour envoyer votre message'}</p>
                <div className="space-y-2.5">
                  <Link href={`/login?q=${encodeURIComponent(landingInput)}`} className="block">
                    <button className="w-full h-11 rounded-xl bg-[var(--accent)] text-[var(--bg)] text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-all">{t.chat?.signIn ?? 'Se connecter'}</button>
                  </Link>
                  <Link href={`/register?q=${encodeURIComponent(landingInput)}`} className="block">
                    <button className="w-full h-11 rounded-xl border border-[var(--border)] text-[14px] font-medium hover:bg-[var(--bg-soft)] transition-all">{t.chat?.createAccount ?? 'Créer un compte'}</button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </section>

      {/* Demo */}
      <section className="max-w-4xl mx-auto px-6 pb-28">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="relative">
          <div className="absolute -inset-4 gradient-orb rounded-3xl opacity-[0.06] blur-3xl -z-10" />
          <div className="glass-card shadow-colored overflow-hidden">
            <div className="h-11 flex items-center gap-2 px-4 border-b border-[var(--glass-border)] bg-[var(--bg-soft)]/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1.5 rounded-lg bg-[var(--bg)]/60 border border-[var(--glass-border)] text-[11px] font-mono text-[var(--fg-subtle)]">
                  <Lock size={9} className="inline text-emerald-500 mr-1.5" />netral.app/chat
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex justify-end">
                <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-br-md bg-[var(--accent)] text-[var(--bg)] text-[14px] leading-relaxed shadow-sm">{t.demo.userMsg}</div>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[var(--fg-muted)]">
                <Globe size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
                <span>{t.demo.searching}</span>
              </div>
              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5"><NetralLogo size={24} /></div>
                <div className="flex-1 text-[14px] leading-[1.7] text-[var(--fg-soft)] space-y-2">
                  <p>{t.demo.response1}</p>
                  <p><strong className="text-[var(--fg)]">GPT-5 Turbo</strong> {t.demo.response2}</p>
                  <p><strong className="text-[var(--fg)]">Claude 4.5</strong> {t.demo.response3}<span className="stream-cursor" /></p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <p className="text-[34px] md:text-[44px] font-bold tracking-[-0.04em]">{s.value}</p>
              <p className="text-[12px] text-[var(--fg-muted)] mt-1.5 uppercase tracking-wider">{statsLabels[i]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features — Premium Bento */}
      <section className="border-t border-[var(--border)] py-28">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-[34px] md:text-[46px] font-bold tracking-[-0.035em] mb-4">{t.features.title}</h2>
            <p className="text-[16px] text-[var(--fg-muted)] max-w-md mx-auto">{t.features.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BENTO_FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={`group relative p-6 rounded-2xl border border-[var(--border)] bg-gradient-to-br ${f.accent} hover:border-[var(--border-strong)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] overflow-hidden ${f.size === 'lg' ? 'md:col-span-2' : ''}`}
                >
                  {/* Subtle corner glow */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none" />

                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-[var(--border-strong)] transition-all duration-300 shadow-[var(--shadow-xs)]">
                    <Icon size={18} className="text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors" />
                  </div>
                  <h3 className="text-[15px] font-semibold mb-1.5 tracking-[-0.01em]">{f.title}</h3>
                  <p className="text-[13px] text-[var(--fg-muted)] leading-[1.6]">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <Link href="/fonctionnalites" className="inline-flex items-center gap-2 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors group px-4 py-2 rounded-full hover:bg-[var(--accent-soft)]">
              {t.features.seeAll}
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Social proof — testimonials */}
      <section className="border-t border-[var(--border)] py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="flex justify-center gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-[13px] text-[var(--fg-muted)]">Noté 4.9/5 par nos utilisateurs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SOCIAL_PROOF.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/50 hover:border-[var(--border-strong)] transition-all duration-200"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} size={11} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-[13.5px] text-[var(--fg)] leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-orange-400 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold">{r.name}</p>
                    <p className="text-[11px] text-[var(--fg-muted)]">{r.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border)] py-28">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-[34px] md:text-[46px] font-bold tracking-[-0.035em] mb-4">
              {t.pricing.title1}<br /><span className="gradient-text">{t.pricing.title2}</span>
            </h2>
            <p className="text-[16px] text-[var(--fg-muted)] max-w-md mx-auto mb-10">{t.pricing.subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <button className="group h-12 px-7 text-[15px] font-semibold rounded-full bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2 shadow-md hover:shadow-lg">
                  {t.pricing.cta}
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/tarifs">
                <button className="h-12 px-7 text-[15px] font-medium rounded-full border border-[var(--border)] hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)] transition-all">{t.pricing.seePricing}</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-[13px] text-[var(--fg-muted)]">
            <NetralLogo size={16} />
            <span className="font-medium">Netral</span>
            <span className="text-[var(--fg-subtle)]">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-[var(--fg-muted)]">
            <Link href="/fonctionnalites" className="hover:text-[var(--fg)] transition-colors">{t.nav.features}</Link>
            <Link href="/tarifs" className="hover:text-[var(--fg)] transition-colors">{t.nav.pricing}</Link>
            <Link href="/extensions" className="hover:text-[var(--fg)] transition-colors">VS Code</Link>
            <Link href="/privacy" className="hover:text-[var(--fg)] transition-colors">{t.footer.privacy}</Link>
            <Link href="/changelog" className="hover:text-[var(--fg)] transition-colors">{t.footer.changelog}</Link>
            <Link href="/terms" className="hover:text-[var(--fg)] transition-colors">CGU</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
