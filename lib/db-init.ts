import 'server-only'
import { db } from './db'

let initPromise: Promise<void> | null = null

/**
 * Ensures all required tables exist in the database.
 * Idempotent — safe to call multiple times.
 * Runs once per server instance (cached promise).
 */
export function ensureTables(): Promise<void> {
  if (initPromise) return initPromise

  initPromise = (async () => {
    try {
      // Integration table (Google OAuth integrations: Gmail, Calendar, etc.)
      await db.query(`
        CREATE TABLE IF NOT EXISTS "Integration" (
          "id"           TEXT PRIMARY KEY,
          "userId"       TEXT NOT NULL,
          "provider"     TEXT NOT NULL,
          "service"      TEXT NOT NULL,
          "accessToken"  TEXT NOT NULL,
          "refreshToken" TEXT,
          "expiresAt"    TIMESTAMP,
          "scope"        TEXT,
          "createdAt"    TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt"    TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)

      // Add unique constraint if missing
      await db.query(`
        DO $$ BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'Integration_userId_provider_service_key'
          ) THEN
            ALTER TABLE "Integration" ADD CONSTRAINT "Integration_userId_provider_service_key"
              UNIQUE ("userId", "provider", "service");
          END IF;
        END $$;
      `).catch(() => {})

      await db.query(`CREATE INDEX IF NOT EXISTS "Integration_userId_idx" ON "Integration" ("userId")`).catch(() => {})

      // ApiToken table (VS Code extension tokens)
      await db.query(`
        CREATE TABLE IF NOT EXISTS "ApiToken" (
          "id"        TEXT PRIMARY KEY,
          "userId"    TEXT NOT NULL,
          "name"      TEXT DEFAULT 'API',
          "createdAt" TIMESTAMP DEFAULT now(),
          "revokedAt" TIMESTAMP
        )
      `)
      await db.query(`CREATE INDEX IF NOT EXISTS "ApiToken_userId_idx" ON "ApiToken" ("userId")`).catch(() => {})

      console.log('[db-init] All tables verified')
    } catch (e) {
      console.error('[db-init] Failed to ensure tables:', e)
      // Don't throw — let routes fail individually with proper error messages
      initPromise = null // Allow retry
    }
  })()

  return initPromise
}
