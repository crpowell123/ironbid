import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function assertEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
      'in .env.local (local dev) or Vercel → Settings → Environment Variables (deployed).'
    )
  }
}

// Browser client — use in components and client-side code
export function createBrowserSupabaseClient() {
  assertEnv()
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
}

// Server client — use in API routes and server components
export function createServerSupabaseClient() {
  assertEnv()
  if (!supabaseServiceKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY. Set it in .env.local (local dev) ' +
      'or Vercel → Settings → Environment Variables (deployed).'
    )
  }
  return createClient(
    supabaseUrl!,
    supabaseServiceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// Singleton for client components
let browserClient: ReturnType<typeof createBrowserSupabaseClient> | null = null

export function getSupabase() {
  if (!browserClient) {
    browserClient = createBrowserSupabaseClient()
  }
  return browserClient
}
