'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export default function ChangelogPage() {
  const { t } = useI18n()

  const entries = t.changelog?.entries || []

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Nav */}
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

      {/* Header */}
      <section className="max-w-3xl mx-auto px-6 pt-28 pb-12 text-center">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors mb-10">
          <ArrowLeft size={14} />
          {t.changelog?.back || 'Back'}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-[12px] text-[var(--fg-muted)] mb-6">
            <Sparkles size={11} />
            {t.changelog?.badge || 'What\'s new'}
          </div>
          <h1 className="text-[38px] md:text-[52px] font-bold tracking-[-0.04em] leading-[1.05] mb-4">
            {t.changelog?.title || 'Changelog'}
          </h1>
          <p className="text-[17px] text-[var(--fg-muted)] max-w-md mx-auto leading-relaxed">
            {t.changelog?.subtitle || ''}
          </p>
        </motion.div>
      </section>

      {/* Entries */}
      <section className="max-w-3xl mx-auto px-6 pb-28">
        <div className="space-y-6">
          {entries.map((entry: { version: string; date: string; title: string; changes: string[] }, i: number) => (
            <motion.div
              key={entry.version}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] transition-all duration-300"
            >
              {/* Version badge + date */}
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                  {entry.version}
                </span>
                <span className="text-[12px] text-[var(--fg-subtle)]">{entry.date}</span>
              </div>

              {/* Title */}
              <h3 className="text-[18px] font-bold tracking-[-0.02em] mb-3">{entry.title}</h3>

              {/* Changes list */}
              <ul className="space-y-2">
                {entry.changes.map((change: string, j: number) => (
                  <li key={j} className="flex items-start gap-2.5 text-[13px] text-[var(--fg-muted)] leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--fg-subtle)] shrink-0" />
                    {change}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
