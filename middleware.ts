import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Use same fallback as lib/session.ts to keep them in sync
const SESSION_SECRET_RAW = process.env.SESSION_SECRET || 'fallback-secret-32-chars-CHANGE-ME-IN-PRODUCTION'
const SESSION_SECRET = new TextEncoder().encode(SESSION_SECRET_RAW)

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
  if (/\/(wp-admin|wp-login|xmlrpc|phpmyadmin|admin|\.well-known\/security|cgi-bin|\.aws|\.docker|\.ssh)/i.test(pathname)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Block path traversal
  if (pathname.includes('..') || pathname.includes('%2e%2e')) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // CSRF protection for non-GET API requests (except OAuth callback)
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth/callback') && !pathname.startsWith('/api/integrations/callback') && req.method !== 'GET') {
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

  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

  // CORS for API routes — permissive for VS Code extension and same-origin
  if (pathname.startsWith('/api')) {
    const origin = req.headers.get('origin') || '*'
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  // Strict CSP for non-API routes
  if (!pathname.startsWith('/api')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://*.supabase.co'
    const supabaseHost = supabaseUrl.replace(/^https?:\/\//, '')

    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https: blob:",
        "font-src 'self' https://fonts.gstatic.com",
        `connect-src 'self' https: wss: https://${supabaseHost} wss://${supabaseHost}`,
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
      ].join('; ')
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
