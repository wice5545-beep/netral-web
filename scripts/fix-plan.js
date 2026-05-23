require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')
const p = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

async function run() {
  // Check existing columns
  const { rows: cols } = await p.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'User'`)
  console.log('Columns:', cols.map(c => c.column_name))

  // Add columns
  try {
    await p.query(`ALTER TABLE "User" ADD COLUMN plan text DEFAULT 'free'`)
    console.log('Added plan column')
  } catch (e) { console.log('plan:', e.message) }

  try {
    await p.query(`ALTER TABLE "User" ADD COLUMN "messagesUsed" integer DEFAULT 0`)
    console.log('Added messagesUsed column')
  } catch (e) { console.log('messagesUsed:', e.message) }

  try {
    await p.query(`ALTER TABLE "User" ADD COLUMN "messagesResetAt" timestamptz DEFAULT now()`)
    console.log('Added messagesResetAt column')
  } catch (e) { console.log('messagesResetAt:', e.message) }

  // Now set CEO
  const { rows } = await p.query(
    `UPDATE "User" SET plan = 'pro_plus', role = 'ceo' WHERE email = $1 RETURNING id, email, plan, role`,
    ['industrial.spoonbill.fcse@hidingmail.net']
  )
  console.log('CEO:', rows)

  await p.end()
}
run()
