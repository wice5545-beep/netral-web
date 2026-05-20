'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, BarChart3, Users, Globe, Lock } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const features = [
  {
    icon: Zap,
    title: 'Lightning fast',
    description: 'Built on edge infrastructure. Sub-100ms response times globally with zero cold starts.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Shield,
    title: 'Enterprise security',
    description: 'SOC2 compliant, end-to-end encryption, and granular access controls out of the box.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: BarChart3,
    title: 'Deep analytics',
    description: 'Real-time dashboards with custom metrics, funnels, and cohort analysis.',
    color: 'text-[var(--accent)]',
    bg: 'bg-[var(--accent)]/10',
  },
  {
    icon: Users,
    title: 'Team collaboration',
    description: 'Built for teams. Real-time editing, comments, and role-based permissions.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description: 'Deploy to 200+ edge locations. Your users get the fastest experience possible.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Lock,
    title: 'Privacy first',
    description: 'GDPR compliant. Your data stays yours. We never sell or share your information.',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Features() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground-muted)] text-sm mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Features
        </motion.div>
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Everything you need
        </motion.h2>
        <motion.p
          className="text-[var(--foreground-muted)] text-lg max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          A complete platform that grows with your team, from startup to enterprise.
        </motion.p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <motion.div key={feature.title} variants={cardVariants}>
              <Card hover className="h-full group">
                <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={22} className={feature.color} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
