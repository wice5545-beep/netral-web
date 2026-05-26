import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

// Direct Google OAuth — no Supabase client needed
// Works as long as GOOGLE_CLIENT_ID and GOOGLE_REDIRECT_URI are set
export async function GET(req: NextRequest) {
  const { origin } = req.nextUrl

  // If already logged in, redirect to chat
  const session = await getSession()
  if (session?.userId) return NextResponse.redirect(`${origin}/chat`)

  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.redirect(`${origin}/login?error=google_not_configured`)
  }

  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? `${origin}/api/auth/callback`

  const scopes = [
    'openid',
    'email',
    'profile',
  ]

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', scopes.join(' '))
  url.searchParams.set('access_type', 'offline')
  url.searchParams.set('prompt', 'consent')
  url.searchParams.set('state', 'login')

  return NextResponse.redirect(url.toString())
}
