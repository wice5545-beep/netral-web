'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Globe, Zap, Lock, MessageSquare } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'

const features = [
  {
    icon: Globe,
    title: 'Recherche web en temps réel',
    desc: 'Netral consulte le web pendant qu\'il vous répond. Sources datées, cliquables, vérifiables.',
  },
  {
    icon: MessageSquare,
    title: 'Conversations naturelles',
    desc: 'Posez des questions complexes, demandez du code, débattez d\'idées. Comme parler à un expert.',
  },
  {
    icon: Zap,
    title: 'Réponses instantanées',
    desc: 'Streaming en direct. Vous lisez la réponse pendant qu\'elle se forme.',
  },
  {
    icon: Lock,
    title: 'Privé par défaut',
    desc: 'Sessions chiffrées. Données effaçables à tout moment. Aucun entraînement sur vos messages.',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg-overlay)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <NetralLogo size={24} />
            <span className="font-semibold text-[15px]">Netral</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <Link href="#features" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">Fonctionnalités</Link>
            <Link href="#pricing" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">Tarifs</Link>
            <Link href="/login" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">Se connecter</Link>
          </div>

          <Link href="/register">
            <button className="h-8 px-3.5 text-[13px] font-medium rounded-[8px] bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-colors">
              Commencer
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 md:pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-soft)] border border-[var(--border)] text-[12px] text-[var(--fg-muted)] mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Netral 1.3 disponible
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-[44px] md:text-[64px] font-semibold tracking-[-0.025em] leading-[1.05] mb-6"
        >
          L'assistant IA<br />
          <span className="text-[var(--fg-muted)]">qui consulte le web.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-[17px] md:text-[18px] text-[var(--fg-muted)] max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Posez une question. Netral cherche, lit, et synthétise. Avec sources citées et vérifiables.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/register">
            <button className="h-11 px-6 text-[15px] font-medium rounded-[10px] bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all flex items-center gap-2">
              Commencer gratuitement
              <ArrowRight size={15} strokeWidth={2.2} />
            </button>
          </Link>
          <Link href="/login">
            <button className="h-11 px-6 text-[15px] font-medium rounded-[10px] border border-[var(--border)] hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)] transition-all">
              Se connecter
            </button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-[12px] text-[var(--fg-subtle)]"
        >
          Gratuit. Aucune carte bancaire requise.
        </motion.p>
      </section>

      {/* Demo preview */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-lg)] overflow-hidden"
        >
          {/* Window chrome */}
          <div className="h-9 flex items-center gap-1.5 px-4 border-b border-[var(--border)] bg-[var(--bg-soft)]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
            </div>
            <p className="ml-3 text-[11px] font-mono text-[var(--fg-subtle)]">netral.app/chat</p>
          </div>

          <div className="p-8 space-y-6">
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md bg-[var(--accent)] text-[var(--bg)] text-[14px]">
                Quels sont les derniers développements en IA cette semaine ?
              </div>
            </div>

            {/* Status pill */}
            <div className="flex items-center gap-2 text-[12px] text-[var(--fg-muted)]">
              <Globe size={11} className="animate-pulse" />
              <span className="animate-pulse">Recherche en cours…</span>
            </div>

            {/* Assistant response */}
            <div className="flex gap-3">
              <NetralLogo size={24} />
              <div className="flex-1 text-[14px] leading-relaxed text-[var(--fg-soft)] space-y-2">
                <p>Voici les avancées majeures cette semaine :</p>
                <p><strong className="text-[var(--fg)]">GPT-5 Turbo</strong><sup className="text-[var(--accent)] text-[10px] ml-0.5">[1]</sup> — raisonnement multi-étapes amélioré.</p>
                <p><strong className="text-[var(--fg)]">Claude 4.5</strong><sup className="text-[var(--accent)] text-[10px] ml-0.5">[2]</sup> — agents autonomes plus stables<span className="stream-cursor" /></p>
                <div className="flex gap-2 mt-3">
                  {['techcrunch.com', 'arxiv.org'].map((src) => (
                    <div key={src} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--border)] text-[11px] text-[var(--fg-muted)]">
                      <div className="w-2 h-2 rounded-sm bg-[var(--border-strong)]" />
                      {src}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-[var(--border)] py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-[32px] md:text-[40px] font-semibold tracking-[-0.02em] leading-tight mb-4">
              Pensé pour les esprits curieux
            </h2>
            <p className="text-[16px] text-[var(--fg-muted)] max-w-lg mx-auto">
              Une IA qui n'invente pas. Qui sait quand chercher. Qui cite ses sources.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-3">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="p-6 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[var(--bg-soft)] flex items-center justify-center mb-4">
                    <Icon size={16} className="text-[var(--fg)]" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-[15px] font-semibold mb-1.5">{f.title}</h3>
                  <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border)] py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[32px] md:text-[40px] font-semibold tracking-[-0.02em] leading-tight mb-6"
          >
            Posez votre première question.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Link href="/register">
              <button className="h-11 px-6 text-[15px] font-medium rounded-[10px] bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all inline-flex items-center gap-2">
                Créer un compte gratuit
                <ArrowRight size={15} strokeWidth={2.2} />
              </button>
            </Link>
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
            <Link href="#" className="hover:text-[var(--fg)] transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-[var(--fg)] transition-colors">Conditions</Link>
            <Link href="#" className="hover:text-[var(--fg)] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
