'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Shield, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { AmbientBackground } from '@/components/layout/AmbientBackground'

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AmbientBackground />

      {/* Nav */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <NetralLogo size={28} animated />
          <span className="font-semibold tracking-tight text-lg">Netral</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button size="sm" variant="glow">Get started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 md:pt-32 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-[var(--foreground-secondary)] mb-8"
        >
          <Sparkles size={12} className="text-[var(--accent)]" />
          Introducing Netral 1.3 — now with memory
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-6"
        >
          The AI that
          <br />
          <span className="glow-text">remembers you.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Netral is a next-generation AI assistant. Fluid streaming, beautiful interface, and a memory that adapts to who you are.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/register">
            <Button size="lg" variant="glow" className="gap-2 min-w-[180px]">
              Start chatting
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="min-w-[140px]">
              Sign in
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 text-xs text-[var(--foreground-subtle)]"
        >
          Free forever · No credit card · Built with love
        </motion.p>

        {/* Preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 relative"
        >
          <div className="relative mx-auto max-w-3xl rounded-2xl glass-strong shadow-[0_30px_120px_-20px_var(--accent-glow)] overflow-hidden">
            {/* Window chrome */}
            <div className="h-9 flex items-center px-4 gap-1.5 border-b border-[var(--border)]">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
              <div className="w-3 h-3 rounded-full bg-green-400/60" />
            </div>
            {/* Chat preview */}
            <div className="p-6 md:p-8 space-y-5 text-left">
              <div className="flex justify-end">
                <div className="px-4 py-2.5 rounded-2xl rounded-tr-md bg-[var(--accent-soft)] text-sm max-w-[80%]">
                  Hey Netral, summarize the key ideas of quantum computing for me.
                </div>
              </div>
              <div className="flex gap-3">
                <NetralLogo size={28} />
                <div className="flex-1 text-sm leading-relaxed text-[var(--foreground-secondary)] space-y-2">
                  <p>Quantum computing harnesses three core principles:</p>
                  <p className="text-[var(--foreground)]"><strong>Superposition</strong> — qubits exist in multiple states simultaneously</p>
                  <p className="text-[var(--foreground)]"><strong>Entanglement</strong> — qubits remain correlated across distance</p>
                  <p className="text-[var(--foreground)]"><strong>Interference</strong> — amplifies correct outcomes, cancels wrong ones<span className="stream-cursor"></span></p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features grid */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Zap,
              title: 'Lightning streaming',
              desc: 'Watch your answers appear in real-time. No delays, no wait screens.',
            },
            {
              icon: MessageSquare,
              title: 'Persistent memory',
              desc: 'Netral remembers your name, your work, your style. Conversations that feel personal.',
            },
            {
              icon: Shield,
              title: 'Privacy first',
              desc: 'Your conversations stay yours. Clear your memory anytime.',
            },
          ].map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[var(--accent)]" />
                </div>
                <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--foreground-subtle)]">
        <p>© {new Date().getFullYear()} Netral. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Terms</Link>
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
