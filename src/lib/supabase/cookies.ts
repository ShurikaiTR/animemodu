import type { CookieOptions } from "@supabase/ssr";

export interface CookieHandler {
  getAll: () => Array<{ name: string; value: string }>;
  setAll: (cookies: Array<{ name: string; value: string; options?: CookieOptions }>) => void;
}

export function createServerCookieHandler(
  cookieStore: Awaited<ReturnType<typeof import("next/headers").cookies>>
): CookieHandler {
  return {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      } catch {
      }
    },
  };
}

export function createMiddlewareCookieHandler(
  request: import("next/server").NextRequest,
  response: import("next/server").NextResponse
): CookieHandler {
  return {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value }) => {
        request.cookies.set(name, value);
      });
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
    },
  };
}

