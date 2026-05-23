const { Client } = require('pg')

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres:sb_publishable_QShHQqEpQ8q8MVtg0MsuMg_bSxAhZ_F@db.ehheyoyadhbynblnfort.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log('Connected!')

    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id text NOT NULL,
        title text DEFAULT 'New chat',
        model text DEFAULT 'ntrl-1.3',
        pinned boolean DEFAULT false,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
    `)
    console.log('conversations table created')

    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
        role text NOT NULL,
        content text NOT NULL,
        model text,
        created_at timestamptz DEFAULT now()
      );
    `)
    console.log('messages table created')

    await client.query(`CREATE INDEX IF NOT EXISTS idx_conv_user ON conversations(user_id, updated_at DESC);`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_msg_conv ON messages(conversation_id, created_at ASC);`)
    console.log('indexes created')
  } catch (e) {
    console.error('Error:', e.message)
  } finally {
    await client.end()
  }
}
run()
