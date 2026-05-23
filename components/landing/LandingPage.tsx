'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
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
import { RocketIcon } from '@/components/ui/rocket'
import { AutoAnimate } from '@/components/ui/AutoAnimate'

const featureIcons = [EarthIcon, BrainIcon, MessageSquareIcon, ZapIcon, SearchIcon, LockIcon]

const stats = [
  { value: '< 200ms' },
  { value: '99.9%' },
  { value: '50k+' },
]

export function LandingPage() {
  const { t } = useI18n()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.96])

  const statsLabels = [t.stats.latency, t.stats.uptime, t.stats.users]

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[var(--bg-overlay)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <NetralLogo size={24} />
            <span className="font-semibold text-[15px]">Netral</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <Link href="/fonctionnalites" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">{t.nav.features}</Link>
            <Link href="/tarifs" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">{t.nav.pricing}</Link>
            <Link href="/login" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">{t.nav.login}</Link>
            <LanguageSwitcher />
          </div>

          <Link href="/register">
            <button className="h-8 px-3.5 text-[13px] font-medium rounded-[8px] bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-colors">
              {t.nav.start}
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative max-w-4xl mx-auto px-6 pt-28 md:pt-40 pb-24 text-center"
      >
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[var(--accent-soft)] via-transparent to-transparent blur-3xl opacity-50 animate-float" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-soft)] border border-[var(--border)] text-[12px] text-[var(--fg-muted)] mb-8 hover:border-[var(--border-strong)] transition-colors"
        >
          <AutoAnimate icon={SparklesIcon} size={12} className="text-[var(--fg-subtle)]" interval={3000} />
          {t.hero.badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[48px] md:text-[72px] font-bold tracking-[-0.03em] leading-[1.02] mb-6"
        >
          {t.hero.title1}<br />
          <span className="bg-gradient-to-r from-[var(--fg)] via-[var(--fg-muted)] to-[var(--fg-subtle)] bg-clip-text text-transparent">{t.hero.title2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-[18px] md:text-[20px] text-[var(--fg-muted)] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/register">
            <button className="group h-12 px-7 text-[15px] font-medium rounded-[12px] bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2">
              {t.hero.cta}
              <ArrowRight size={15} strokeWidth={2.2} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
          <Link href="/login">
            <button className="h-12 px-7 text-[15px] font-medium rounded-[12px] border border-[var(--border)] hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)] transition-all">
              {t.hero.login}
            </button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-[12px] text-[var(--fg-subtle)]"
        >
          {t.hero.note}
        </motion.p>
      </motion.section>

      {/* Demo preview */}
      <section className="max-w-4xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-xl)] overflow-hidden"
        >
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[var(--border-strong)] via-transparent to-transparent opacity-50 pointer-events-none" />
          <div className="relative h-10 flex items-center gap-1.5 px-4 border-b border-[var(--border)] bg-[var(--bg-soft)]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <p className="ml-3 text-[11px] font-mono text-[var(--fg-subtle)]">netral.app/chat</p>
          </div>
          <div className="relative p-8 space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }} className="flex justify-end">
              <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md bg-[var(--accent)] text-[var(--bg)] text-[14px]">{t.demo.userMsg}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="flex items-center gap-2 text-[12px] text-[var(--fg-muted)]">
              <AutoAnimate icon={EarthIcon} size={11} className="animate-pulse" interval={2000} />
              <span className="animate-pulse">{t.demo.searching}</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.6 }} className="flex gap-3">
              <NetralLogo size={24} />
              <div className="flex-1 text-[14px] leading-relaxed text-[var(--fg-soft)] space-y-2">
                <p>{t.demo.response1}</p>
                <p><strong className="text-[var(--fg)]">GPT-5 Turbo</strong><sup className="text-[10px] ml-0.5 opacity-60">[1]</sup> {t.demo.response2}</p>
                <p><strong className="text-[var(--fg)]">Claude 4.5</strong><sup className="text-[10px] ml-0.5 opacity-60">[2]</sup> {t.demo.response3}<span className="stream-cursor" /></p>
                <div className="flex gap-2 mt-3">
                  {['techcrunch.com', 'arxiv.org'].map((src) => (
                    <div key={src} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--border)] text-[11px] text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] transition-colors cursor-pointer">
                      <div className="w-2 h-2 rounded-sm bg-green-500/60" />
                      {src}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-t border-[var(--border)] py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="text-center">
                <p className="text-[28px] md:text-[36px] font-bold tracking-tight">{s.value}</p>
                <p className="text-[13px] text-[var(--fg-muted)] mt-1">{statsLabels[i]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[var(--border)] py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-[32px] md:text-[44px] font-bold tracking-[-0.025em] leading-tight mb-4">{t.features.title}</h2>
            <p className="text-[16px] text-[var(--fg-muted)] max-w-lg mx-auto">{t.features.subtitle}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-3">
            {t.features.items.map((f: { title: string; desc: string }, i: number) => {
              const Icon = featureIcons[i]
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: i * 0.07 }} className="group p-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] transition-all duration-300 cursor-default">
                  <div className="w-9 h-9 rounded-lg bg-[var(--bg-soft)] border border-[var(--border)] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-[var(--border-strong)] transition-all duration-300">
                    <AutoAnimate icon={Icon} size={16} className="text-[var(--fg)]" interval={5000 + i * 800} />
                  </div>
                  <h3 className="text-[14px] font-semibold mb-1">{f.title}</h3>
                  <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-center mt-8">
            <Link href="/fonctionnalites" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors underline underline-offset-4 decoration-[var(--border-strong)]">{t.features.seeAll}</Link>
          </motion.div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-t border-[var(--border)] py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-[32px] md:text-[44px] font-bold tracking-[-0.025em] leading-tight mb-4">
              {t.pricing.title1}<br /><span className="text-[var(--fg-muted)]">{t.pricing.title2}</span>
            </h2>
            <p className="text-[16px] text-[var(--fg-muted)] max-w-md mx-auto mb-8">{t.pricing.subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <button className="group h-11 px-6 text-[15px] font-medium rounded-[10px] bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all inline-flex items-center gap-2">
                  {t.pricing.cta}
                  <ArrowRight size={15} strokeWidth={2.2} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/tarifs">
                <button className="h-11 px-6 text-[15px] font-medium rounded-[10px] border border-[var(--border)] hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)] transition-all">{t.pricing.seePricing}</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[13px] text-[var(--fg-muted)]">
            <NetralLogo size={18} />
            <span className="font-medium">Netral</span>
            <span className="text-[var(--fg-subtle)]">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-[13px] text-[var(--fg-muted)]">
            <Link href="/fonctionnalites" className="hover:text-[var(--fg)] transition-colors">{t.nav.features}</Link>
            <Link href="/tarifs" className="hover:text-[var(--fg)] transition-colors">{t.nav.pricing}</Link>
            <Link href="#" className="hover:text-[var(--fg)] transition-colors">{t.footer.privacy}</Link>
            <Link href="#" className="hover:text-[var(--fg)] transition-colors">{t.footer.contact}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
