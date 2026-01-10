/**
 * Supabase Admin Client
 * 
 * Creates a Supabase client with service_role privileges that bypasses RLS.
 * ONLY use this in secure server-side contexts (API routes, server actions).
 * NEVER expose this client to the browser.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

/**
 * Creates an admin Supabase client that bypasses Row Level Security.
 * Use sparingly and only when RLS bypass is absolutely necessary.
 * 
 * @warning This client has full database access - handle with care!
 */
export function createAdminClient() {
    return createSupabaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
}
