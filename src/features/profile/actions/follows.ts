"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { requireUser, isAuthError } from "@/shared/lib/auth/guards";
import { logError } from "@/shared/lib/errors";
import { revalidatePath } from "next/cache";

type FollowResult =
    | { success: true; isFollowing: boolean }
    | { success: false; error: string };

/**
 * Toggle follow/unfollow a user
 */
export async function toggleFollow(targetUserId: string): Promise<FollowResult> {
    const auth = await requireUser();
    if (isAuthError(auth)) {
        return { success: false, error: auth.error };
    }

    const currentUserId = auth.userId;

    if (currentUserId === targetUserId) {
        return { success: false, error: "Kendinizi takip edemezsiniz" };
    }

    const supabase = await createClient();

    const { data: existingFollow, error: checkError } = await supabase
        .from("user_follows")
        .select("id")
        .eq("follower_id", currentUserId)
        .eq("following_id", targetUserId)
        .maybeSingle();

    if (checkError) {
        logError("toggleFollow.check", checkError);
        return { success: false, error: "Takip durumu kontrol edilemedi" };
    }

    const [targetProfile, currentProfile] = await Promise.all([
        supabase.from("profiles").select("username").eq("id", targetUserId).single(),
        supabase.from("profiles").select("username").eq("id", currentUserId).single(),
    ]);

    if (existingFollow) {
        return await handleUnfollow(supabase, currentUserId, targetUserId, existingFollow, targetProfile.data);
    }
    return await handleFollow(supabase, currentUserId, targetUserId, targetProfile.data, currentProfile.data);
}

async function handleUnfollow(
    supabase: Awaited<ReturnType<typeof createClient>>,
    currentUserId: string,
    targetUserId: string,
    existingFollow: { id: string },
    targetProfile: { username: string | null } | null
): Promise<FollowResult> {
    const { error } = await supabase
        .from("user_follows")
        .delete()
        .eq("id", existingFollow.id);

    if (error) {
        logError("toggleFollow.unfollow", error);
        return { success: false, error: "Takip bırakılamadı" };
    }

    revalidatePath(`/profil/${targetProfile?.username}`);
    return { success: true, isFollowing: false };
}

async function handleFollow(
    supabase: Awaited<ReturnType<typeof createClient>>,
    currentUserId: string,
    targetUserId: string,
    targetProfile: { username: string | null } | null,
    currentProfile: { username: string | null } | null
): Promise<FollowResult> {
    const { error } = await supabase
        .from("user_follows")
        .insert({ follower_id: currentUserId, following_id: targetUserId });

    if (error) {
        logError("toggleFollow.follow", error);
        return { success: false, error: "Takip edilemedi" };
    }

    await Promise.all([
        supabase.from("user_activities").insert({
            user_id: currentUserId,
            activity_type: "follow_add",
            metadata: { target_user_id: targetUserId, target_username: targetProfile?.username || "Kullanıcı" },
        }),
        supabase.from("user_activities").insert({
            user_id: targetUserId,
            activity_type: "followed_by",
            metadata: { follower_user_id: currentUserId, follower_username: currentProfile?.username || "Kullanıcı" },
        }),
    ]);

    revalidatePath(`/profil/${targetProfile?.username}`);
    revalidatePath(`/profil/${currentProfile?.username}`);
    return { success: true, isFollowing: true };
}
