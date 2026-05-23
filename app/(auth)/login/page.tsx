'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowUpRight } from 'lucide-react'
import { login } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetralLogo } from '@/components/ui/NetralLogo'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--fg)]">
      <div className="grain-paper" />

      {/* Left — Form */}
      <div className="flex-1 flex flex-col px-8 py-10 lg:px-16 relative">
        {/* Top brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <NetralLogo size={26} />
          <span className="font-display text-[19px] tracking-tight">Netral</span>
        </Link>

        <div className="flex-1 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="label-num">№ 01</span>
              <span className="rule flex-1 max-w-[40px]" />
              <span className="label">Authentification</span>
            </div>

            <h1 className="font-display text-[clamp(36px,5vw,52px)] leading-[1] tracking-tight mb-3">
              Bienvenue.
            </h1>
            <p className="text-[14px] text-[var(--fg-muted)] mb-10">
              Connectez-vous pour reprendre votre lecture.
            </p>

            {state?.message && (
              <div className="mb-5 p-3.5 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-[13px]">
                {state.message}
              </div>
            )}

            <form action={action} className="space-y-3">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vous@exemple.com"
                icon={<Mail size={14} strokeWidth={1.8} />}
                error={state?.errors?.email?.[0]}
                autoComplete="email"
                required
              />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mot de passe"
                icon={<Lock size={14} strokeWidth={1.8} />}
                error={state?.errors?.password?.[0]}
                autoComplete="current-password"
                required
              />

              <Button type="submit" variant="ink" className="w-full mt-2" loading={pending}>
                Se connecter
                <ArrowUpRight size={14} />
              </Button>
            </form>

            <p className="mt-6 text-[13px] text-center text-[var(--fg-muted)]">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-[var(--jewel)] hover:underline underline-offset-2 font-medium">
                En créer un
              </Link>
            </p>
          </motion.div>
        </div>

        <p className="text-[11px] text-[var(--fg-subtle)] font-mono">© 2026 Netral · v1.3</p>
      </div>

      {/* Right — Editorial visual */}
      <div className="hidden lg:flex flex-1 bg-[var(--fg)] text-[var(--bg)] items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-md px-12"
        >
          <div className="flex items-center gap-3 mb-12">
            <span className="font-mono text-[10px] tracking-wider opacity-50">№ 01</span>
            <span className="h-px flex-1 max-w-[40px] bg-current opacity-30" />
            <span className="text-[11px] uppercase tracking-[0.14em] opacity-50">Manifesto</span>
          </div>

          <p className="font-display text-[42px] leading-[1.1] tracking-tight">
            « Une bonne <span className="serif-italic" style={{ color: 'var(--jewel)' }}>question</span> compte plus qu'une longue réponse. »
          </p>

          <p className="text-[12px] mt-8 opacity-60">
            — Extrait du manifesto Netral
          </p>
        </motion.div>

        {/* Decorative corner */}
        <div className="absolute top-8 right-8 font-mono text-[10px] opacity-30 tracking-widest">
          NETRAL · 2026
        </div>
        <div className="absolute bottom-8 right-8 font-mono text-[10px] opacity-30 tracking-widest">
          PRESSE NUMÉRIQUE
        </div>
      </div>
    </div>
  )
}
