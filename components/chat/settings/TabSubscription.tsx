'use client'

import { cn } from '@/lib/utils'

interface Props {
  userPlan: string
}

export function TabSubscription({ userPlan }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[18px] font-semibold mb-1">Abonnement</h2>
        <p className="text-[13px] text-[var(--fg-muted)]">Gérez votre plan.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { id: 'free', name: 'Free', price: '0€', msgs: '1 msg/jour' },
          { id: 'plus', name: 'Plus', price: '5€', msgs: '150 msgs / 2j' },
          { id: 'pro', name: 'Pro', price: '20€', msgs: '750 msgs / 2j' },
          { id: 'pro_plus', name: 'Pro+', price: '60€', msgs: '2000 msgs / 2j' },
        ].map((p) => (
          <div key={p.id} className={cn('rounded-xl border p-4 transition-all cursor-pointer hover:-translate-y-0.5', userPlan === p.id ? 'border-transparent shadow-colored glass-card' : 'border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-sm')}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[14px] font-bold">{p.name}</p>
              {userPlan === p.id && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full gradient-text bg-[var(--accent-soft)]">ACTIF</span>}
            </div>
            <p className="text-[20px] font-bold">{p.price}<span className="text-[11px] text-[var(--fg-muted)] font-normal">/mois</span></p>
            <p className="text-[11px] text-[var(--fg-muted)] mt-1.5">{p.msgs}</p>
          </div>
        ))}
      </div>
      <a href="/tarifs" className="block">
        <button className="w-full h-10 rounded-xl bg-[var(--accent)] text-[var(--bg)] text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98]">
          Gérer mon abonnement
        </button>
      </a>
    </div>
  )
}
