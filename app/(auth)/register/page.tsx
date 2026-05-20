'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { signup } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { AmbientBackground } from '@/components/layout/AmbientBackground'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <AmbientBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-10">
          <NetralLogo size={36} animated />
          <span className="font-semibold tracking-tight text-2xl">Netral</span>
        </Link>

        <div className="glass-strong rounded-3xl p-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Create your account</h1>
          <p className="text-sm text-[var(--foreground-muted)] mb-6">
            Free forever. No credit card required.
          </p>

          {state?.message && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {state.message}
            </div>
          )}

          <form action={action} className="space-y-3">
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              icon={<User size={16} />}
              error={state?.errors?.name?.[0]}
              autoComplete="name"
              required
            />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              error={state?.errors?.email?.[0]}
              autoComplete="email"
              required
            />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              icon={<Lock size={16} />}
              error={state?.errors?.password?.[0]}
              autoComplete="new-password"
              required
            />

            <Button type="submit" variant="glow" className="w-full gap-2 mt-2" loading={pending} size="lg">
              Create account
              <ArrowRight size={16} />
            </Button>
          </form>

          <p className="mt-4 text-xs text-center text-[var(--foreground-subtle)]">
            By signing up, you agree to our{' '}
            <Link href="#" className="hover:text-[var(--foreground)] underline-offset-2 hover:underline">Terms</Link>
            {' & '}
            <Link href="#" className="hover:text-[var(--foreground)] underline-offset-2 hover:underline">Privacy</Link>
          </p>

          <div className="mt-6 pt-6 border-t border-[var(--border)] text-sm text-center text-[var(--foreground-muted)]">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
