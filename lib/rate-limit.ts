import 'server-only'

/**
 * Simple in-memory rate limiter for single-instance deployments.
 * For multi-instance / production scale, swap with Redis (Upstash).
 *
 * Usage: const { allowed, remaining } = rateLimit(`chat:${userId}`, 30, 60_000)
 */

type Bucket = {
  tokens: number
  resetAt: number
}

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

export function rateLimit(
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
