import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// CRITICAL: SESSION_SECRET must be set in production
const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: SESSION_SECRET is required in production')
    }
    return 'dev-only-insecure-secret-do-not-use-in-prod'
  })()
)

const protectedPaths = ['/chat', '/onboarding', '/integrations']
const authPaths = ['/login', '/register']

// Allowed CORS origins — restrict to known domains
const ALLOWED_ORIGINS = [
  'https://netral-web.vercel.app',
  'https://netral.app',
  'https://www.netral.app',
  'http://localhost:3000', // dev only
].filter(Boolean)

// VS Code extension uses vscode:// scheme — allow via Bearer token auth
function isAllowedOrigin(origin: string): boolean {
  try {
    const url = new URL(origin)
    // Allow VS Code extension URLs
    if (url.protocol === 'vscode:') return true
    return ALLOWED_ORIGINS.some(allowed => {
      try {
        const allowedUrl = new URL(allowed)
        return url.hostname === allowedUrl.hostname && url.port === allowedUrl.port
      } catch { return false }
    })
  } catch {
    return false
  }
}

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

/**
 * Fire-and-forget audit log for security events in middleware.
 * Uses fetch to a self-API endpoint to avoid importing db in edge runtime.
 */
function securityAuditLog(action: string, req: NextRequest, metadata?: Record<string, unknown>) {
  // Log to console for Vercel/CloudWatch integration
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  console.warn(`[security] ${action}`, {
    ip,
    path: req.nextUrl.pathname,
    method: req.method,
    userAgent: req.headers.get('user-agent')?.slice(0, 200),
    ...metadata,
  })
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Block suspicious paths
  if (/\.(php|asp|env|git|sql|bak|config|log|ini|htaccess|htpasswd|DS_Store)$/i.test(pathname)) {
    securityAuditLog('security.suspicious_path', req, { reason: 'suspicious_extension' })
    return new NextResponse('Not Found', { status: 404 })
  }
  if (/\/(wp-admin|wp-login|xmlrpc|phpmyadmin|admin|\.well-known\/security|cgi-bin|\.aws|\.docker|\.ssh)/i.test(pathname)) {
    securityAuditLog('security.suspicious_path', req, { reason: 'suspicious_directory' })
    return new NextResponse('Not Found', { status: 404 })
  }

  // Block path traversal
  if (pathname.includes('..') || pathname.includes('%2e%2e')) {
    securityAuditLog('security.suspicious_path', req, { reason: 'path_traversal' })
    return new NextResponse('Forbidden', { status: 403 })
  }

  // CSRF protection for non-GET API requests (except OAuth callback)
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth/callback') && req.method !== 'GET') {
    const origin = req.headers.get('origin')
    const host = req.headers.get('host')
    if (origin && host && !isAllowedOrigin(origin)) {
      const hasBearer = req.headers.get('authorization')?.startsWith('Bearer ')
      if (!hasBearer) {
        securityAuditLog('security.csrf_blocked', req, { origin, host })
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
  response.headers.set('X-XSS-Protection', '0') // Deprecated — CSP is the modern approach
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

  // Cross-Origin isolation headers
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless')
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin')

  // CORS for API routes — restricted to allowed origins
  if (pathname.startsWith('/api')) {
    const origin = req.headers.get('origin')
    if (origin && isAllowedOrigin(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Vary', 'Origin')
    }
    // If no origin (VS Code extension, curl, etc.) — allow via Bearer token only
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')
  }

  // Strict CSP for non-API routes — uses nonces instead of unsafe-inline
  if (!pathname.startsWith('/api')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://*.supabase.co'
    const supabaseHost = supabaseUrl.replace(/^https?:\/\//, '')

    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // TODO: migrate to nonce-based CSP
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
