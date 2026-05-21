'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Globe, Brain, Sparkles } from 'lucide-react'
import { login } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetralLogo } from '@/components/ui/NetralLogo'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 lg:px-16 relative">
        {/* Warm glow */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(254,215,170,0.4) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm relative z-10"
        >
          <Link href="/" className="flex items-center gap-2 mb-12">
            <NetralLogo size={28} />
            <span className="font-bold text-xl text-gray-900">Netral</span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Bon retour 👋</h1>
          <p className="text-sm text-gray-500 mb-8">
            Connectez-vous pour accéder à votre assistant.
          </p>

          {state?.message && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {state.message}
            </div>
          )}

          <form action={action} className="space-y-3">
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
              placeholder="Mot de passe"
              icon={<Lock size={15} />}
              error={state?.errors?.password?.[0]}
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              className="w-full rounded-xl py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold gap-2 border-0 mt-2 shadow-lg shadow-orange-200/50"
              loading={pending}
            >
              Se connecter
              <ArrowRight size={15} />
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-orange-500 hover:text-orange-600 font-semibold">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right — Visual panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-[#fdfaf5]">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(253,186,116,0.25) 0%, transparent 65%)' }}
        />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center text-center px-14"
        >
          {/* Animated orb */}
          <div className="relative mb-10">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-orange-200/50"
                style={{ inset: -(i * 28) }}
                animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.55, 0.3] }}
                transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              />
            ))}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <NetralLogo size={80} animated />
            </motion.div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Bienvenue dans Netral</h2>
          <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-10">
            Votre assistant IA qui explore Internet et répond avec des sources fraîches.
          </p>

          {/* Feature pills */}
          <div className="space-y-2.5 w-full max-w-xs">
            {[
              { icon: Globe, label: 'Recherche web en temps réel', color: 'text-orange-500 bg-orange-50 border-orange-100' },
              { icon: Brain, label: 'Mémoire personnalisée', color: 'text-amber-500 bg-amber-50 border-amber-100' },
              { icon: Sparkles, label: 'Sources citées et vérifiées', color: 'text-rose-500 bg-rose-50 border-rose-100' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${item.color}`}>
                  <Icon size={15} />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
