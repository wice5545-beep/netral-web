'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Shield, Globe, Brain, MessageSquare, Check } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'

const features = [
  {
    icon: Globe,
    title: 'Recherche web temps réel',
    desc: 'Netral explore Internet en direct et répond avec des sources récentes et vérifiées.',
    color: 'orange',
  },
  {
    icon: Brain,
    title: 'Mémoire personnalisée',
    desc: "Netral se souvient de vous. Chaque conversation s'adapte à votre profil.",
    color: 'amber',
  },
  {
    icon: Zap,
    title: 'Streaming ultra-rapide',
    desc: 'Réponses token par token, en temps réel. Aucune attente.',
    color: 'yellow',
  },
  {
    icon: MessageSquare,
    title: 'Sources & citations',
    desc: 'Chaque affirmation est citée [1][2]. Les sources sont cliquables.',
    color: 'rose',
  },
  {
    icon: Shield,
    title: 'Données privées',
    desc: "Vos conversations restent vôtres. Effacez votre mémoire à tout moment.",
    color: 'emerald',
  },
  {
    icon: Sparkles,
    title: 'Multi-modèles',
    desc: 'NTRL 1.3 (Mistral) pour la précision, NTRL 1.0 (Llama 70B) pour la vitesse.',
    color: 'violet',
  },
]

const colorMap: Record<string, { card: string; icon: string; dot: string }> = {
  orange: { card: 'bg-orange-50 border-orange-100', icon: 'text-orange-500', dot: 'bg-orange-400' },
  amber: { card: 'bg-amber-50 border-amber-100', icon: 'text-amber-500', dot: 'bg-amber-400' },
  yellow: { card: 'bg-yellow-50 border-yellow-100', icon: 'text-yellow-500', dot: 'bg-yellow-400' },
  rose: { card: 'bg-rose-50 border-rose-100', icon: 'text-rose-500', dot: 'bg-rose-400' },
  emerald: { card: 'bg-emerald-50 border-emerald-100', icon: 'text-emerald-500', dot: 'bg-emerald-400' },
  violet: { card: 'bg-violet-50 border-violet-100', icon: 'text-violet-500', dot: 'bg-violet-400' },
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Warm background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #fed7aa 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #fde68a 0%, transparent 70%)', filter: 'blur(100px)' }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <NetralLogo size={28} />
          <span className="font-bold tracking-tight text-xl text-gray-900">Netral</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-500">
          <Link href="#features" className="hover:text-gray-900 transition-colors">Fonctionnalités</Link>
          <Link href="#pricing" className="hover:text-gray-900 transition-colors">Tarifs</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-50">
              Connexion
            </button>
          </Link>
          <Link href="/register">
            <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-px">
              Commencer <ArrowRight size={13} />
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600 mb-7"
            >
              <Sparkles size={11} />
              Netral 1.3 · Mémoire & Recherche web
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.04] mb-6 text-gray-900"
            >
              L&apos;IA qui<br />
              <span className="glow-text">cherche pour vous.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-lg text-gray-500 max-w-md leading-relaxed mb-9"
            >
              Netral recherche sur Internet en temps réel, lit les sources et vous répond avec précision et citations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
            >
              <Link href="/register">
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all hover:shadow-xl hover:shadow-orange-200 hover:-translate-y-0.5">
                  Démarrer gratuitement
                  <ArrowRight size={15} />
                </button>
              </Link>
              <Link href="/login">
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white border border-gray-200 hover:border-orange-200 text-gray-700 font-semibold text-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                  Se connecter
                </button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-5 text-xs text-gray-400 text-center lg:text-left flex items-center justify-center lg:justify-start gap-4"
            >
              <span className="flex items-center gap-1.5"><Check size={10} className="text-orange-400" /> Gratuit</span>
              <span className="flex items-center gap-1.5"><Check size={10} className="text-orange-400" /> Sans carte bancaire</span>
              <span className="flex items-center gap-1.5"><Check size={10} className="text-orange-400" /> Aucune installation</span>
            </motion.p>
          </div>

          {/* Right — Chat preview */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md lg:max-w-lg shrink-0"
          >
            <div className="rounded-3xl bg-white border border-gray-150 shadow-[0_20px_80px_-10px_rgba(249,115,22,0.12),0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Window chrome */}
              <div className="h-10 flex items-center px-4 gap-1.5 border-b border-gray-100 bg-[#fdfaf5]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                <span className="ml-3 text-xs text-gray-400 font-medium">netral.app</span>
              </div>
              <div className="p-6 space-y-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm bg-orange-50 border border-orange-100 text-sm text-gray-800 max-w-[85%]">
                    Quelles sont les dernières avancées en IA en 2025 ?
                  </div>
                </div>
                {/* Search status */}
                <div className="flex items-center gap-2 text-xs text-orange-500 font-medium">
                  <Globe size={12} className="search-pulse" />
                  <span className="search-pulse">Recherche web en cours…</span>
                </div>
                {/* AI response */}
                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    <NetralLogo size={24} animated />
                  </div>
                  <div className="flex-1 text-sm leading-relaxed text-gray-600 space-y-2">
                    <p>Voici les avancées majeures en IA générative en 2025 :</p>
                    <p className="text-gray-900 font-medium">GPT-5 et Claude 4 <sup className="text-orange-500 text-[10px]">[1]</sup> — raisonnement multi-étapes avancé</p>
                    <p className="text-gray-900 font-medium">Agents autonomes <sup className="text-orange-500 text-[10px]">[2]</sup> — exécution de tâches complexes<span className="stream-cursor" /></p>
                    {/* Source chips */}
                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      {['techcrunch.com', 'arxiv.org'].map((src) => (
                        <div key={src} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-100 text-xs text-orange-600 font-medium">
                          <div className="w-2.5 h-2.5 rounded-sm bg-orange-200" />
                          {src}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 bg-[#fdfaf5] border-y border-orange-100/60 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-gray-500 text-lg max-w-lg mx-auto">
              Un assistant qui lit Internet pour vous, cite ses sources, et se souvient de qui vous êtes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon
              const c = colorMap[f.color]
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-orange-50 hover:-translate-y-0.5 transition-all card-shadow"
                >
                  <div className={`w-10 h-10 rounded-xl ${c.card} border flex items-center justify-center mb-4`}>
                    <Icon size={18} className={c.icon} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)' }}
        >
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.5) 0%, transparent 50%)' }} />
          <div className="relative z-10 px-10 py-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Prêt à essayer Netral ?
            </h2>
            <p className="text-orange-100 text-lg mb-9 max-w-md mx-auto">
              Gratuit, sans carte bancaire. Lancez votre première conversation en moins d&apos;une minute.
            </p>
            <Link href="/register">
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-orange-600 font-bold text-sm hover:bg-orange-50 transition-all hover:shadow-2xl hover:-translate-y-0.5">
                Créer un compte gratuit
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
        <div className="flex items-center gap-2.5">
          <NetralLogo size={18} />
          <span className="font-semibold text-gray-700">Netral</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#" className="hover:text-gray-700 transition-colors">Confidentialité</Link>
          <Link href="#" className="hover:text-gray-700 transition-colors">Conditions</Link>
          <Link href="#" className="hover:text-gray-700 transition-colors">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
