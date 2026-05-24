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

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)
  const { t } = useI18n()

  return (
    <div className="min-h-screen flex bg-[var(--bg)] relative overflow-hidden">
      {/* Left — branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] gradient-orb rounded-full" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(var(--fg) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center px-12">
          <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 12, delay: 0.2 }} className="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-colored" style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M6 18V6h2.5l7 9.5V6H18v12h-2.5l-7-9.5V18H6z" fill="white"/></svg>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-[28px] font-bold tracking-[-0.03em] mb-3">
            Netral
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[15px] text-[var(--fg-muted)] max-w-[260px] mx-auto leading-relaxed">
            L'intelligence qui comprend votre contexte.
          </motion.p>
        </motion.div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[380px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <NetralLogo size={28} />
            <span className="font-bold text-[18px]">Netral</span>
          </div>

          <div className="mb-8">
            <h1 className="text-[26px] font-bold tracking-[-0.02em] mb-2">{t.chat.loginTitle}</h1>
            <p className="text-[14px] text-[var(--fg-muted)]">{t.chat.loginSubtitle}</p>
          </div>

          {state?.message && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-3.5 rounded-xl bg-red-500/5 border border-red-500/15 text-red-500 text-[13px] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {state.message}
            </motion.div>
          )}

          <form action={action} className="space-y-4">
            <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" icon={<MailCheckIcon size={14} />} error={state?.errors?.email?.[0]} autoComplete="email" required />
            <Input id="password" name="password" type="password" label="Mot de passe" placeholder="••••••••" icon={<LockIcon size={14} />} error={state?.errors?.password?.[0]} autoComplete="current-password" required />
            <Button type="submit" variant="primary" size="lg" className="w-full mt-2" loading={pending}>
              {t.chat.signIn}
              <ArrowRight size={14} />
            </Button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
            <div className="relative flex justify-center"><span className="px-3 bg-[var(--bg)] text-[12px] text-[var(--fg-subtle)]">ou</span></div>
          </div>

          <p className="text-[13px] text-center text-[var(--fg-muted)]">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-[var(--fg)] font-semibold hover:underline underline-offset-2">{t.chat.createOne}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
