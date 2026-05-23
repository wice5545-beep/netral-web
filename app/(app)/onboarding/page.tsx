import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'

export default async function OnboardingPage() {
  const session = await getSession()
  if (!session?.userId) redirect('/login')

  const { rows } = await db.query(`SELECT id, name, onboarded FROM "User" WHERE id = $1`, [session.userId])
  const user = rows[0]
  if (!user) redirect('/login')
  if (user.onboarded) redirect('/chat')

  return <OnboardingWizard userId={user.id} defaultName={user.name ?? undefined} />
}
