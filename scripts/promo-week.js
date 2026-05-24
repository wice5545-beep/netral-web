// Script: Set all existing users to pro_plus for 1 week
// Run with: node scripts/promo-week.js

const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  const oneWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const { rowCount } = await pool.query(
    `UPDATE "User" SET plan = 'pro_plus', "planExpiresAt" = $1, "messagesUsed" = 0 WHERE true`,
    [oneWeek]
  )

  console.log(`✅ ${rowCount} utilisateurs mis en Pro+ jusqu'au ${oneWeek.toLocaleDateString('fr-FR')}`)

  // Ensure the column exists
  await pool.query(`
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "planExpiresAt" TIMESTAMP
  `).catch(() => {})

  // Re-run after column creation
  await pool.query(
    `UPDATE "User" SET plan = 'pro_plus', "planExpiresAt" = $1, "messagesUsed" = 0`,
    [oneWeek]
  )

  await pool.end()
}

main().catch(e => { console.error(e); process.exit(1) })
