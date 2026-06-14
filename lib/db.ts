import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false }, // Allow self-signed certs in dev only
  max: 5,
  idle_in_transaction_session_timeout: 10_000,
})

// Set statement timeout at the pool level via an init query
pool.on('connect', (client) => {
  client.query('SET statement_timeout = 30000').catch(() => {})
})

export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
}
