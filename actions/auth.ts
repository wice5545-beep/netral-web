'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createSession, deleteSession } from '@/lib/session'

const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email').trim(),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[a-zA-Z]/, 'Must contain a letter')
    .regex(/[0-9]/, 'Must contain a number'),
})

const LoginSchema = z.object({
  email: z.string().email('Invalid email').trim(),
  password: z.string().min(1, 'Password required'),
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
      return { errors: { email: ['This email is already in use'] } }
    }

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    // Seed memory with initial name
    await prisma.memory.create({
      data: { userId: user.id, fullName: name },
    })

    await createSession(user.id)
  } catch {
    return { message: 'An error occurred while creating your account.' }
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
    return { errors: { email: ['Invalid email or password'] } }
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return { errors: { email: ['Invalid email or password'] } }
  }

  await createSession(user.id)

  if (!user.onboarded) {
    redirect('/onboarding')
  }
  redirect('/chat')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}

export async function completeOnboarding(data: {
  userId: string
  fullName?: string
  profession?: string
  interests?: string
  tone?: string
}) {
  await prisma.memory.upsert({
    where: { userId: data.userId },
    update: {
      fullName: data.fullName ?? null,
      profession: data.profession ?? null,
      interests: data.interests ?? null,
      tone: data.tone ?? 'balanced',
    },
    create: {
      userId: data.userId,
      fullName: data.fullName ?? null,
      profession: data.profession ?? null,
      interests: data.interests ?? null,
      tone: data.tone ?? 'balanced',
    },
  })
  await prisma.user.update({
    where: { id: data.userId },
    data: { onboarded: true },
  })
  redirect('/chat')
}
