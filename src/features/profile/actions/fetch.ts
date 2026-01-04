"use server";

import { logError } from "@/shared/lib/errors";
import { createClient } from "@/shared/lib/supabase/server";
import { userIdSchema } from "@/shared/lib/validations/user";
import type { ProfileRow } from "@/shared/types/helpers";

type GetProfileResult = { data: ProfileRow } | { error: string };

/**
 * Retrieves a user profile by userId
 */
export async function getProfile(userId: string): Promise<GetProfileResult> {
    // Validation
    const validation = userIdSchema.safeParse(userId);
    if (!validation.success) {
        return { error: "Geçersiz kullanıcı ID" };
    }

    const supabase = await createClient();

    const { data: rawProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        logError("getProfile", error);
        return { error: error.message };
    }

    const profile = rawProfile as ProfileRow;

    if (!profile.avatar_url || profile.avatar_url === "") {
        profile.avatar_url = "/default-avatar.webp";
    }

    return { data: profile };
}


