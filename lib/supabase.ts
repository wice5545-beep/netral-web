import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient
let _admin: SupabaseClient

export function getSupabase() {
  if (!_supabase) _supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  return _supabase
}

export function getSupabaseAdmin() {
  if (!_admin) _admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  return _admin
}

// Legacy exports for compatibility - lazy getter
export const supabase = { get auth() { return getSupabase().auth } } as unknown as SupabaseClient
export const supabaseAdmin = { get auth() { return getSupabaseAdmin().auth } } as unknown as SupabaseClient
