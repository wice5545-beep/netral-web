'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Shield, Globe, Brain, MessageSquare, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NetralLogo } from '@/components/ui/NetralLogo'

function OrbHero() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 420, height: 420 }}>
      {/* Glow rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-blue-200/40"
          style={{ inset: i * 30 }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}
      {/* Outer glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 260, height: 260,
          background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Main orb */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <NetralLogo size={120} animated />
      </motion.div>
      {/* Floating badges */}
      {[
        { label: 'Web Search', x: -160, y: -60, delay: 0 },
        { label: 'Memory', x: 140, y: -80, delay: 0.3 },
        { label: 'Streaming', x: -140, y: 80, delay: 0.6 },
        { label: 'Sécurisé', x: 130, y: 70, delay: 0.9 },
      ].map((b) => (
        <motion.div
          key={b.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + b.delay, duration: 0.5 }}
          className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm text-xs font-medium text-gray-700"
          style={{ left: '50%', top: '50%', transform: `translate(calc(-50% + ${b.x}px), calc(-50% + ${b.y}px))` }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          {b.label}
        </motion.div>
      ))}
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Subtle background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vh] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(219,234,254,0.5) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(191,219,254,0.3) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <NetralLogo size={28} />
          <span className="font-semibold tracking-tight text-lg text-gray-900">Netral</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
          <Link href="#features" className="hover:text-gray-900 transition-colors">Fonctionnalités</Link>
          <Link href="#models" className="hover:text-gray-900 transition-colors">Modèles</Link>
          <Link href="#pricing" className="hover:text-gray-900 transition-colors">Tarifs</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-gray-600">Connexion</Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 gap-1.5 border-0">
              Commencer
              <ArrowRight size={13} />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-xs font-medium text-blue-700 mb-6"
            >
              <Sparkles size={11} className="text-blue-500" />
              Netral 1.3 — Maintenant avec mémoire & recherche web
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.06] mb-5 text-gray-900"
            >
              Explorez.{' '}
              <br />
              Comprenez.{' '}
              <br />
              <span className="glow-text">Décidez avec clarté.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-500 max-w-lg leading-relaxed mb-8"
            >
              Netral est un assistant IA nouvelle génération qui recherche, analyse et vous répond en temps réel avec des données fraîches et des sources vérifiées.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
            >
              <Link href="/register">
                <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
                  Démarrer gratuitement
                  <ArrowRight size={15} />
                </button>
              </Link>
              <Link href="/login">
                <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium text-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                  Se connecter
                </button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-5 text-xs text-gray-400 text-center lg:text-left"
            >
              Gratuit · Sans carte bancaire · Aucune installation
            </motion.p>
          </div>

          {/* Right — Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 hidden lg:flex"
          >
            <OrbHero />
          </motion.div>
        </div>

        {/* Chat preview card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 relative max-w-3xl mx-auto"
        >
          <div className="rounded-2xl bg-white border border-gray-200 shadow-[0_8px_60px_-10px_rgba(0,0,0,0.12)] overflow-hidden">
            <div className="h-9 flex items-center px-4 gap-1.5 border-b border-gray-100 bg-gray-50/60">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              <span className="ml-3 text-xs text-gray-400 font-medium">netral.app/chat</span>
            </div>
            <div className="p-6 md:p-8 space-y-5 text-left">
              <div className="flex justify-end">
                <div className="px-4 py-2.5 rounded-2xl rounded-tr-md bg-blue-50 border border-blue-100 text-sm text-gray-800 max-w-[80%]">
                  Quelles sont les dernières avancées en IA générative en 2025 ?
                </div>
              </div>
              {/* Search status */}
              <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                <Globe size={12} className="search-pulse" />
                <span className="search-pulse">Recherche web en cours…</span>
              </div>
              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <NetralLogo size={26} />
                </div>
                <div className="flex-1 text-sm leading-relaxed text-gray-600 space-y-2">
                  <p>Voici les avancées majeures en IA générative en 2025&nbsp;:</p>
                  <p className="text-gray-900"><strong>GPT-5 et Claude 4</strong> — raisonnement multi-étapes avec mémoire longue <sup className="text-blue-600">[1]</sup></p>
                  <p className="text-gray-900"><strong>Agents autonomes</strong> — les LLM peuvent maintenant exécuter des tâches complexes <sup className="text-blue-600">[2]</sup></p>
                  <p className="text-gray-900"><strong>Multimodal natif</strong> — image, audio, vidéo unifiés<span className="stream-cursor"></span></p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {['techcrunch.com', 'arxiv.org', 'openai.com'].map((src) => (
                      <div key={src} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700">
                        <div className="w-3 h-3 rounded-sm bg-blue-200" />
                        {src}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Un assistant qui va sur Internet pour vous, lit les sources, et répond avec précision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Globe,
              title: 'Recherche web temps réel',
              desc: 'Netral explore Internet en direct pour vous donner des réponses avec des sources récentes et vérifiées.',
              color: 'blue',
            },
            {
              icon: Brain,
              title: 'Mémoire personnalisée',
              desc: 'Netral se souvient de votre nom, votre métier, vos préférences. Chaque conversation est personnalisée.',
              color: 'violet',
            },
            {
              icon: Zap,
              title: 'Streaming ultra-rapide',
              desc: 'Les réponses apparaissent en temps réel, token par token. Aucune attente, une fluidité parfaite.',
              color: 'yellow',
            },
            {
              icon: MessageSquare,
              title: 'Sources & citations',
              desc: 'Chaque affirmation est citée [1][2]. Les sources sont affichées en cartes avec aperçu du site.',
              color: 'emerald',
            },
            {
              icon: Shield,
              title: 'Données privées',
              desc: 'Vos conversations restent vôtres. Effacez votre mémoire à tout moment, aucun tracking.',
              color: 'rose',
            },
            {
              icon: Sparkles,
              title: 'Deux modèles IA',
              desc: 'NTRL 1.3 (Mistral) pour la précision, NTRL 1.0 (Llama 3.3 70B) pour la créativité et la vitesse.',
              color: 'orange',
            },
          ].map((f, i) => {
            const Icon = f.icon
            const colorMap: Record<string, { bg: string; icon: string }> = {
              blue: { bg: 'bg-blue-50 border-blue-100', icon: 'text-blue-600' },
              violet: { bg: 'bg-violet-50 border-violet-100', icon: 'text-violet-600' },
              yellow: { bg: 'bg-amber-50 border-amber-100', icon: 'text-amber-600' },
              emerald: { bg: 'bg-emerald-50 border-emerald-100', icon: 'text-emerald-600' },
              rose: { bg: 'bg-rose-50 border-rose-100', icon: 'text-rose-600' },
              orange: { bg: 'bg-orange-50 border-orange-100', icon: 'text-orange-600' },
            }
            const c = colorMap[f.color]
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-gray-100/80 hover:-translate-y-0.5 transition-all card-shadow"
              >
                <div className={`w-10 h-10 rounded-xl ${c.bg} border flex items-center justify-center mb-4`}>
                  <Icon size={18} className={c.icon} />
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-center text-white overflow-hidden relative"
        >
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Prêt à essayer Netral ?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Gratuit, sans carte bancaire. Commencez à chatter en moins d&apos;une minute.
            </p>
            <Link href="/register">
              <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 transition-all hover:shadow-xl hover:-translate-y-0.5">
                Créer un compte gratuit
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <NetralLogo size={18} />
          <span className="font-medium text-gray-600">Netral</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="#" className="hover:text-gray-700 transition-colors">Confidentialité</Link>
          <Link href="#" className="hover:text-gray-700 transition-colors">Conditions</Link>
          <Link href="#" className="hover:text-gray-700 transition-colors">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
