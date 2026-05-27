export const PLANS = {
  free: { name: 'Free', price: 0, messagesPerMonth: 1, messagesPerDay: 1, tokensPerMonth: 500, features: ['1 message/semaine', 'NTRL 1.3 uniquement'] },
  plus: { name: 'Plus', price: 5, messagesPerMonth: 150, messagesPerDay: 20, tokensPerMonth: 50000, features: ['150 messages/mois', 'NTRL 1.3 & 1.2', 'Recherche web'] },
  pro: { name: 'Pro', price: 20, messagesPerMonth: 750, messagesPerDay: 50, tokensPerMonth: 200000, features: ['750 messages/mois', 'Tous les modèles', 'Recherche web', 'Upload fichiers/images'] },
  pro_plus: { name: 'Pro+', price: 60, messagesPerMonth: 2000, messagesPerDay: 100, tokensPerMonth: 500000, features: ['2000 messages/mois', 'Tous les modèles', 'Agent IA', 'Accès anticipé mises à jour', 'Fonctionnalités en avant-première', 'Support prioritaire'] },
} as const

export type PlanId = keyof typeof PLANS

export function getPlanLimit(plan: string): number {
  return PLANS[plan as PlanId]?.messagesPerMonth ?? 1
}

export function getDailyLimit(plan: string): number {
  return PLANS[plan as PlanId]?.messagesPerDay ?? 1
}

export function getTokenLimit(plan: string): number {
  return PLANS[plan as PlanId]?.tokensPerMonth ?? 500
}
