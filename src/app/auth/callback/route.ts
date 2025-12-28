import { createClient } from "@/shared/lib/supabase/server";
import { NextRequest } from "next/server";
import { getSearchParam, redirectTo, redirectWithError } from "@/shared/lib/auth/utils";

export async function GET(request: NextRequest) {
    const code = getSearchParam(request, "code");
    const next = getSearchParam(request, "next", "/");

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error) {
            return redirectTo(request, next);
        }
    }

    return redirectWithError(request, "auth_failed");
}









