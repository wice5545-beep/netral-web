import 'server-only'

import { rateLimit } from './rate-limit'
import { db } from './db'
import { getPlanLimit, getDailyLimit } from './plans'

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; message: string; status: number }

/**
 * Consolidated rate limiting for the chat route.
 * Combines IP rate limit, user rate limit, plan message limits, and daily limits.
 */
export async function checkChatRateLimit(
  userId: string,
  ip: string,
): Promise<RateLimitResult> {
  // 1. Get user plan info
  const { rows: userRows } = await db.query(
    `SELECT plan, role, "messagesUsed", "messagesResetAt", "planExpiresAt" FROM "User" WHERE id = $1`,
    [userId]
  )
  const userData = userRows[0]
  if (!userData) return { allowed: false, message: 'Utilisateur introuvable.', status: 401 }

  // Block banned users
  if (userData.role === 'banned') return { allowed: false, message: 'Votre compte a été suspendu.', status: 403 }

  // Check plan expiration
  let currentPlan = userData.plan || 'free'
  const now = new Date()
  if (userData.planExpiresAt && new Date(userData.planExpiresAt) < now && currentPlan !== 'free') {
    currentPlan = 'free'
    await db.query(`UPDATE "User" SET plan = 'free', "planExpiresAt" = NULL WHERE id = $1`, [userId])
  }

  const isPaid = currentPlan === 'plus' || currentPlan === 'pro' || currentPlan === 'pro_plus'

  // 2. IP-based rate limit (free users only)
  if (!isPaid) {
    const ipRl = rateLimit(`ip:${ip}`, 3, 30_000)
    if (!ipRl.allowed) {
      return { allowed: false, message: 'Trop de requêtes depuis cette adresse. Réessayez dans 30 secondes.', status: 429 }
    }
  }

  // 3. Per-user rate limit (all users)
  const userRlLimit = isPaid ? 60 : 10
  const userRl = rateLimit(`user:${userId}`, userRlLimit, 60_000)
  if (!userRl.allowed) {
    return { allowed: false, message: 'Trop de requêtes. Attendez un moment.', status: 429 }
  }

  // 4. Plan-based message quota
  const resetAt = new Date(userData.messagesResetAt)
  let messagesUsed = userData.messagesUsed || 0

  if (now > resetAt) {
    // Reset counter: Free resets weekly, Paid resets every 2 days
    const isFree = currentPlan === 'free'
    const nextReset = isFree
      ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
    await db.query(`UPDATE "User" SET "messagesUsed" = 0, "messagesResetAt" = $1 WHERE id = $2`, [nextReset, userId])
    messagesUsed = 0
  }

  const limit = getPlanLimit(currentPlan)
  if (messagesUsed >= limit) {
    const hours = Math.ceil((resetAt.getTime() - Date.now()) / (1000 * 60 * 60))
    return { allowed: false, message: `Limite de messages atteinte. Reset dans ${hours}h. Passez à un plan supérieur.`, status: 429 }
  }

  // 5. Daily anti-abuse limit (mainly for free users)
  const dailyLimit = getDailyLimit(currentPlan)
  const dailyRl = rateLimit(`daily:${userId}`, dailyLimit, 24 * 60 * 60 * 1000)
  if (!dailyRl.allowed) {
    return { allowed: false, message: 'Limite journalière atteinte. Revenez demain ou passez à un plan supérieur.', status: 429 }
  }

  // 6. Increment message counter
  await db.query(`UPDATE "User" SET "messagesUsed" = "messagesUsed" + 1 WHERE id = $1`, [userId])

  return { allowed: true }
}
