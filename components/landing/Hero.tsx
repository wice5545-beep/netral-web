'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--accent)] opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500 opacity-5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_var(--background)_70%)]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M60 0v60M0 60h60M0 0h60M0 0v60' stroke='%236366f1' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)] text-sm font-medium mb-8">
            <Zap size={14} />
            Now in beta — try it free
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold text-[var(--foreground)] mb-6 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          The platform your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-500">
            team deserves
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-[var(--foreground-muted)] mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Netral brings together everything your team needs to ship faster, collaborate smarter, and build products that last.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/register">
            <Button size="lg" className="gap-2 shadow-lg shadow-[var(--accent)]/20">
              Get started free
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </Link>
        </motion.div>

        <motion.p
          className="mt-6 text-sm text-[var(--foreground-muted)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          No credit card required · Free plan available · Setup in 2 minutes
        </motion.p>

        {/* Dashboard preview */}
        <motion.div
          className="mt-20 relative"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-1 shadow-2xl overflow-hidden">
            <div className="bg-[var(--background-secondary)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 mx-4 h-6 bg-[var(--border)] rounded-lg" />
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['Total Users', 'Revenue', 'Active Now'].map((label, i) => (
                  <div key={label} className="bg-[var(--card)] rounded-xl p-4 border border-[var(--card-border)]">
                    <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
                    <p className="text-xl font-bold text-[var(--foreground)] mt-1">
                      {['12,842', '$48.2k', '1,293'][i]}
                    </p>
                    <p className="text-xs text-[var(--success)] mt-1">+{[12, 8, 23][i]}% this month</p>
                  </div>
                ))}
              </div>
              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--card-border)]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-[var(--foreground)]">Activity</p>
                  <div className="h-5 w-20 bg-[var(--border)] rounded" />
                </div>
                <div className="flex items-end gap-1 h-20">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-[var(--accent)] opacity-70"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent pointer-events-none" style={{ top: '60%' }} />
        </motion.div>
      </div>
    </section>
  )
}
