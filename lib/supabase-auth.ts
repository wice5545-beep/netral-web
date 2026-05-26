import { createClient } from '@supabase/supabase-js'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function signInWithGoogle() {
  const supabase = getClient()
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  })
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = getClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithPassword(email: string, password: string, name: string) {
  const supabase = getClient()
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  })
}

export async function signOut() {
  const supabase = getClient()
  return supabase.auth.signOut()
}

export async function getSupabaseSession() {
  const supabase = getClient()
  const { data } = await supabase.auth.getSession()
  return data.session
}
