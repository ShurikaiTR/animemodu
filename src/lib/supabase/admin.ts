import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './config'

export function createAdminClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required for admin operations')
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

