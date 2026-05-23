'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { LockIcon } from '@/components/ui/lock'
import { MailCheckIcon } from '@/components/ui/mail-check'
import { login } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { useI18n } from '@/lib/i18n'
import { AutoAnimate } from '@/components/ui/AutoAnimate'
import { SparklesIcon } from '@/components/ui/sparkles'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)
  const { t } = useI18n()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[var(--accent-soft)] to-transparent blur-3xl opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-12">
          <NetralLogo size={30} />
          <span className="font-bold text-[18px] tracking-tight">Netral</span>
        </Link>

        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-[28px] font-bold tracking-[-0.02em] mb-2"
          >
            {t.chat.loginTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[14px] text-[var(--fg-muted)]"
          >
            {t.chat.loginSubtitle}
          </motion.p>
        </div>

        {state?.message && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[13px]">
            {state.message}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-md)]"
        >
          <form action={action} className="space-y-4">
            <Input id="email" name="email" type="email" placeholder="you@example.com" icon={<MailCheckIcon size={14} />} error={state?.errors?.email?.[0]} autoComplete="email" required />
            <Input id="password" name="password" type="password" placeholder="••••••••" icon={<LockIcon size={14} />} error={state?.errors?.password?.[0]} autoComplete="current-password" required />
            <Button type="submit" variant="primary" size="lg" className="w-full" loading={pending}>
              {t.chat.signIn}
              <ArrowRight size={14} />
            </Button>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-[13px] text-center text-[var(--fg-muted)]"
        >
          {t.chat.noAccount}{' '}
          <Link href="/register" className="text-[var(--fg)] font-medium hover:underline underline-offset-2">{t.chat.createOne}</Link>
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-center mt-4">
          <AutoAnimate icon={SparklesIcon} size={14} className="text-[var(--fg-subtle)]" interval={4000} />
        </motion.div>
      </motion.div>
    </div>
  )
}
