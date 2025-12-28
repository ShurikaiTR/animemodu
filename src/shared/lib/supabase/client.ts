import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/shared/types/supabase'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config'

export function createClient() {
    return createBrowserClient<Database>(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    )
}
