// Add subscription columns and set all users to pro+
// Run: node scripts/add-subscription.js

const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  // Add missing columns
  const columns = [
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "plan" TEXT DEFAULT 'free'`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "messagesUsed" INTEGER DEFAULT 0`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "messagesResetAt" TIMESTAMP DEFAULT now() + interval '30 days'`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "planExpiresAt" TIMESTAMP`,
  ]

  for (const sql of columns) {
    await pool.query(sql).catch(e => console.log('  skip:', e.message))
  }
  console.log('✅ Colonnes ajoutées')

  // Add ApiToken table if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "ApiToken" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
      "name" TEXT DEFAULT 'API',
      "createdAt" TIMESTAMP DEFAULT now(),
      "revokedAt" TIMESTAMP
    )
  `).catch(e => console.log('  ApiToken:', e.message))
  console.log('✅ Table ApiToken OK')

  // Set all users to pro+ for 30 days
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const { rowCount } = await pool.query(
    `UPDATE "User" SET "plan" = 'pro_plus', "planExpiresAt" = $1, "messagesUsed" = 0`,
    [expires]
  )
  console.log(`✅ ${rowCount} utilisateur(s) mis en Pro+ jusqu'au ${expires.toLocaleDateString('fr-FR')}`)

  await pool.end()
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
