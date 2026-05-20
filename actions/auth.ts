'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createSession, deleteSession } from '@/lib/session'

const SignupSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères').trim(),
  email: z.string().email('Email invalide').trim(),
  password: z
    .string()
    .min(8, 'Au moins 8 caractères')
    .regex(/[a-zA-Z]/, 'Doit contenir une lettre')
    .regex(/[0-9]/, 'Doit contenir un chiffre'),
})

const LoginSchema = z.object({
  email: z.string().email('Email invalide').trim(),
  password: z.string().min(1, 'Mot de passe requis'),
})

export type AuthState = {
  errors?: Record<string, string[]>
  message?: string
} | undefined

export async function signup(state: AuthState, formData: FormData): Promise<AuthState> {
  const result = SignupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { name, email, password } = result.data
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return { errors: { email: ['Cet email est déjà utilisé'] } }
    }

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    await prisma.settings.create({ data: { userId: user.id } })
    await createSession(user.id)
  } catch {
    return { message: 'Une erreur est survenue lors de la création du compte.' }
  }

  redirect('/onboarding')
}

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { email, password } = result.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.password) {
    return { errors: { email: ['Email ou mot de passe incorrect'] } }
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return { errors: { email: ['Email ou mot de passe incorrect'] } }
  }

  await createSession(user.id)

  if (!user.onboarded) {
    redirect('/onboarding')
  }
  redirect('/dashboard')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}

export async function completeOnboarding(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { onboarded: true },
  })
  redirect('/dashboard')
}
