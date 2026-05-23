import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ehheyoyadhbynblnfort.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaGV5b3lhZGhieW5ibG5mb3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjM5MDAsImV4cCI6MjA5NDgzOTkwMH0.1tcPepldz4HLzonCyzd-JhS2m5y0ffRZWTqvL9zQq2M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
