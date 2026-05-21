'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { login } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetralLogo } from '@/components/ui/NetralLogo'

function AuthOrb() {
  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[300px]">
      {/* Rings */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-blue-200/50"
          style={{ width: 80 + i * 60, height: 80 + i * 60 }}
          animate={{ scale: [1, 1.03, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        />
      ))}
      {/* Glow */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 200, height: 200, background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
        <NetralLogo size={80} animated />
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="flex items-center gap-2 mb-10">
            <NetralLogo size={28} />
            <span className="font-semibold text-lg text-gray-900">Netral</span>
          </Link>

          <h1 className="text-2xl font-semibold text-gray-900 mb-1 tracking-tight">Connexion à votre compte</h1>
          <p className="text-sm text-gray-500 mb-8">
            Continuez avec Google ou entrez vos identifiants.
          </p>

          {/* Social */}
          <div className="space-y-2.5 mb-6">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continuer avec Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              Continuer avec GitHub
            </button>
          </div>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">ou</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {state?.message && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
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
              className="w-full rounded-xl py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium gap-2 border-0 mt-1"
              loading={pending}
            >
              Se connecter
              <ArrowRight size={15} />
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-50 via-blue-50/80 to-white items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(219,234,254,0.8) 0%, transparent 70%)' }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center text-center px-12"
        >
          <AuthOrb />
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Bienvenue dans Netral</h2>
          <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
            Votre assistant IA personnel qui recherche, comprend et vous aide à décider.
          </p>
          <div className="flex items-center gap-4 mt-6">
            {[
              { label: 'Utilisateurs', value: '10k+' },
              { label: 'Réponses', value: '500k+' },
              { label: 'Satisfaction', value: '98%' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-semibold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
