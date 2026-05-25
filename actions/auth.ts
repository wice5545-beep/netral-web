'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { getSupabase, getSupabaseAdmin } from '@/lib/supabase'
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

  // Rate limit: 3 signups per IP-like key per hour
  const { rateLimit } = await import('@/lib/rate-limit')
  const rl = rateLimit(`signup:${email.toLowerCase()}`, 3, 60 * 60 * 1000)
  if (!rl.allowed) return { message: 'Trop de tentatives. Réessayez plus tard.' }

  const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
    email,
    password,
    user_metadata: { name },
    email_confirm: true,
  })

  if (error) {
    if (error.message.includes('already')) return { errors: { email: ['This email is already in use'] } }
    return { message: error.message }
  }

  const { db } = await import('@/lib/db')
  await db.query(
    `INSERT INTO "User" (id, name, email, password, onboarded, "preferredModel", plan, "messagesUsed", "messagesResetAt", "createdAt") VALUES ($1, $2, $3, '', false, 'ntrl-1.3', 'free', 0, $4, now()) ON CONFLICT (id) DO NOTHING`,
    [data.user.id, name, email, new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)]
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

  // Brute-force protection: 5 attempts per email per 15 min
  const { rateLimit } = await import('@/lib/rate-limit')
  const rl = rateLimit(`login:${email.toLowerCase()}`, 5, 15 * 60 * 1000)
  if (!rl.allowed) return { message: 'Trop de tentatives. Réessayez dans 15 minutes.' }

  // Verify password via Supabase signInWithPassword
  const { data: signInData, error: signInError } = await getSupabase().auth.signInWithPassword({ email, password })

  if (signInError || !signInData.user) {
    // Fallback: try to create user in Supabase if they exist in DB but not in Supabase
    const { db } = await import('@/lib/db')
    const { rows } = await db.query(`SELECT id, email, name FROM "User" WHERE email = $1`, [email.toLowerCase()])

    if (rows[0]) {
      // User exists in DB but not in Supabase — recreate in Supabase
      const { data: newUser, error: createErr } = await getSupabaseAdmin().auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: rows[0].name },
      })

      if (createErr && !createErr.message.includes('already')) {
        return { errors: { email: ['Email ou mot de passe incorrect'] } }
      }

      // Try login again
      const { data: retryData, error: retryErr } = await getSupabase().auth.signInWithPassword({ email, password })
      if (retryErr || !retryData.user) {
        // If still fails, update password in Supabase
        if (rows[0].id) {
          await getSupabaseAdmin().auth.admin.updateUserById(rows[0].id, { password })
          const { data: finalData, error: finalErr } = await getSupabase().auth.signInWithPassword({ email, password })
          if (finalErr || !finalData.user) {
            return { errors: { email: ['Email ou mot de passe incorrect'] } }
          }
          await createSession(finalData.user.id)
          redirect('/chat')
        }
        return { errors: { email: ['Email ou mot de passe incorrect'] } }
      }

      await createSession(retryData.user.id)
      redirect('/chat')
    }

    return { errors: { email: ['Email ou mot de passe incorrect'] } }
  }

  const user = signInData.user

  // Ensure user exists in Neon DB
  const { db } = await import('@/lib/db')
  await db.query(
    `INSERT INTO "User" (id, name, email, password, onboarded, "preferredModel", plan, "messagesUsed", "messagesResetAt", "createdAt") VALUES ($1, $2, $3, '', true, 'ntrl-1.3', 'free', 0, $4, now()) ON CONFLICT (id) DO NOTHING`,
    [user.id, user.user_metadata?.name ?? email.split('@')[0], email, new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)]
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
