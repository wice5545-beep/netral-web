async function run() {
  const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaGV5b3lhZGhieW5ibG5mb3J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTI2MzkwMCwiZXhwIjoyMDk0ODM5OTAwfQ.ALgs_OeXZWMMSGM1qo_fGmdxKTGCfPA6Qbj8dGq90ww'

  const sql = `
    CREATE TABLE IF NOT EXISTS conversations (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id text NOT NULL,
      title text DEFAULT 'New chat',
      model text DEFAULT 'ntrl-1.3',
      pinned boolean DEFAULT false,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS messages (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
      role text NOT NULL,
      content text NOT NULL,
      model text,
      created_at timestamptz DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_conv_user ON conversations(user_id, updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_msg_conv ON messages(conversation_id, created_at ASC);
  `

  // Use the Supabase pg-meta endpoint (available on all projects)
  const res = await fetch('https://ehheyoyadhbynblnfort.supabase.co/pg/query', {
    method: 'POST',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      'x-connection-encrypted': 'true',
    },
    body: JSON.stringify({ query: sql }),
  })
  console.log('pg/query:', res.status, await res.text())

  // Alternative: try /database/query
  const res2 = await fetch('https://ehheyoyadhbynblnfort.supabase.co/database/query', {
    method: 'POST',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })
  console.log('database/query:', res2.status, await res2.text())
}
run()
