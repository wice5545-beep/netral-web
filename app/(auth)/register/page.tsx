'use client'

import Link from 'next/link'
import { useActionState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Check } from 'lucide-react'
import { useState } from 'react'
import { signup } from '@/actions/auth'
import { signInWithGoogle } from '@/lib/supabase-auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { useI18n } from '@/lib/i18n'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8 caractères min', ok: password.length >= 8 },
    { label: 'Une lettre', ok: /[a-zA-Z]/.test(password) },
    { label: 'Un chiffre', ok: /[0-9]/.test(password) },
  ]
  if (!password) return null
  return (
    <div className="flex gap-3 mt-1.5">
      {checks.map(({ label, ok }) => (
        <span key={label} className={`flex items-center gap-1 text-[11px] transition-colors ${ok ? 'text-emerald-500' : 'text-[var(--fg-subtle)]'}`}>
          <Check size={10} strokeWidth={ok ? 3 : 1.5} />
          {label}
        </span>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [googlePending, startGoogleTransition] = useTransition()
  const { t } = useI18n()

  function handleGoogle() {
    startGoogleTransition(async () => {
      await signInWithGoogle()
    })
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg)] relative overflow-hidden">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(249,115,22,0.08) 50%, transparent 70%)' }}
          />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'radial-gradient(var(--fg) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center px-12 max-w-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 14, stiffness: 100, delay: 0.15 }}
            className="w-[72px] h-[72px] rounded-[22px] mx-auto mb-8 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)', boxShadow: '0 20px 60px rgba(124,58,237,0.35)' }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 18V6h2.5l7 9.5V6H18v12h-2.5l-7-9.5V18H6z" fill="white"/>
            </svg>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-[32px] font-bold tracking-[-0.04em] mb-3"
          >
            Rejoignez Netral
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[15px] text-[var(--fg-muted)] leading-relaxed"
          >
            Créez votre compte et commencez à utiliser l'IA la plus contextuelle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-8 space-y-2.5"
          >
            {[
              { icon: '✦', text: 'Gratuit pour commencer' },
              { icon: '⚡', text: 'Accès immédiat' },
              { icon: '🔒', text: 'Données sécurisées' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-[13px] text-[var(--fg-muted)]">
                <span className="text-[var(--fg-subtle)]">{icon}</span>
                {text}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[380px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <NetralLogo size={28} />
            <span className="font-bold text-[18px] tracking-tight">Netral</span>
          </div>

          <div className="mb-8">
            <h1 className="text-[26px] font-bold tracking-[-0.025em] mb-1.5">{t.chat.signupTitle}</h1>
            <p className="text-[14px] text-[var(--fg-muted)]">{t.chat.signupSubtitle}</p>
          </div>

          {/* Error banner */}
          {state?.message && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mb-5 p-3.5 rounded-xl bg-red-500/5 border border-red-500/15 text-red-500 text-[13px] flex items-center gap-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {state.message}
            </motion.div>
          )}

          {/* Google OAuth button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googlePending || pending}
            className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg)] text-[14px] font-medium hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
            aria-label="S'inscrire avec Google"
          >
            {googlePending ? (
              <svg className="animate-spin h-4 w-4 text-[var(--fg-muted)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <GoogleIcon />
            )}
            S'inscrire avec Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-[var(--bg)] text-[12px] text-[var(--fg-subtle)]">ou avec email</span>
            </div>
          </div>

          {/* Email/password form */}
          <form action={action} className="space-y-4">
            <Input
              id="name"
              name="name"
              type="text"
              label="Prénom"
              placeholder="Votre prénom"
              error={state?.errors?.name?.[0]}
              autoComplete="given-name"
              required
              maxLength={64}
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="vous@exemple.com"
              error={state?.errors?.email?.[0]}
              autoComplete="email"
              required
              maxLength={254}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[13px] font-medium text-[var(--fg-soft)]">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={[
                    'w-full h-10 px-3.5 pr-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--fg)] text-[14px]',
                    'placeholder:text-[var(--fg-subtle)]',
                    'focus:outline-none focus:border-[var(--border-strong)] focus:shadow-[0_0_0_3px_var(--accent-soft)]',
                    'hover:border-[var(--border-strong)] transition-all duration-200',
                    state?.errors?.password?.[0] ? 'border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,.1)]' : '',
                  ].join(' ')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {state?.errors?.password?.[0] && (
                <p className="text-[12px] text-red-500">{state.errors.password[0]}</p>
              )}
              <PasswordStrength password={password} />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full mt-1" loading={pending}>
              {t.chat.createAccount}
              <ArrowRight size={14} aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-7 text-[13px] text-center text-[var(--fg-muted)]">
            {t.chat.alreadyAccount}{' '}
            <Link href="/login" className="text-[var(--fg)] font-semibold hover:underline underline-offset-2">
              {t.chat.signIn}
            </Link>
          </p>

          <p className="mt-4 text-[11px] text-center text-[var(--fg-subtle)]">
            En créant un compte, vous acceptez nos{' '}
            <Link href="/terms" className="underline underline-offset-2 hover:text-[var(--fg-muted)]">CGU</Link>
            {' '}et notre{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--fg-muted)]">politique de confidentialité</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
