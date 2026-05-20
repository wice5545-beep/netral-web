'use server'

import { z } from 'zod'
import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'

const SettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().optional(),
  notifications: z.boolean().optional(),
  emailDigest: z.boolean().optional(),
  twoFactor: z.boolean().optional(),
  parentalEnabled: z.boolean().optional(),
})

export async function updateSettings(data: z.infer<typeof SettingsSchema>) {
  const session = await verifySession()
  const parsed = SettingsSchema.safeParse(data)
  if (!parsed.success) return { error: 'Données invalides' }

  await prisma.settings.upsert({
    where: { userId: session.userId },
    update: parsed.data,
    create: { userId: session.userId, ...parsed.data },
  })

  return { success: true }
}

type ProfileState = { error?: string; success?: boolean } | undefined

export async function updateProfile(state: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await verifySession()
  const name = formData.get('name') as string

  if (!name || name.trim().length < 2) {
    return { error: 'Le nom doit faire au moins 2 caractères' }
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { name: name.trim() },
  })

  return { success: true }
}
