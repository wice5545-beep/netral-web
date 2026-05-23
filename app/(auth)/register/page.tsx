'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowUpRight, Check } from 'lucide-react'
import { signup } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetralLogo } from '@/components/ui/NetralLogo'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--fg)]">
      <div className="grain-paper" />

      {/* Left — Editorial visual */}
      <div className="hidden lg:flex flex-1 bg-[var(--fg)] text-[var(--bg)] items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-md px-12"
        >
          <div className="flex items-center gap-3 mb-12">
            <span className="font-mono text-[10px] tracking-wider opacity-50">№ 02</span>
            <span className="h-px flex-1 max-w-[40px] bg-current opacity-30" />
            <span className="text-[11px] uppercase tracking-[0.14em] opacity-50">Inscription</span>
          </div>

          <h2 className="font-display text-[42px] leading-[1] tracking-tight mb-8">
            Lisez le monde<br />
            <span className="serif-italic" style={{ color: 'var(--jewel)' }}>autrement.</span>
          </h2>

          <p className="text-[14px] opacity-70 leading-[1.65] mb-10">
            Netral consulte le web pendant que vous lisez. Sources citées. Réponses datées. La précision d'un journaliste.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Recherche en temps réel',
              'Sources vérifiables',
              'Mémoire personnalisée',
              'Gratuit, sans carte',
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <Check size={12} className="opacity-50" />
                <span className="text-[13px] opacity-80">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="absolute top-8 left-8 font-mono text-[10px] opacity-30 tracking-widest">
          NETRAL · 2026
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex flex-col px-8 py-10 lg:px-16 relative">
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
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <span className="label-num">№ 02</span>
              <span className="rule flex-1 max-w-[40px]" />
              <span className="label">Nouveau compte</span>
            </div>

            <h1 className="font-display text-[clamp(36px,5vw,52px)] leading-[1] tracking-tight mb-3">
              Commencez.
            </h1>
            <p className="text-[14px] text-[var(--fg-muted)] mb-10">
              Gratuit. Une minute. Aucune carte requise.
            </p>

            {state?.message && (
              <div className="mb-5 p-3.5 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-[13px]">
                {state.message}
              </div>
            )}

            <form action={action} className="space-y-3">
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Prénom"
                icon={<User size={14} strokeWidth={1.8} />}
                error={state?.errors?.name?.[0]}
                autoComplete="name"
                required
              />
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
                placeholder="Min. 8 caractères"
                icon={<Lock size={14} strokeWidth={1.8} />}
                error={state?.errors?.password?.[0]}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <Button type="submit" variant="ink" className="w-full mt-2" loading={pending}>
                Créer mon compte
                <ArrowUpRight size={14} />
              </Button>
            </form>

            <p className="mt-4 text-[11px] text-center text-[var(--fg-subtle)] leading-relaxed">
              En vous inscrivant vous acceptez nos{' '}
              <Link href="#" className="hover:text-[var(--fg-muted)] underline underline-offset-2">conditions</Link>
              {' & '}
              <Link href="#" className="hover:text-[var(--fg-muted)] underline underline-offset-2">politique de confidentialité</Link>.
            </p>

            <div className="rule my-6" />

            <p className="text-[13px] text-center text-[var(--fg-muted)]">
              Déjà inscrit ?{' '}
              <Link href="/login" className="text-[var(--jewel)] hover:underline underline-offset-2 font-medium">
                Se connecter
              </Link>
            </p>
          </motion.div>
        </div>

        <p className="text-[11px] text-[var(--fg-subtle)] font-mono">© 2026 Netral · v1.3</p>
      </div>
    </div>
  )
}
