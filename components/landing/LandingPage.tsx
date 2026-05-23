'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Search, CheckCircle, Shield, Globe, Zap } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'

const features = [
  { icon: Search, label: 'Recherche temps réel' },
  { icon: CheckCircle, label: 'Sources vérifiées' },
  { icon: Shield, label: 'Réponses précises' },
  { icon: Globe, label: 'IA avancée' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <NetralLogo size={28} />
          <span className="font-display text-lg tracking-tight">Netral</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--foreground-muted)]">
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Fonctionnalités</Link>
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Tarifs</Link>
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">À propos</Link>
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Blog</Link>
        </div>
        <Link href="/register">
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm transition-colors shadow-sm"
          >
            Essayer Netral <ArrowRight size={14} />
          </motion.button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-20">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-xs font-medium text-[var(--foreground-muted)] mb-8 bg-[var(--background-elevated)]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            L&apos;IA qui comprend le monde en temps réel
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-8"
          >
            Explorez. Comprenez.{' '}
            <br />
            <span className="glow-text">Décidez avec clarté.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-[var(--foreground-muted)] max-w-xl mx-auto mb-10 leading-relaxed font-light"
          >
            Netral recherche, visite, analyse et comprend internet en temps réel pour vous fournir des réponses fiables, sourcées et à jour.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm transition-colors shadow-md"
              >
                Essayer gratuitement <ArrowRight size={15} />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full border border-[var(--border)] text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--background-secondary)] transition-colors"
              >
                Voir la démo
              </motion.button>
            </Link>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mt-14"
          >
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                  className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]"
                >
                  <div className="w-6 h-6 rounded-md bg-[var(--background-secondary)] flex items-center justify-center">
                    <Icon size={12} className="text-[var(--accent)]" />
                  </div>
                  <span>{f.label}</span>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-[var(--border)] flex items-center justify-between text-sm text-[var(--foreground-muted)]">
        <div className="flex items-center gap-2.5">
          <NetralLogo size={20} />
          <span className="font-display font-normal text-[var(--foreground)]">Netral</span>
          <span className="text-[var(--foreground-subtle)]">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Confidentialité</Link>
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Conditions</Link>
        </div>
      </footer>
    </div>
  )
}
