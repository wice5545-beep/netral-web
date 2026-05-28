'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { MarketingNav } from '@/components/landing/MarketingNav'
import { AuroraBackground } from '@/components/landing/AuroraBackground'
import { EarthIcon } from '@/components/ui/earth'
import { BrainIcon } from '@/components/ui/brain'
import { MessageSquareIcon } from '@/components/ui/message-square'
import { ZapIcon } from '@/components/ui/zap'
import { TerminalIcon } from '@/components/ui/terminal'
import { SearchIcon } from '@/components/ui/search'
import { LockIcon } from '@/components/ui/lock'
import { EyeIcon } from '@/components/ui/eye'
import { AutoAnimate } from '@/components/ui/AutoAnimate'

const featureIcons = [
  EarthIcon,
  BrainIcon,
  MessageSquareIcon,
  ZapIcon,
  TerminalIcon,
  SearchIcon,
  LockIcon,
  EyeIcon,
]

const featureAccents = [
  'from-blue-500/15 to-cyan-500/5',
  'from-violet-500/15 to-purple-500/5',
  'from-emerald-500/15 to-teal-500/5',
  'from-amber-500/15 to-orange-500/5',
  'from-rose-500/15 to-pink-500/5',
  'from-indigo-500/15 to-blue-500/5',
  'from-slate-500/15 to-gray-500/5',
  'from-fuchsia-500/15 to-pink-500/5',
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function FonctionnalitesPage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] overflow-x-hidden noise-soft">
      <MarketingNav />

      {/* HERO */}
      <section className="relative max-w-4xl mx-auto px-6 pt-32 md:pt-40 pb-12">
        <AuroraBackground intensity="subtle" />

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          {t.featuresPage?.back ?? 'Retour'}
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[44px] md:text-[64px] font-bold tracking-[-0.045em] leading-[1.0] mb-5"
        >
          {t.featuresPage?.title ?? 'Toutes les fonctionnalites'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-[17px] text-[var(--fg-muted)] max-w-xl leading-[1.55]"
        >
          {t.featuresPage?.subtitle ?? "Une boite a outils complete pour penser, creer et executer."}
        </motion.p>
      </section>

      {/* FEATURES GRID */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 gap-5"
        >
          {(t.featuresPage?.items ?? []).map(
            (
              f: { title: string; desc: string; details: string[] },
              i: number
            ) => {
              const Icon = featureIcons[i % featureIcons.length]
              const accent = featureAccents[i % featureAccents.length]
              return (
                <motion.div
                  key={i}
                  variants={item}
                  className={`magnetic-card group relative p-6 md:p-7 rounded-2xl border border-[var(--border)] bg-gradient-to-br ${accent} bg-[var(--bg-elevated)] overflow-hidden`}
                >
                  <div className="beam-scan" style={{ ['--beam-delay' as string]: `${i * 0.5}s` }} />

                  <div className="relative z-10 flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-[var(--border-strong)] transition-all duration-300 shadow-sm">
                      <AutoAnimate
                        icon={Icon}
                        size={22}
                        className="text-[var(--fg)]"
                        interval={4500 + i * 600}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[17px] font-semibold mb-1.5 tracking-[-0.005em]">{f.title}</h3>
                      <p className="text-[14px] text-[var(--fg-muted)] leading-[1.55]">{f.desc}</p>
                    </div>
                  </div>

                  <ul className="relative z-10 space-y-2 pl-16">
                    {f.details.map((d: string, j: number) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -6 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + j * 0.05, duration: 0.4 }}
                        className="flex items-center gap-2 text-[13px] text-[var(--fg-subtle)]"
                      >
                        <span className="w-1 h-1 rounded-full bg-[var(--fg-faint)]" />
                        {d}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )
            }
          )}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-[var(--border)] py-24 overflow-hidden">
        <AuroraBackground intensity="subtle" showGrid={false} />
        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[34px] md:text-[44px] font-bold tracking-[-0.035em] mb-4">
              {t.featuresPage?.cta ?? 'Pret a commencer ?'}
            </h2>
            <p className="text-[15.5px] text-[var(--fg-muted)] mb-8 max-w-md mx-auto">
              {t.featuresPage?.ctaDesc ??
                "Rejoignez les milliers d'utilisateurs qui pensent mieux avec Netral."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <button
                  className="group inline-flex items-center gap-2.5 px-7 text-[15px] font-semibold rounded-full bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all hover:scale-[1.04] active:scale-[0.98] shadow-md hover:shadow-xl"
                  style={{ height: 50 }}
                >
                  {t.featuresPage?.ctaBtn ?? 'Essayer gratuitement'}
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/tarifs">
                <button
                  className="px-7 text-[15px] font-medium rounded-full border border-[var(--border)] hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)] transition-all"
                  style={{ height: 50 }}
                >
                  Voir les tarifs
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-[12.5px] text-[var(--fg-muted)]">
          © {new Date().getFullYear()} Netral
        </div>
      </footer>
    </div>
  )
}
