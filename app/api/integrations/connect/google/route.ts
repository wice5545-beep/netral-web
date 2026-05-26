import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

const SCOPES: Record<string, string[]> = {
  gmail: [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify',
  ],
  calendar: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ],
  drive: ['https://www.googleapis.com/auth/drive'],
  docs: ['https://www.googleapis.com/auth/documents'],
  sheets: ['https://www.googleapis.com/auth/spreadsheets'],
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const services = (searchParams.get('services') ?? 'gmail,calendar,drive,docs,sheets').split(',')

  const scopes = [
    'openid', 'email', 'profile',
    ...services.flatMap(s => SCOPES[s] ?? []),
  ]

  const state = Buffer.from(JSON.stringify({ userId: session.userId, services })).toString('base64url')

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!)
  url.searchParams.set('redirect_uri', process.env.GOOGLE_REDIRECT_URI!)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', scopes.join(' '))
  url.searchParams.set('access_type', 'offline')
  url.searchParams.set('prompt', 'consent')
  url.searchParams.set('state', state)

  return NextResponse.redirect(url.toString())
}
