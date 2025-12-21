import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config'
import { createMiddlewareCookieHandler } from './cookies'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => {
                        request.cookies.set(name, value);
                    });
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        supabaseResponse.cookies.set(name, value, options);
                    });
                },
            },
        }
    )

    await supabase.auth.getUser()

    return supabaseResponse
}

export function createSupabaseClient(
    request: NextRequest,
    response: NextResponse
): SupabaseClient<Database> {
    const cookieHandler = createMiddlewareCookieHandler(request, response);

    return createServerClient<Database>(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            cookies: cookieHandler,
        }
    )
}

