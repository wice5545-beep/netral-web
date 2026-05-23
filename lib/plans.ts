export const PLANS = {
  free: { name: 'Free', price: 0, messagesPerMonth: 1, features: ['1 message/jour', 'NTRL 1.0 uniquement'] },
  plus: { name: 'Plus', price: 5, messagesPerMonth: 150, features: ['150 messages/mois', 'NTRL 1.0 & 1.3', 'Recherche web'] },
  pro: { name: 'Pro', price: 20, messagesPerMonth: 750, features: ['750 messages/mois', 'Tous les modèles', 'Recherche web', 'Upload fichiers/images'] },
  pro_plus: { name: 'Pro+', price: 60, messagesPerMonth: 2000, features: ['2000 messages/mois', 'Tous les modèles', 'Agent IA', 'Accès anticipé mises à jour', 'Fonctionnalités en avant-première', 'Support prioritaire'] },
} as const

export type PlanId = keyof typeof PLANS

export function getPlanLimit(plan: string): number {
  return PLANS[plan as PlanId]?.messagesPerMonth ?? 1
}
