import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// Soft-warn instead of crashing on import if SESSION_SECRET is missing.
// This prevents the entire app from breaking when env vars aren't set yet.
const secretKey = process.env.SESSION_SECRET || 'fallback-secret-32-chars-CHANGE-ME-IN-PRODUCTION'
if (!process.env.SESSION_SECRET) {
  console.warn('[session] WARNING: SESSION_SECRET is not set! Using insecure fallback. SET THIS IN PRODUCTION.')
} else if (process.env.SESSION_SECRET.length < 32) {
  console.warn('[session] WARNING: SESSION_SECRET is shorter than 32 characters. Use a stronger secret.')
}
const encodedKey = new TextEncoder().encode(secretKey)

export type SessionPayload = {
  userId: string
  expiresAt: Date
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as SessionPayload
  } catch {
    return null
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    return decrypt(session)
  } catch (e) {
    console.error('[getSession]', e)
    return null
  }
}
