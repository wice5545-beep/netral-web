import { NextRequest } from 'next/server'
import { createSession } from '@/lib/session'
import { db } from '@/lib/db'
import { rateLimit, checkAuthBackoff, recordAuthFailure, resetAuthBackoff } from '@/lib/rate-limit'
import { auditLog, extractRequestMeta } from '@/lib/audit'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({ email: '', password: '' }))
  if (!email || !password) return Response.json({ error: 'Email et mot de passe requis' }, { status: 400 })
  if (email.length > 254 || password.length > 128) return Response.json({ error: 'Input trop long' }, { status: 400 })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: 'Email invalide' }, { status: 400 })

  const emailLower = email.toLowerCase()
  const meta = extractRequestMeta(req)

  // Check exponential backoff before rate limit
  const backoff = checkAuthBackoff(`login:${emailLower}`)
  if (!backoff.allowed) {
    await auditLog({ userId: undefined, action: 'auth.backoff.triggered', ...meta, metadata: { email: emailLower, retryAfterMs: backoff.retryAfterMs } })
    return Response.json(
      { error: `Trop de tentatives. Réessayez dans ${Math.ceil(backoff.retryAfterMs / 1000)} secondes.` },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(backoff.retryAfterMs / 1000)) } }
    )
  }

  const rl = rateLimit(`login:${emailLower}`, 5, 15 * 60 * 1000)
  if (!rl.allowed) {
    await auditLog({ userId: undefined, action: 'rate_limit.triggered', ...meta, metadata: { key: `login:${emailLower}` } })
    return Response.json({ error: 'Trop de tentatives' }, { status: 429 })
  }

  const { rows } = await db.query(
    `SELECT id, password FROM "User" WHERE email = $1`,
    [emailLower]
  )

  if (!rows[0]) {
    recordAuthFailure(`login:${emailLower}`)
    await auditLog({ action: 'auth.login.failure', ...meta, metadata: { email: emailLower, reason: 'not_found' } })
    return Response.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
  }

  const user = rows[0]

  // If no password stored, set it (first login after migration)
  if (!user.password) {
    const hash = await bcrypt.hash(password, 12)
    await db.query(`UPDATE "User" SET password = $1 WHERE id = $2`, [hash, user.id])
    resetAuthBackoff(`login:${emailLower}`)
    await auditLog({ userId: user.id, action: 'auth.login.success', ...meta, metadata: { method: 'migration' } })
    await createSession(user.id)
    return Response.json({ ok: true })
  }

  // Constant-time comparison via bcrypt
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    recordAuthFailure(`login:${emailLower}`)
    await auditLog({ userId: user.id, action: 'auth.login.failure', ...meta, metadata: { reason: 'wrong_password' } })
    return Response.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
  }

  resetAuthBackoff(`login:${emailLower}`)
  await auditLog({ userId: user.id, action: 'auth.login.success', ...meta })
  await createSession(user.id)
  return Response.json({ ok: true })
}
