import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

const protectedPrefixes = ['/chat', '/onboarding']
const publicRoutes = ['/login', '/register', '/']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  // CSRF protection: reject non-GET API requests from different origins
  if (path.startsWith('/api') && req.method !== 'GET') {
    const origin = req.headers.get('origin')
    const host = req.headers.get('host')
    if (origin && host && !origin.includes(host.split(':')[0])) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  const isProtected = protectedPrefixes.some((r) => path === r || path.startsWith(`${r}/`))
  const isPublic = publicRoutes.includes(path)

  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  const session = await decrypt(sessionCookie)

  if (isProtected && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isPublic && session?.userId && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/chat', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)'],
}
