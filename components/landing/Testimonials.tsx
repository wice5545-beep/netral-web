'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CTO at Pulse',
    avatar: 'SC',
    content: "Netral transformed how our engineering team works. We shipped 3x faster in the first month. The analytics alone are worth it.",
    rating: 5,
  },
  {
    name: 'Marcus Williams',
    role: 'Founder at Buildkit',
    avatar: 'MW',
    content: "I've tried every tool out there. Netral is the first one that actually feels built for how modern teams work. Incredible UX.",
    rating: 5,
  },
  {
    name: 'Elena Rossi',
    role: 'Product Lead at Vertex',
    avatar: 'ER',
    content: "The dashboard is beautiful and the data is actionable. Our stakeholders love the reports we can generate in seconds.",
    rating: 5,
  },
  {
    name: 'James Park',
    role: 'Engineering Manager at Qubit',
    avatar: 'JP',
    content: "Security was our biggest concern. Netral's enterprise controls and audit logs gave us everything compliance needed.",
    rating: 5,
  },
  {
    name: 'Aisha Okafor',
    role: 'CEO at Launchpad',
    avatar: 'AO',
    content: "We onboarded our entire team in a day. The collaboration features are seamless and the support team is world-class.",
    rating: 5,
  },
  {
    name: 'Tom Erikson',
    role: 'Lead Developer at Arch',
    avatar: 'TE',
    content: "The API is clean, the webhooks work perfectly, and the docs are actually good. A rare combination in SaaS tools.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Loved by teams worldwide
        </motion.h2>
        <motion.p
          className="text-[var(--foreground-muted)] text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Join 10,000+ teams already using Netral
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className="h-full">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-[var(--foreground)] leading-relaxed mb-6">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{t.name}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{t.role}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
