import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
})

export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
}
