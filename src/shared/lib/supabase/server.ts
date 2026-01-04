
import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

import { Database } from '@/shared/types/supabase'

import { SUPABASE_ANON_KEY,SUPABASE_URL } from './config'
import { createServerCookieHandler } from './cookies'

export async function createClient() {
    const cookieStore = await cookies()
    const cookieHandler = createServerCookieHandler(cookieStore)

    return createServerClient<Database>(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            cookies: cookieHandler,
        }
    )
}

export function createPublicClient() {
    return createSupabaseClient<Database>(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    )
}
