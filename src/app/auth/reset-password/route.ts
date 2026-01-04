import { NextRequest } from "next/server";

import { getSearchParam, redirectTo, redirectWithError } from "@/shared/lib/auth/utils";
import { createClient } from "@/shared/lib/supabase/server";

export async function GET(request: NextRequest) {
    const token_hash = getSearchParam(request, "token_hash", "");
    const type = getSearchParam(request, "type", "");
    const next = getSearchParam(request, "next", "/");

    if (token_hash && type) {
        const supabase = await createClient();
        const { error } = await supabase.auth.verifyOtp({
            type: type === "recovery" ? "recovery" : "email",
            token_hash,
        } as { type: "recovery" | "email"; token_hash: string });

        if (!error) {
            return redirectTo(request, `/auth/reset-password/confirm?next=${next}`);
        }
    }

    return redirectWithError(request, "invalid_token");
}
