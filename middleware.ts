import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET ?? 'fallback-secret-32-characters-min')

const protectedPaths = ['/chat', '/onboarding']
const authPaths = ['/login', '/register']

async function getSessionUserId(req: NextRequest): Promise<string | null> {
  const sessionCookie = req.cookies.get('session')?.value
  if (!sessionCookie) return null
  try {
    const { payload } = await jwtVerify(sessionCookie, SESSION_SECRET, { algorithms: ['HS256'] })
    return (payload.userId as string) || null
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Block suspicious paths
  if (/\.(php|asp|env|git|sql|bak|config|log|ini|htaccess|htpasswd|DS_Store)$/i.test(pathname)) {
    return new NextResponse('Not Found', { status: 404 })
  }
  if (/\/(wp-admin|wp-login|xmlrpc|phpmyadmin|admin|\.well-known\/security)/i.test(pathname)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // CSRF protection for non-GET API requests
  if (pathname.startsWith('/api') && req.method !== 'GET') {
    const origin = req.headers.get('origin')
    const host = req.headers.get('host')
    if (origin && host && !origin.includes(host.split(':')[0])) {
      const hasBearer = req.headers.get('authorization')?.startsWith('Bearer ')
      if (!hasBearer) {
        return new NextResponse('Forbidden', { status: 403 })
      }
    }

    // Block oversized payloads (10MB)
    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      return new NextResponse('Payload Too Large', { status: 413 })
    }
  }

  // Security headers
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // CORS for API routes (allow VS Code extension)
  if (pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  // CSP for non-API routes
  if (!pathname.startsWith('/api')) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; frame-ancestors 'none';"
    )
  }

  const isProtected = protectedPaths.some(p => pathname === p || pathname.startsWith(`${p}/`))
  const isAuth = authPaths.includes(pathname)

  if (!isProtected && !isAuth) return response

  const userId = await getSessionUserId(req)

  if (isProtected && !userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isAuth && userId) {
    return NextResponse.redirect(new URL('/chat', req.nextUrl))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.vsix$).*)'],
}
