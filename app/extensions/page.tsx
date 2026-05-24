'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Terminal, Zap } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export default function ExtensionsPage() {
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
          Retour
        </Link>

        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-[36px] md:text-[48px] font-semibold tracking-[-0.025em] leading-[1.1] mb-4">
          Extensions
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[17px] text-[var(--fg-muted)] max-w-xl leading-relaxed">
          Utilisez Netral directement dans votre éditeur de code.
        </motion.p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 shadow-[var(--shadow-sm)]">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)] flex items-center justify-center shrink-0">
              <Terminal size={24} className="text-[var(--fg)]" />
            </div>
            <div className="flex-1">
              <h2 className="text-[22px] font-bold mb-1">Netral for VS Code</h2>
              <p className="text-[14px] text-[var(--fg-muted)] mb-4">Chat avec Netral directement dans VS Code. Streaming en temps réel, commandes slash, et plus.</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {['Chat IA', 'Streaming', '/agent', '/init', '/usage', '/logout'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-[var(--bg-soft)] border border-[var(--border)] text-[11px] font-medium text-[var(--fg-muted)]">{tag}</span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <a href="vscode:extension/netral.netral" className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[var(--accent)] text-[var(--bg)] text-[14px] font-medium hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98]">
                  <Download size={15} />
                  Installer dans VS Code
                </a>
                <a href="/netral-0.8.0.vsix" download className="inline-flex items-center gap-2 h-10 px-5 rounded-xl border border-[var(--border)] text-[14px] font-medium hover:bg-[var(--bg-soft)] transition-all">
                  <Download size={15} />
                  Télécharger .vsix (v0.8.0)
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <h3 className="text-[14px] font-semibold mb-3">Comment ça marche</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Installer', desc: 'Installez l\'extension depuis VS Code ou téléchargez le .vsix' },
                { step: '2', title: 'Se connecter', desc: 'Utilisez la commande /init et entrez votre token (Paramètres > API)' },
                { step: '3', title: 'Coder', desc: 'Chattez avec Netral dans la sidebar, utilisez /agent pour l\'analyse' },
              ].map(s => (
                <div key={s.step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[11px] font-bold shrink-0">{s.step}</div>
                  <div>
                    <p className="text-[13px] font-medium">{s.title}</p>
                    <p className="text-[12px] text-[var(--fg-muted)] mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
