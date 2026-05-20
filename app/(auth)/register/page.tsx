'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { signup } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[var(--accent)] to-purple-600 relative overflow-hidden items-end p-12">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-white text-4xl font-bold mb-4">Start building today.</p>
          <p className="text-white/70 text-lg">Create your account and get started in minutes.</p>
          <div className="mt-8 space-y-3">
            {['Free plan, no credit card', 'Deploy in 2 minutes', '10,000+ teams trust us'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/80 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--background)]">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-xl font-bold text-[var(--foreground)] block mb-10">
            Netral
          </Link>

          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">Create an account</h1>
          <p className="text-sm text-[var(--foreground-muted)] mb-8">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">
              Sign in
            </Link>
          </p>

          {state?.message && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {state.message}
            </div>
          )}

          <form action={action} className="space-y-4">
            <Input
              id="name"
              name="name"
              type="text"
              label="Full name"
              placeholder="John Doe"
              icon={<User size={16} />}
              error={state?.errors?.name?.[0]}
              autoComplete="name"
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              error={state?.errors?.email?.[0]}
              autoComplete="email"
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Min. 8 characters"
              icon={<Lock size={16} />}
              error={state?.errors?.password?.[0]}
              autoComplete="new-password"
            />

            {state?.errors?.password && state.errors.password.length > 1 && (
              <ul className="text-xs text-[var(--danger)] space-y-1 pl-4">
                {state.errors.password.map((e: string) => (
                  <li key={e} className="list-disc">{e}</li>
                ))}
              </ul>
            )}

            <Button type="submit" className="w-full gap-2 mt-2" loading={pending} size="lg">
              Create account
              <ArrowRight size={16} />
            </Button>
          </form>

          <p className="mt-4 text-xs text-center text-[var(--foreground-muted)]">
            By signing up, you agree to our{' '}
            <Link href="#" className="text-[var(--accent)] hover:underline">Terms</Link>
            {' '}and{' '}
            <Link href="#" className="text-[var(--accent)] hover:underline">Privacy Policy</Link>
          </p>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[var(--background)] text-[var(--foreground-muted)]">or continue with</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full h-10 rounded-xl border border-[var(--border)] flex items-center justify-center gap-3 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </motion.div>
      </div>
    </div>
  )
}
