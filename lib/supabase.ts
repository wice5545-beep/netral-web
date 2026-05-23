import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ehheyoyadhbynblnfort.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaGV5b3lhZGhieW5ibG5mb3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjM5MDAsImV4cCI6MjA5NDgzOTkwMH0.1tcPepldz4HLzonCyzd-JhS2m5y0ffRZWTqvL9zQq2M'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaGV5b3lhZGhieW5ibG5mb3J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTI2MzkwMCwiZXhwIjoyMDk0ODM5OTAwfQ.ALgs_OeXZWMMSGM1qo_fGmdxKTGCfPA6Qbj8dGq90ww'

// Browser client (anon key) - for client-side auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client (service role) - for server-side DB operations, bypasses RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
