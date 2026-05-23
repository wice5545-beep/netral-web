'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { LockIcon } from '@/components/ui/lock'
import { MailCheckIcon } from '@/components/ui/mail-check'
import { UserIcon } from '@/components/ui/user'
import { signup } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetralLogo } from '@/components/ui/NetralLogo'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <NetralLogo size={28} />
          <span className="font-semibold text-[16px]">Netral</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-[26px] font-semibold tracking-[-0.01em] mb-1.5">Créer un compte</h1>
          <p className="text-[14px] text-[var(--fg-muted)]">Gratuit, en moins d'une minute</p>
        </div>

        {state?.message && (
          <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-[13px]">
            {state.message}
          </div>
        )}

        <form action={action} className="space-y-3">
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Prénom"
            icon={<UserIcon size={14} />}
            error={state?.errors?.name?.[0]}
            autoComplete="name"
            required
          />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="vous@exemple.com"
            icon={<MailCheckIcon size={14} />}
            error={state?.errors?.email?.[0]}
            autoComplete="email"
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Mot de passe (min. 8 caractères)"
            icon={<LockIcon size={14} />}
            error={state?.errors?.password?.[0]}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full mt-1" loading={pending}>
            Créer mon compte
            <ArrowRight size={14} />
          </Button>
        </form>

        <p className="mt-4 text-[11px] text-center text-[var(--fg-subtle)] leading-relaxed">
          En créant un compte, vous acceptez nos{' '}
          <Link href="#" className="hover:text-[var(--fg-muted)] underline underline-offset-2">conditions</Link>{' '}
          et notre{' '}
          <Link href="#" className="hover:text-[var(--fg-muted)] underline underline-offset-2">politique de confidentialité</Link>.
        </p>

        <div className="h-px bg-[var(--border)] my-6" />

        <p className="text-[13px] text-center text-[var(--fg-muted)]">
          Déjà inscrit ?{' '}
          <Link href="/login" className="text-[var(--fg)] font-medium hover:underline underline-offset-2">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
