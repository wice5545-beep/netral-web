import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/_health
 * Diagnostic endpoint — checks DB connectivity and table existence.
 * Useful for debugging "APIs don't work" issues.
 */
export async function GET() {
  const result: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      hasSessionSecret: !!process.env.SESSION_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      googleRedirectUri: process.env.GOOGLE_REDIRECT_URI ?? '(not set, using origin)',
      hasMistralKey: !!process.env.MISTRAL_API_KEY,
      hasGroqKey: !!process.env.GROQ_API_KEY,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      nodeEnv: process.env.NODE_ENV,
    },
    db: { connected: false, tables: {} as Record<string, boolean> },
  }

  try {
    await db.query('SELECT 1')
    result.db.connected = true

    const tables = ['User', 'Conversation', 'Message', 'Memory', 'Integration', 'ApiToken']
    for (const t of tables) {
      try {
        await db.query(`SELECT 1 FROM "${t}" LIMIT 1`)
        result.db.tables[t] = true
      } catch {
        result.db.tables[t] = false
      }
    }
  } catch (e: any) {
    result.db.error = e?.message
  }

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'no-store' }
  })
}
