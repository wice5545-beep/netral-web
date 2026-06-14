import 'server-only'
import { db } from '@/lib/db'

/**
 * Audit logging system for security events.
 * Stores events in the "AuditLog" table for compliance and monitoring.
 */

export type AuditAction =
  | 'auth.login.success'
  | 'auth.login.failure'
  | 'auth.signup'
  | 'auth.logout'
  | 'auth.oauth.google'
  | 'auth.token.create'
  | 'auth.token.revoke'
  | 'auth.password.reset'
  | 'auth.backoff.triggered'
  | 'integration.connect'
  | 'integration.disconnect'
  | 'user.update'
  | 'user.delete'
  | 'admin.user.update'
  | 'admin.user.delete'
  | 'rate_limit.triggered'
  | 'security.csrf_blocked'
  | 'security.state_mismatch'
  | 'security.suspicious_path'

export type AuditLogEntry = {
  userId?: string
  action: AuditAction
  ip?: string
  userAgent?: string
  metadata?: Record<string, unknown>
}

let tableEnsured = false

async function ensureTable() {
  if (tableEnsured) return
  await db.query(`
    CREATE TABLE IF NOT EXISTS "AuditLog" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT,
      "action" TEXT NOT NULL,
      "ip" TEXT,
      "userAgent" TEXT,
      "metadata" JSONB,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `).catch(() => {})
  await db.query(`
    CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog" ("userId")
  `).catch(() => {})
  await db.query(`
    CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog" ("action")
  `).catch(() => {})
  await db.query(`
    CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog" ("createdAt")
  `).catch(() => {})
  tableEnsured = true
}

/**
 * Log an audit event. Non-blocking — errors are silently caught to never
 * interrupt the main flow.
 */
export async function auditLog(entry: AuditLogEntry): Promise<void> {
  try {
    await ensureTable()
    const id = `aud_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
    await db.query(
      `INSERT INTO "AuditLog" (id, "userId", action, ip, "userAgent", metadata, "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, now())`,
      [
        id,
        entry.userId ?? null,
        entry.action,
        entry.ip ?? null,
        entry.userAgent ?? null,
        entry.metadata ? JSON.stringify(entry.metadata) : null,
      ]
    )
  } catch (e) {
    // Audit logging must never break the main flow
    console.error('[audit] Failed to write audit log:', e)
  }
}

/**
 * Helper to extract request metadata for audit logging.
 */
export function extractRequestMeta(req: { headers: Headers }): {
  ip: string
  userAgent: string
} {
  return {
    ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
    userAgent: req.headers.get('user-agent')?.slice(0, 500) || 'unknown',
  }
}
