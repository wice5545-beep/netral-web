'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for individuals and small projects.',
    features: ['Up to 3 projects', '5 GB storage', 'Basic analytics', 'Email support', 'API access'],
    cta: 'Get started',
    href: '/register',
    popular: false,
  },
  {
    name: 'Pro',
    price: '19',
    description: 'For growing teams that need more power.',
    features: ['Unlimited projects', '50 GB storage', 'Advanced analytics', 'Priority support', 'Custom domains', 'Team collaboration', 'API & webhooks'],
    cta: 'Start free trial',
    href: '/register',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '79',
    description: 'For large organizations with advanced needs.',
    features: ['Everything in Pro', 'Unlimited storage', 'SSO & SAML', 'Dedicated support', 'SLA guarantee', 'Custom integrations', 'Audit logs', 'Compliance reports'],
    cta: 'Contact sales',
    href: '/register',
    popular: false,
  },
]

export function Pricing() {
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
          Simple, transparent pricing
        </motion.h2>
        <motion.p
          className="text-[var(--foreground-muted)] text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          No hidden fees. Cancel anytime.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative rounded-2xl border p-8 flex flex-col ${
              plan.popular
                ? 'border-[var(--accent)] bg-[var(--accent-light)] shadow-xl shadow-[var(--accent)]/10'
                : 'border-[var(--card-border)] bg-[var(--card)]'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge variant="accent" className="px-4 py-1 text-sm">Most popular</Badge>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{plan.name}</h3>
              <p className="text-sm text-[var(--foreground-muted)] mt-1">{plan.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[var(--foreground)]">${plan.price}</span>
                <span className="text-[var(--foreground-muted)]">/month</span>
              </div>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-sm text-[var(--foreground)]">
                  <Check size={16} className="text-[var(--success)] shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            <Link href={plan.href}>
              <Button
                className="w-full"
                variant={plan.popular ? 'primary' : 'outline'}
              >
                {plan.cta}
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
