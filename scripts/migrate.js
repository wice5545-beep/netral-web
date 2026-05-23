const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ehheyoyadhbynblnfort.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaGV5b3lhZGhieW5ibG5mb3J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTI2MzkwMCwiZXhwIjoyMDk0ODM5OTAwfQ.ALgs_OeXZWMMSGM1qo_fGmdxKTGCfPA6Qbj8dGq90ww'
)

async function migrate() {
  // Test connection by trying to select from conversations
  const { error } = await supabase.from('conversations').select('id').limit(1)
  if (error && error.code === '42P01') {
    console.log('Tables do not exist yet. Please create them via Supabase Dashboard SQL editor:')
    console.log(`
CREATE TABLE conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  title text DEFAULT 'New chat',
  model text DEFAULT 'ntrl-1.3',
  pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  model text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_conv_user ON conversations(user_id, updated_at DESC);
CREATE INDEX idx_msg_conv ON messages(conversation_id, created_at ASC);
    `)
  } else if (error) {
    console.log('Error:', error.message)
  } else {
    console.log('Tables already exist!')
  }
}

migrate()
