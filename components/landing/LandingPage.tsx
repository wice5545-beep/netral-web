'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Search, CheckCircle, Shield, Globe } from 'lucide-react'
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
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <NetralLogo size={28} />
          <span className="font-bold text-lg">Netral</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--foreground-muted)]">
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Fonctionnalités</Link>
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Tarifs</Link>
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">À propos</Link>
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Blog</Link>
        </div>
        <Link href="/register">
          <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm transition-colors">
            Essayer Netral <ArrowRight size={14} />
          </button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-20">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-xs font-medium text-[var(--foreground-muted)] mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-400" />
            L&apos;IA qui comprend le monde en temps réel
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Explorez. Comprenez.{' '}
            <br />
            Décidez avec <span className="glow-text">clarté.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[var(--foreground-muted)] max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Netral recherche, visite, analyse et comprend internet en temps réel pour vous fournir des réponses fiables, sourcées et à jour.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/register">
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm transition-colors shadow-lg shadow-[var(--accent-glow)]">
                Essayer gratuitement <ArrowRight size={15} />
              </button>
            </Link>
            <Link href="/login">
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-[var(--border)] text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--background-secondary)] transition-colors">
                Voir la démo
              </button>
            </Link>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.label} className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                  <Icon size={14} className="text-[var(--accent)]" />
                  <span>{f.label}</span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-[var(--border)] flex items-center justify-between text-sm text-[var(--foreground-muted)]">
        <div className="flex items-center gap-2">
          <NetralLogo size={18} />
          <span className="font-semibold text-[var(--foreground)]">Netral</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Confidentialité</Link>
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Conditions</Link>
        </div>
      </footer>
    </div>
  )
}
