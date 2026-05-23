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
import { useI18n } from '@/lib/i18n'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined)
  const { t } = useI18n()

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
          <h1 className="text-[26px] font-semibold tracking-[-0.01em] mb-1.5">{t.chat.signupTitle}</h1>
          <p className="text-[14px] text-[var(--fg-muted)]">{t.chat.signupSubtitle}</p>
        </div>

        {state?.message && (
          <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-[13px]">
            {state.message}
          </div>
        )}

        <form action={action} className="space-y-3">
          <Input id="name" name="name" type="text" placeholder="Name" icon={<UserIcon size={14} />} error={state?.errors?.name?.[0]} autoComplete="name" required />
          <Input id="email" name="email" type="email" placeholder="you@example.com" icon={<MailCheckIcon size={14} />} error={state?.errors?.email?.[0]} autoComplete="email" required />
          <Input id="password" name="password" type="password" placeholder="••••••••" icon={<LockIcon size={14} />} error={state?.errors?.password?.[0]} autoComplete="new-password" minLength={8} required />
          <Button type="submit" variant="primary" size="lg" className="w-full mt-1" loading={pending}>
            {t.chat.createAccount}
            <ArrowRight size={14} />
          </Button>
        </form>

        <div className="h-px bg-[var(--border)] my-6" />

        <p className="text-[13px] text-center text-[var(--fg-muted)]">
          {t.chat.alreadyAccount}{' '}
          <Link href="/login" className="text-[var(--fg)] font-medium hover:underline underline-offset-2">{t.chat.signIn}</Link>
        </p>
      </motion.div>
    </div>
  )
}
