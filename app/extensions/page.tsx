'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Code2, Sparkles, Shield, RefreshCw, Zap } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { useI18n } from '@/lib/i18n'
import { extensionsTranslations } from '@/lib/i18n/extensions'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useEffect, useState } from 'react'

type VersionInfo = { version: string; filename: string; downloadUrl: string; marketplaceUrl?: string; allVersions?: { version: string; filename: string }[] }

export default function ExtensionsPage() {
  const { t, locale } = useI18n()
  const ext = extensionsTranslations[locale] || extensionsTranslations.en
  const [latest, setLatest] = useState<VersionInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/extensions/latest').then(r => r.json()).then(d => { setLatest(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const icons = [Sparkles, Zap, Shield, RefreshCw]

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 nav-pill px-2 py-1.5">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2 px-3 py-1.5"><NetralLogo size={20} /><span className="font-semibold text-[14px]">Netral</span></Link>
          <div className="flex items-center gap-1.5 ml-2">
            <LanguageSwitcher />
            <Link href="/register"><button className="h-8 px-3.5 text-[13px] font-medium rounded-full bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-colors">{t.nav.start}</button></Link>
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-24 pb-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors mb-8"><ArrowLeft size={14} />{ext.back}</Link>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[36px] md:text-[48px] font-semibold tracking-[-0.03em] leading-[1.1]">{ext.title}</h1>
          <p className="text-[17px] text-[var(--fg-muted)] mt-3 max-w-xl leading-relaxed">{ext.subtitle}</p>
        </motion.div>
        {latest && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)]/20 text-[12px] font-medium text-[var(--accent)] mt-6">
            <RefreshCw size={11} />{ext.latestVersion} : v{latest.version}
          </motion.div>
        )}
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl glass-card shadow-colored overflow-hidden">
          <div className="p-8 pb-6 border-b border-[var(--border)]">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-colored" style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }}><Code2 size={24} className="text-white" /></div>
              <div className="flex-1">
                <h2 className="text-[22px] font-bold mb-1">Netral Code</h2>
                <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed">{ext.subtitle}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <a href="vscode:extension/netral.netral" className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-white text-[14px] font-semibold hover:scale-[1.02] transition-all active:scale-[0.98] shadow-colored" style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }}><Download size={15} />{ext.installVSCode}</a>
              {latest ? (
                <a href={latest.downloadUrl || latest.marketplaceUrl} target="_blank" className="inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-[var(--border)] text-[14px] font-medium hover:bg-[var(--bg-soft)] transition-all active:scale-[0.98]"><Download size={15} />{ext.downloadVsix} (v{latest.version})</a>
              ) : loading ? <span className="text-[13px] text-[var(--fg-muted)]">{ext.loading}</span> : null}
            </div>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-5">
            {ext.features.map((f, i) => { const Icon = icons[i]; return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="flex gap-3 p-4 rounded-xl glass-card hover:shadow-colored transition-all duration-200 hover:-translate-y-0.5">
                <Icon size={18} className="shrink-0 mt-0.5 gradient-text" />
                <div><p className="text-[13px] font-semibold">{f.title}</p><p className="text-[12px] text-[var(--fg-muted)] mt-0.5 leading-relaxed">{f.desc}</p></div>
              </motion.div>
            )})}
          </div>

          <div className="px-8 pb-8">
            <h3 className="text-[14px] font-semibold mb-4">Installation</h3>
            <div className="space-y-3">
              {ext.setup.map(s => (
                <div key={s.step} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-[11px] font-bold text-white shrink-0">{s.step}</div>
                  <div><p className="text-[13px] font-medium">{s.title}</p><p className="text-[12px] text-[var(--fg-muted)] mt-0.5">{s.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
