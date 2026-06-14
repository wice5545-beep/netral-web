import 'server-only'

/**
 * Rate limiter with Upstash Redis support for multi-instance deployments.
 * Falls back to in-memory for single-instance / dev.
 *
 * Usage: const { allowed, remaining } = rateLimit(`chat:${userId}`, 30, 60_000)
 */

type Bucket = {
  tokens: number
  resetAt: number
}

// ─── In-memory fallback ──────────────────────────────────────────────────────

const buckets = new Map<string, Bucket>()

// Cleanup expired buckets every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, b] of buckets.entries()) {
      if (b.resetAt < now) buckets.delete(key)
    }
  }, 5 * 60 * 1000)
}

function memoryRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + windowMs
    buckets.set(key, { tokens: limit - 1, resetAt })
    return { allowed: true, remaining: limit - 1, resetAt }
  }

  if (bucket.tokens <= 0) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt }
  }

  bucket.tokens -= 1
  return { allowed: true, remaining: bucket.tokens, resetAt: bucket.resetAt }
}

// ─── Upstash Redis rate limiter ──────────────────────────────────────────────

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

async function redisRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return memoryRateLimit(key, limit, windowMs)
  }

  const redisKey = `rl:${key}`
  const now = Date.now()
  const windowSec = Math.ceil(windowMs / 1000)

  try {
    // Lua script: atomic sliding window counter
    const res = await fetch(`${UPSTASH_URL}/eval`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        `local current = redis.call('INCR', KEYS[1])
         if current == 1 then
           redis.call('EXPIRE', KEYS[1], ARGV[1])
         end
         local ttl = redis.call('TTL', KEYS[1])
         return {current, ttl}`,
        1,
        redisKey,
        windowSec,
      ]),
    })

    const data = await res.json() as { result?: [number, number] }
    const [count, ttl] = data.result ?? [limit + 1, windowSec]

    if (count > limit) {
      return { allowed: false, remaining: 0, resetAt: now + ttl * 1000 }
    }

    return { allowed: true, remaining: limit - count, resetAt: now + ttl * 1000 }
  } catch {
    // Fallback to memory if Redis is unreachable
    console.warn('[rate-limit] Redis unreachable, falling back to memory')
    return memoryRateLimit(key, limit, windowMs)
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetAt: number } {
  // Synchronous for in-memory; if Redis is configured, caller should use rateLimitAsync
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    // Can't be async in current call sites — fall back to memory
    // Use rateLimitAsync for Redis-backed limiting
    return memoryRateLimit(key, limit, windowMs)
  }
  return memoryRateLimit(key, limit, windowMs)
}

export async function rateLimitAsync(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  return redisRateLimit(key, limit, windowMs)
}

// ─── Exponential backoff for auth ────────────────────────────────────────────

const authAttempts = new Map<string, { count: number; lastAttempt: number }>()

// Cleanup old entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, val] of authAttempts.entries()) {
      // Remove entries older than 1 hour with no recent attempts
      if (now - val.lastAttempt > 60 * 60 * 1000) {
        authAttempts.delete(key)
      }
    }
  }, 10 * 60 * 1000)
}

/**
 * Exponential backoff for authentication attempts.
 * After each failed attempt, the required delay doubles (1s, 2s, 4s, 8s, 16s...).
 * Caps at 60 seconds. Resets after 1 hour of no attempts.
 */
export function checkAuthBackoff(key: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now()
  const entry = authAttempts.get(key)

  if (!entry || now - entry.lastAttempt > 60 * 60 * 1000) {
    // No recent attempts or expired — allow
    return { allowed: true, retryAfterMs: 0 }
  }

  // Exponential backoff: 2^(count-1) seconds, capped at 60s
  const delayMs = Math.min(Math.pow(2, entry.count - 1) * 1000, 60_000)
  const elapsed = now - entry.lastAttempt

  if (elapsed < delayMs) {
    return { allowed: false, retryAfterMs: delayMs - elapsed }
  }

  return { allowed: true, retryAfterMs: 0 }
}

/**
 * Record a failed auth attempt for exponential backoff tracking.
 */
export function recordAuthFailure(key: string): void {
  const entry = authAttempts.get(key)
  if (entry && Date.now() - entry.lastAttempt < 60 * 60 * 1000) {
    entry.count = Math.min(entry.count + 1, 10)
    entry.lastAttempt = Date.now()
  } else {
    authAttempts.set(key, { count: 1, lastAttempt: Date.now() })
  }
}

/**
 * Reset auth backoff after a successful login.
 */
export function resetAuthBackoff(key: string): void {
  authAttempts.delete(key)
}
