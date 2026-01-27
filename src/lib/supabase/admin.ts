import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase admin client with service role privileges.
 * This client bypasses RLS and has full database access.
 *
 * IMPORTANT: Only use this on the server side (Server Actions, API Routes).
 * Never expose the service role key to the client.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase admin credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
