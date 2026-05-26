import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

// Temporary debug route — remove after fixing
export async function GET() {
  const session = await getSession()
  if (!session?.userId) return NextResponse.json({ error: 'not authenticated' }, { status: 401 })

  return NextResponse.json({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✅ set (' + process.env.GOOGLE_CLIENT_ID.slice(0, 20) + '...)' : '❌ MISSING',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '✅ set' : '❌ MISSING',
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI ?? '❌ MISSING',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? '❌ MISSING',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ set' : '❌ MISSING',
  })
}
