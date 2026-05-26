'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { createSession, deleteSession } from '@/lib/session'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { signInWithPassword, signUpWithPassword } from '@/lib/supabase-auth'

const SignupSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères').max(64).trim(),
  email: z.string().email('Email invalide').max(254).trim(),
  password: z
    .string()
    .min(8, 'Au moins 8 caractères')
    .max(128)
    .regex(/[a-zA-Z]/, 'Doit contenir une lettre')
    .regex(/[0-9]/, 'Doit contenir un chiffre'),
})

const LoginSchema = z.object({
  email: z.string().email('Email invalide').max(254).trim(),
  password: z.string().min(1, 'Mot de passe requis').max(128),
})

export type AuthState = { errors?: Record<string, string[]>; message?: string } | undefined

export async function signup(state: AuthState, formData: FormData): Promise<AuthState> {
  const result = SignupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!result.success) return { errors: result.error.flatten().fieldErrors }

  const { name, email, password } = result.data

  const rl = rateLimit(`signup:${email.toLowerCase()}`, 3, 60 * 60 * 1000)
  if (!rl.allowed) return { message: 'Trop de tentatives. Réessayez plus tard.' }

  try {
    const { rows: existing } = await db.query(`SELECT id FROM "User" WHERE email = $1`, [email.toLowerCase()])
    if (existing[0]) return { errors: { email: ['Cet email est déjà utilisé'] } }

    // Create in Supabase Auth (non-blocking — ignore error if Supabase not configured)
    await signUpWithPassword(email.toLowerCase(), password, name).catch(() => null)

    const id = randomBytes(12).toString('hex')
    const hash = await bcrypt.hash(password, 12)

    await db.query(
      `INSERT INTO "User" (id, name, email, password, onboarded, "preferredModel", plan, "messagesUsed", "messagesResetAt", "createdAt")
       VALUES ($1, $2, $3, $4, false, 'ntrl-1.3', 'free', 0, $5, now())`,
      [id, name, email.toLowerCase(), hash, new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)]
    )

    await createSession(id)
  } catch (e: unknown) {
    if ((e as { digest?: string })?.digest?.includes('NEXT_REDIRECT')) throw e
    return { message: (e as Error).message || 'Erreur lors de la création du compte' }
  }

  redirect('/onboarding')
}

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!result.success) return { errors: result.error.flatten().fieldErrors }

  const { email, password } = result.data

  const rl = rateLimit(`login:${email.toLowerCase()}`, 5, 15 * 60 * 1000)
  if (!rl.allowed) return { message: 'Trop de tentatives. Réessayez dans 15 minutes.' }

  try {
    const { rows } = await db.query(`SELECT id, password, onboarded FROM "User" WHERE email = $1`, [email.toLowerCase()])
    if (!rows[0]) return { errors: { email: ['Email ou mot de passe incorrect'] } }

    const user = rows[0]

    if (!user.password) {
      // First login after migration — try Supabase then set local password
      const { error } = await signInWithPassword(email.toLowerCase(), password)
      if (error) return { errors: { email: ['Email ou mot de passe incorrect'] } }
      const hash = await bcrypt.hash(password, 12)
      await db.query(`UPDATE "User" SET password = $1 WHERE id = $2`, [hash, user.id])
    } else {
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) return { errors: { email: ['Email ou mot de passe incorrect'] } }
    }

    await createSession(user.id)
  } catch (e: unknown) {
    if ((e as { digest?: string })?.digest?.includes('NEXT_REDIRECT')) throw e
    return { message: (e as Error).message || 'Erreur de connexion' }
  }

  redirect('/chat')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}

export async function completeOnboarding(data?: {
  userId?: string
  fullName?: string
  profession?: string
  interests?: string
  tone?: string
}) {
  const { getSession } = await import('@/lib/session')
  const session = await getSession()
  const userId = data?.userId || session?.userId
  if (!userId) return
  await db.query(`UPDATE "User" SET onboarded = true WHERE id = $1`, [userId])
  if (data?.fullName) {
    await db.query(`UPDATE "User" SET name = $1 WHERE id = $2`, [data.fullName, userId])
  }
  redirect('/chat')
}
