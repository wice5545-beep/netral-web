'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Check } from 'lucide-react'
import { signup } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetralLogo } from '@/components/ui/NetralLogo'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left — Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(96,165,250,0.3) 0%, transparent 60%)' }} />
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 px-14 text-white"
        >
          <NetralLogo size={56} animated />
          <h2 className="text-3xl font-semibold mt-8 mb-4 leading-snug">
            L&apos;IA qui<br />recherche pour vous.
          </h2>
          <p className="text-blue-100 text-base leading-relaxed max-w-xs mb-10">
            Créez votre compte et accédez à un assistant IA qui explore Internet en temps réel.
          </p>
          <div className="space-y-3">
            {[
              'Recherche web en temps réel',
              'Mémoire personnalisée',
              'Sources citées et vérifiées',
              'Gratuit et sans limite',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-white" />
                </div>
                <span className="text-sm text-blue-50">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <NetralLogo size={26} />
            <span className="font-semibold text-gray-900">Netral</span>
          </Link>

          <h1 className="text-2xl font-semibold text-gray-900 mb-1 tracking-tight">Créer votre compte</h1>
          <p className="text-sm text-gray-500 mb-8">Gratuit · Sans carte bancaire</p>

          {state?.message && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {state.message}
            </div>
          )}

          <form action={action} className="space-y-3">
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Votre nom"
              icon={<User size={15} />}
              error={state?.errors?.name?.[0]}
              autoComplete="name"
              required
            />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="votre@email.com"
              icon={<Mail size={15} />}
              error={state?.errors?.email?.[0]}
              autoComplete="email"
              required
            />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 8 caractères"
              icon={<Lock size={15} />}
              error={state?.errors?.password?.[0]}
              autoComplete="new-password"
              required
            />

            <Button
              type="submit"
              className="w-full rounded-xl py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium gap-2 border-0 mt-1"
              loading={pending}
            >
              Créer mon compte
              <ArrowRight size={15} />
            </Button>
          </form>

          <p className="mt-4 text-xs text-center text-gray-400">
            En créant un compte, vous acceptez nos{' '}
            <Link href="#" className="hover:text-gray-600 underline underline-offset-2">CGU</Link>
            {' & '}
            <Link href="#" className="hover:text-gray-600 underline underline-offset-2">Confidentialité</Link>
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-center text-gray-500">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Se connecter
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
