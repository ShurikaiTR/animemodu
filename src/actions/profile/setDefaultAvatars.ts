"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logError } from "@/lib/errors";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";

type SetAvatarsResult =
    | { success: true; data: { updated: number } }
    | { success: false; error: string };

/**
 * Sets default avatars for all users without avatars (Admin only)
 */
export async function setDefaultAvatarsForAllUsers(): Promise<SetAvatarsResult> {
    const auth = await requireAdmin();
    if (isAuthError(auth)) {
        return { success: false, error: auth.error };
    }

    const supabase = await createClient();

    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, avatar_url")
        .or("avatar_url.is.null,avatar_url.eq.");

    if (error) {
        logError("setDefaultAvatarsForAllUsers.fetchProfiles", error);
        return { success: false, error: error.message };
    }

    if (!profiles || profiles.length === 0) {
        return { success: true, data: { updated: 0 } };
    }

    // Type assertion for profiles from Supabase
    const typedProfiles = profiles as Array<{ id: string; avatar_url: string | null }>;

    const profilesToUpdate = typedProfiles.filter(
        (p) => !p.avatar_url || p.avatar_url === ""
    );

    if (profilesToUpdate.length === 0) {
        return { success: true, data: { updated: 0 } };
    }

    const { error: updateError } = await (supabase
        .from("profiles") as ReturnType<typeof supabase.from>)
        .update({ avatar_url: "/default-avatar.png" } as Record<string, unknown>)
        .in(
            "id",
            profilesToUpdate.map((p) => p.id)
        );

    if (updateError) {
        logError("setDefaultAvatarsForAllUsers.updateAvatars", updateError);
        return { success: false, error: updateError.message };
    }

    revalidatePath("/profil");
    return { success: true, data: { updated: profilesToUpdate.length } };
}
