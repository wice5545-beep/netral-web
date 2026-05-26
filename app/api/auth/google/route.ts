import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function GET(req: NextRequest) {
  const { origin } = req.nextUrl

  const session = await getSession()
  if (session?.userId) return NextResponse.redirect(`${origin}/chat`)

  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    // Show a helpful error page instead of a cryptic redirect
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;max-width:500px;margin:auto">
        <h2>⚠️ Google OAuth non configuré</h2>
        <p>La variable <code>GOOGLE_CLIENT_ID</code> est manquante dans les variables d'environnement Vercel.</p>
        <p><a href="/login">← Retour au login</a></p>
      </body></html>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Build redirect URI — prefer env var, fallback to current origin
  const redirectUri = process.env.GOOGLE_REDIRECT_URI
    ?? `${origin}/api/auth/callback`

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid email profile')
  url.searchParams.set('access_type', 'offline')
  url.searchParams.set('prompt', 'consent')
  url.searchParams.set('state', 'login')

  return NextResponse.redirect(url.toString())
}
