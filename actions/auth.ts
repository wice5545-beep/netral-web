'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { createSession, deleteSession } from '@/lib/session'

const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email').trim(),
  password: z.string().min(8, 'At least 8 characters').regex(/[a-zA-Z]/, 'Must contain a letter').regex(/[0-9]/, 'Must contain a number'),
})

const LoginSchema = z.object({
  email: z.string().email('Invalid email').trim(),
  password: z.string().min(1, 'Password required'),
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

  // Create user via Supabase Auth
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { name },
    email_confirm: true,
  })

  if (error) {
    if (error.message.includes('already')) return { errors: { email: ['This email is already in use'] } }
    return { message: error.message }
  }

  // Also create user in Neon DB for conversations
  const { db } = await import('@/lib/db')
  await db.query(
    `INSERT INTO "User" (id, name, email, password, onboarded, "preferredModel", "createdAt") VALUES ($1, $2, $3, '', false, 'ntrl-1.3', now()) ON CONFLICT (id) DO NOTHING`,
    [data.user.id, name, email]
  )

  await createSession(data.user.id)
  redirect('/chat')
}

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!result.success) return { errors: result.error.flatten().fieldErrors }

  const { email, password } = result.data

  // Verify credentials via Supabase Auth
  const { data, error } = await supabaseAdmin.auth.admin.listUsers()
  if (error) return { message: 'Server error' }

  const user = data.users.find(u => u.email === email)
  if (!user) return { errors: { email: ['Invalid email or password'] } }

  // Verify password by attempting sign in with service client
  const { createClient } = await import('@supabase/supabase-js')
  const tempClient = createClient(
    'https://ehheyoyadhbynblnfort.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaGV5b3lhZGhieW5ibG5mb3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjM5MDAsImV4cCI6MjA5NDgzOTkwMH0.1tcPepldz4HLzonCyzd-JhS2m5y0ffRZWTqvL9zQq2M'
  )
  const { error: signInError } = await tempClient.auth.signInWithPassword({ email, password })
  if (signInError) return { errors: { email: ['Invalid email or password'] } }

  // Ensure user exists in Neon DB
  const { db } = await import('@/lib/db')
  await db.query(
    `INSERT INTO "User" (id, name, email, password, onboarded, "preferredModel", "createdAt") VALUES ($1, $2, $3, '', true, 'ntrl-1.3', now()) ON CONFLICT (id) DO NOTHING`,
    [user.id, user.user_metadata?.name ?? email.split('@')[0], email]
  )

  await createSession(user.id)
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
  const { db } = await import('@/lib/db')
  // Upsert memory
  const { rows } = await db.query(`SELECT id FROM "Memory" WHERE "userId" = $1`, [data.userId])
  if (rows[0]) {
    await db.query(
      `UPDATE "Memory" SET "fullName" = $1, profession = $2, interests = $3, tone = $4, "updatedAt" = now() WHERE "userId" = $5`,
      [data.fullName ?? null, data.profession ?? null, data.interests ?? null, data.tone ?? 'balanced', data.userId]
    )
  } else {
    await db.query(
      `INSERT INTO "Memory" (id, "userId", "fullName", profession, interests, tone, "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, now())`,
      [data.userId, data.fullName ?? null, data.profession ?? null, data.interests ?? null, data.tone ?? 'balanced']
    )
  }
  await db.query(`UPDATE "User" SET onboarded = true WHERE id = $1`, [data.userId])
  redirect('/chat')
}
