'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { EarthIcon } from '@/components/ui/earth'
import { BrainIcon } from '@/components/ui/brain'
import { MessageSquareIcon } from '@/components/ui/message-square'
import { ZapIcon } from '@/components/ui/zap'
import { TerminalIcon } from '@/components/ui/terminal'
import { SearchIcon } from '@/components/ui/search'
import { LockIcon } from '@/components/ui/lock'
import { EyeIcon } from '@/components/ui/eye'

const featureIcons = [EarthIcon, BrainIcon, MessageSquareIcon, ZapIcon, TerminalIcon, SearchIcon, LockIcon, EyeIcon]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } }

export default function FonctionnalitesPage() {
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
          {t.featuresPage.back}
        </Link>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="text-[36px] md:text-[48px] font-semibold tracking-[-0.025em] leading-[1.1] mb-4">
          {t.featuresPage.title}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="text-[17px] text-[var(--fg-muted)] max-w-xl leading-relaxed">
          {t.featuresPage.subtitle}
        </motion.p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-4">
          {t.featuresPage.items.map((f: { title: string; desc: string; details: string[] }, i: number) => {
            const Icon = featureIcons[i]
            return (
              <motion.div key={i} variants={item} className="group p-6 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-soft)] border border-[var(--border)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={18} className="text-[var(--fg)]" />
                </div>
                <h3 className="text-[16px] font-semibold mb-2">{f.title}</h3>
                <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed mb-4">{f.desc}</p>
                <ul className="space-y-1.5">
                  {f.details.map((d: string, j: number) => (
                    <li key={j} className="flex items-center gap-2 text-[13px] text-[var(--fg-subtle)]">
                      <span className="w-1 h-1 rounded-full bg-[var(--fg-subtle)]" />
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      <section className="border-t border-[var(--border)] py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-[28px] font-semibold tracking-[-0.02em] mb-4">{t.featuresPage.cta}</h2>
          <p className="text-[15px] text-[var(--fg-muted)] mb-8">{t.featuresPage.ctaDesc}</p>
          <Link href="/register">
            <button className="h-11 px-6 text-[15px] font-medium rounded-[10px] bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all">{t.featuresPage.ctaBtn}</button>
          </Link>
        </div>
      </section>
    </div>
  )
}
