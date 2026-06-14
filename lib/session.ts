import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// CRITICAL: SESSION_SECRET must be set in production.
// No fallback — if missing, the app will crash rather than use an insecure key.
const secretKey = process.env.SESSION_SECRET
if (!secretKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: SESSION_SECRET environment variable is required in production. Set it to a random 32+ character string.')
  }
  console.warn('⚠️ SESSION_SECRET not set — using insecure dev key. DO NOT use in production.')
}
const encodedKey = new TextEncoder().encode(secretKey || 'dev-only-insecure-secret-do-not-use-in-prod')

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
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  return decrypt(session)
}
