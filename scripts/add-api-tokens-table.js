// Run: node scripts/add-api-tokens-table.js
const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "ApiToken" (
      id TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "revokedAt" TIMESTAMP
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_apitoken_user ON "ApiToken"("userId")`)

  // Also ensure User table has plan/messages columns
  await pool.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free'`)
  await pool.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "messagesUsed" INTEGER DEFAULT 0`)
  await pool.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "messagesResetAt" TIMESTAMP DEFAULT (date_trunc('month', now()) + interval '1 month')`)

  console.log('✅ ApiToken table created + User columns ensured')
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
