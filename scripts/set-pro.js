require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  const email = 'colossal.grouse.saqn@hidingmail.net'
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const { rowCount } = await pool.query(
    `UPDATE "User" SET plan = 'pro_plus', "planExpiresAt" = $1, "messagesUsed" = 0 WHERE email = $2`,
    [expires, email]
  )
  console.log(`${rowCount} user(s) updated to Pro+ until ${expires.toLocaleDateString('fr-FR')}`)
  await pool.end()
}
main()
