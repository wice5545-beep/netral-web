'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowRight, ArrowUp } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { EarthIcon } from '@/components/ui/earth'
import { BrainIcon } from '@/components/ui/brain'
import { MessageSquareIcon } from '@/components/ui/message-square'
import { ZapIcon } from '@/components/ui/zap'
import { SearchIcon } from '@/components/ui/search'
import { LockIcon } from '@/components/ui/lock'
import { SparklesIcon } from '@/components/ui/sparkles'
import { AutoAnimate } from '@/components/ui/AutoAnimate'

const featureIcons = [EarthIcon, BrainIcon, MessageSquareIcon, ZapIcon, SearchIcon, LockIcon]
const stats = [{ value: '< 200ms' }, { value: '99.9%' }, { value: '50k+' }]

export function LandingPage() {
  const { t } = useI18n()
  const heroRef = useRef<HTMLDivElement>(null)
  const [landingInput, setLandingInput] = useState('')
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const statsLabels = [t.stats.latency, t.stats.uptime, t.stats.users]

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[var(--bg)]/80 border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <NetralLogo size={22} />
            <span className="font-semibold text-[15px]">Netral</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/fonctionnalites" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">{t.nav.features}</Link>
            <Link href="/tarifs" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">{t.nav.pricing}</Link>
            <Link href="/extensions" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">VS Code</Link>
            <Link href="/login" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">{t.nav.login}</Link>
            <LanguageSwitcher />
          </div>
          <Link href="/register">
            <button className="h-8 px-4 text-[13px] font-medium rounded-lg bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all active:scale-95">{t.nav.start}</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-32 md:pt-44 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-[var(--accent-soft)] to-transparent rounded-full blur-3xl opacity-40" />
        </div>

        <motion.div style={{ y: heroY }} className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-soft)] border border-[var(--border)] text-[12px] text-[var(--fg-muted)] mb-8"
          >
            <AutoAnimate icon={SparklesIcon} size={12} className="text-[var(--fg-subtle)]" interval={3000} />
            {t.hero.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.5rem,8vw,4.5rem)] font-bold tracking-[-0.035em] leading-[1.05] mb-5"
          >
            {t.hero.title1}<br />
            <span className="text-[var(--fg-muted)]">{t.hero.title2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[17px] md:text-[19px] text-[var(--fg-muted)] max-w-xl mx-auto mb-9 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="w-full max-w-xl mx-auto"
          >
            <p className="text-[13px] text-[var(--fg-muted)] mb-2 text-center">{t.chat?.howCanIHelp ?? 'Que puis-je faire pour vous ?'}</p>
            <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-sm)] hover:border-[var(--border-strong)] transition-colors">
              <input
                value={landingInput}
                onChange={(e) => setLandingInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && landingInput.trim()) setShowLoginPopup(true) }}
                placeholder={t.hero.cta}
                className="w-full h-12 px-5 pr-12 bg-transparent text-[15px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none rounded-2xl"
              />
              <button
                onClick={() => { if (landingInput.trim()) setShowLoginPopup(true) }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--accent)] text-[var(--bg)] flex items-center justify-center hover:bg-[var(--accent-hover)] transition-colors"
              >
                <ArrowUp size={14} strokeWidth={2.2} />
              </button>
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-5 text-[12px] text-[var(--fg-subtle)]">
            {t.hero.note}
          </motion.p>
        </motion.div>

        {/* Login popup */}
        {showLoginPopup && (
          <>
            <div onClick={() => setShowLoginPopup(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--bg-elevated)] rounded-2xl p-6 w-full max-w-sm border border-[var(--border)] shadow-[var(--shadow-xl)]">
                <h3 className="text-[18px] font-bold mb-2 text-center">{t.chat?.loginTitle ?? 'Connectez-vous'}</h3>
                <p className="text-[13px] text-[var(--fg-muted)] text-center mb-5">{t.chat?.loginSubtitle ?? 'Pour envoyer votre message'}</p>
                <div className="space-y-2">
                  <Link href={`/login?q=${encodeURIComponent(landingInput)}`} className="block">
                    <button className="w-full h-10 rounded-xl bg-[var(--accent)] text-[var(--bg)] text-[14px] font-medium hover:bg-[var(--accent-hover)] transition-all">{t.chat?.signIn ?? 'Se connecter'}</button>
                  </Link>
                  <Link href={`/register?q=${encodeURIComponent(landingInput)}`} className="block">
                    <button className="w-full h-10 rounded-xl border border-[var(--border)] text-[14px] font-medium hover:bg-[var(--bg-soft)] transition-all">{t.chat?.createAccount ?? 'Créer un compte'}</button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </section>

      {/* Demo */}
      <section className="max-w-4xl mx-auto px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-xl)] overflow-hidden"
        >
          <div className="h-9 flex items-center gap-1.5 px-4 border-b border-[var(--border)] bg-[var(--bg-soft)]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <p className="ml-3 text-[11px] font-mono text-[var(--fg-subtle)]">netral.app/chat</p>
          </div>
          <div className="p-6 md:p-8 space-y-5">
            <div className="flex justify-end">
              <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-md bg-[var(--accent)] text-[var(--bg)] text-[14px]">{t.demo.userMsg}</div>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[var(--fg-muted)]">
              <AutoAnimate icon={EarthIcon} size={12} interval={2000} />
              <span>{t.demo.searching}</span>
            </div>
            <div className="flex gap-3">
              <NetralLogo size={22} />
              <div className="flex-1 text-[14px] leading-relaxed text-[var(--fg-soft)] space-y-1.5">
                <p>{t.demo.response1}</p>
                <p><strong className="text-[var(--fg)]">GPT-5 Turbo</strong><sup className="text-[10px] opacity-50">[1]</sup> {t.demo.response2}</p>
                <p><strong className="text-[var(--fg)]">Claude 4.5</strong><sup className="text-[10px] opacity-50">[2]</sup> {t.demo.response3}<span className="stream-cursor" /></p>
                <div className="flex gap-2 mt-3">
                  {['techcrunch.com', 'arxiv.org'].map((src) => (
                    <div key={src} className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[var(--border)] text-[11px] text-[var(--fg-muted)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500/70" />{src}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-t border-[var(--border)] py-14">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <p className="text-[28px] md:text-[34px] font-bold tracking-tight">{s.value}</p>
              <p className="text-[12px] text-[var(--fg-muted)] mt-0.5">{statsLabels[i]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-[30px] md:text-[40px] font-bold tracking-[-0.02em] mb-3">{t.features.title}</h2>
            <p className="text-[15px] text-[var(--fg-muted)] max-w-md mx-auto">{t.features.subtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-3">
            {t.features.items.map((f: { title: string; desc: string }, i: number) => {
              const Icon = featureIcons[i]
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="p-5 rounded-xl border border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)] transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-[var(--bg-soft)] border border-[var(--border)] flex items-center justify-center mb-3">
                    <AutoAnimate icon={Icon} size={16} className="text-[var(--fg)]" interval={5000 + i * 1000} />
                  </div>
                  <h3 className="text-[14px] font-semibold mb-1">{f.title}</h3>
                  <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/fonctionnalites" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors underline underline-offset-4 decoration-[var(--border-strong)]">{t.features.seeAll}</Link>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-[30px] md:text-[40px] font-bold tracking-[-0.02em] mb-3">
              {t.pricing.title1}<br /><span className="text-[var(--fg-muted)]">{t.pricing.title2}</span>
            </h2>
            <p className="text-[15px] text-[var(--fg-muted)] max-w-md mx-auto mb-8">{t.pricing.subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <button className="group h-11 px-6 text-[15px] font-medium rounded-xl bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2">
                  {t.pricing.cta}
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/tarifs">
                <button className="h-11 px-6 text-[15px] font-medium rounded-xl border border-[var(--border)] hover:bg-[var(--bg-soft)] transition-all active:scale-[0.98]">{t.pricing.seePricing}</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-7">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] text-[var(--fg-muted)]">
            <NetralLogo size={16} />
            <span className="font-medium">Netral</span>
            <span className="text-[var(--fg-subtle)]">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-5 text-[12px] text-[var(--fg-muted)]">
            <Link href="/fonctionnalites" className="hover:text-[var(--fg)] transition-colors">{t.nav.features}</Link>
            <Link href="/tarifs" className="hover:text-[var(--fg)] transition-colors">{t.nav.pricing}</Link>
            <Link href="/extensions" className="hover:text-[var(--fg)] transition-colors">VS Code</Link>
            <Link href="#" className="hover:text-[var(--fg)] transition-colors">{t.footer.privacy}</Link>
            <Link href="#" className="hover:text-[var(--fg)] transition-colors">{t.footer.contact}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
