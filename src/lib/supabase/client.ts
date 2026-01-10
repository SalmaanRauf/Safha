/**
 * Supabase Browser Client
 * 
 * Creates a Supabase client configured for browser/client-side usage.
 * Uses the anon key which is safe to expose - Row Level Security handles authorization.
 * 
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

/**
 * Creates a Supabase client for use in Client Components.
 * The anon key is public and safe to expose - RLS policies protect data.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
