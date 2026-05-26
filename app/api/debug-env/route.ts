import { NextResponse } from 'next/server'

// Temporary debug route — remove after fixing
export async function GET() {
  return NextResponse.json({
    // Google vars
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✅ ' + process.env.GOOGLE_CLIENT_ID.slice(0, 25) + '...' : '❌ MISSING',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '✅ set' : '❌ MISSING',
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI ?? '❌ MISSING',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? '❌ MISSING',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ ' + process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 30) : '❌ MISSING',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ set' : '❌ MISSING',
    // Vercel metadata — identifies which project/deployment this is
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID ?? 'not set',
    VERCEL_URL: process.env.VERCEL_URL ?? 'not set',
    VERCEL_ENV: process.env.VERCEL_ENV ?? 'not set',
    NODE_ENV: process.env.NODE_ENV,
  })
}
