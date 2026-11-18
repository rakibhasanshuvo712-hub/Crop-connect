import { createBrowserClient } from '@supabase/ssr'
import { isSupabaseConfigured } from './config'

export { isSupabaseConfigured }

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cropconnect-demo.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key'
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
