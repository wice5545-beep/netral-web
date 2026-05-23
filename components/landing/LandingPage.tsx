'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Search, BookOpen, Sparkles, Lock } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'

const sections = [
  {
    num: '01',
    title: 'Recherche en temps réel',
    body: 'Netral consulte le web pendant que vous lisez sa réponse. Sources publiées il y a quelques minutes inclues.',
    icon: Search,
  },
  {
    num: '02',
    title: 'Citations vérifiables',
    body: 'Chaque affirmation est rattachée à sa source. Cliquez. Lisez. Vérifiez. La transparence comme principe.',
    icon: BookOpen,
  },
  {
    num: '03',
    title: 'Mémoire persistante',
    body: 'Vos préférences, votre métier, votre style. Netral apprend à vous connaître. Conversations cohérentes.',
    icon: Sparkles,
  },
  {
    num: '04',
    title: 'Privé par défaut',
    body: 'Chiffrement en transit, sessions sécurisées, données effaçables à tout moment. Aucun entraînement.',
    icon: Lock,
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] relative">
      <div className="grain-paper" />

      {/* ━━━ NAV ━━━ */}
      <nav className="border-b border-[var(--rule)] backdrop-blur-md bg-[var(--bg-overlay)] sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <NetralLogo size={26} />
            <span className="font-display text-[19px] tracking-tight">Netral</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#manifesto" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">Manifesto</Link>
            <Link href="#features" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">Capacités</Link>
            <Link href="#pricing" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">Tarifs</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors hidden sm:inline">
              Se connecter
            </Link>
            <Link href="/register">
              <button className="btn btn-ink text-[13px] h-9 px-4">
                Commencer
                <ArrowUpRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ━━━ HERO ━━━ */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-24 lg:pt-32 pb-32 relative">
        {/* Issue marker */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="label-num">№ 01</span>
          <span className="rule flex-1 max-w-[60px]" />
          <span className="label">L'assistant éditorial</span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          {/* Title block */}
          <div className="lg:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(48px,9vw,128px)] leading-[0.95] tracking-tight"
            >
              L'intelligence
              <br />
              qui <span className="serif-italic" style={{ color: 'var(--jewel)' }}>lit</span>
              <br />
              le monde.
            </motion.h1>
          </div>

          {/* Description block */}
          <div className="lg:col-span-4 lg:pb-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <p className="text-[15px] leading-[1.65] text-[var(--fg-soft)] mb-6">
                Netral est un assistant qui consulte le web en temps réel, lit ses sources, et vous répond avec la précision d'un journaliste — pas la confiance d'un perroquet statistique.
              </p>
              <div className="flex items-center gap-3">
                <Link href="/register">
                  <button className="btn btn-ink h-11">
                    Essayer gratuitement
                    <ArrowUpRight size={15} />
                  </button>
                </Link>
                <Link href="#manifesto">
                  <button className="btn btn-ghost h-11">
                    Lire le manifesto
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer marker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-24 lg:mt-32 grid lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-3">
            <span className="label-num">An. 2026</span>
          </div>
          <div className="lg:col-span-6">
            <div className="rule" />
          </div>
          <div className="lg:col-span-3 text-right">
            <span className="label-num">Une publication continue</span>
          </div>
        </motion.div>
      </section>

      {/* ━━━ MANIFESTO ━━━ */}
      <section id="manifesto" className="border-t border-[var(--rule)] py-24 lg:py-32 bg-[var(--bg-soft)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid lg:grid-cols-12 gap-10"
          >
            <div className="lg:col-span-3">
              <span className="label">Manifesto</span>
              <p className="label-num mt-2">II</p>
            </div>

            <div className="lg:col-span-9 max-w-3xl">
              <p className="font-display text-[clamp(28px,4vw,52px)] leading-[1.15] tracking-tight">
                Nous croyons qu'une IA devrait <span className="serif-italic" style={{ color: 'var(--jewel)' }}>citer</span> ses sources.
                Qu'elle devrait <span className="serif-italic" style={{ color: 'var(--jewel)' }}>douter</span> avant d'affirmer.
                Qu'elle devrait nous <span className="serif-italic" style={{ color: 'var(--jewel)' }}>servir</span>, pas nous remplacer.
              </p>
              <div className="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-5 text-[15px] leading-[1.65] text-[var(--fg-soft)]">
                <p>Nous construisons Netral pour les esprits curieux qui refusent les réponses approximatives. Pour ceux qui veulent comprendre, pas seulement obtenir.</p>
                <p>Chaque réponse est une promesse : ce que vous lisez est issu de sources réelles, vérifiables, datées. Pas d'hallucination. Pas de raccourci.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ FEATURES ━━━ */}
      <section id="features" className="py-24 lg:py-32 border-t border-[var(--rule)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-16"
          >
            <span className="label-num">III</span>
            <span className="rule flex-1 max-w-[60px]" />
            <span className="label">Capacités</span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--rule)]">
            {sections.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[var(--bg)] p-10 lg:p-14 group hover:bg-[var(--bg-soft)] transition-colors"
                >
                  <div className="flex items-start justify-between mb-8">
                    <span className="label-num">{s.num}</span>
                    <Icon size={20} className="text-[var(--fg-muted)] group-hover:text-[var(--jewel)] transition-colors" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-3xl lg:text-4xl tracking-tight mb-4 leading-[1.1]">
                    {s.title}
                  </h3>
                  <p className="text-[15px] leading-[1.65] text-[var(--fg-muted)] max-w-md">
                    {s.body}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section className="border-t border-[var(--rule)] py-32 lg:py-48 bg-[var(--fg)] text-[var(--bg)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="label mb-8"
            style={{ color: 'rgba(250, 248, 243, 0.5)' }}
          >
            Commencez votre lecture
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(40px,7vw,96px)] leading-[1] tracking-tight max-w-4xl mx-auto mb-12"
          >
            Posez votre première question.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/register">
              <button className="btn h-12 px-8 bg-[var(--bg)] text-[var(--fg)] hover:bg-[var(--bg-soft)]">
                Créer un compte
                <ArrowUpRight size={16} />
              </button>
            </Link>
            <p className="text-[12px] text-[rgba(250,248,243,0.5)] mt-2 sm:mt-0 sm:ml-4">
              Gratuit. Aucune carte requise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="py-12 bg-[var(--fg)] text-[var(--bg)] border-t border-[rgba(250,248,243,0.1)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center gap-2.5">
              <NetralLogo size={22} />
              <span className="font-display text-lg">Netral</span>
            </div>
            <div className="text-center">
              <p className="text-[12px]" style={{ color: 'rgba(250, 248, 243, 0.4)' }}>
                © {new Date().getFullYear()} Netral. Tous droits réservés.
              </p>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-6 text-[12px]">
              <Link href="#" style={{ color: 'rgba(250, 248, 243, 0.6)' }} className="hover:opacity-100">Confidentialité</Link>
              <Link href="#" style={{ color: 'rgba(250, 248, 243, 0.6)' }} className="hover:opacity-100">Conditions</Link>
              <Link href="#" style={{ color: 'rgba(250, 248, 243, 0.6)' }} className="hover:opacity-100">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
