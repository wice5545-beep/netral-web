const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

async function run() {
  try {
    await pool.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free'`)
    await pool.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "messagesUsed" integer DEFAULT 0`)
    await pool.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "messagesResetAt" timestamptz DEFAULT now()`)
    console.log('Columns added')

    // Set CEO user as Pro+
    const r = await pool.query(
      `UPDATE "User" SET plan = 'pro_plus', role = 'ceo' WHERE email = $1 RETURNING id, email, plan`,
      ['industrial.spoonbill.fcse@hidingmail.net']
    )
    if (r.rows.length) {
      console.log('CEO set:', r.rows[0])
    } else {
      console.log('CEO user not found - will be set on next login')
    }
  } catch (e) {
    console.error('Error:', e.message)
  } finally {
    await pool.end()
  }
}
run()
