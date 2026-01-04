"use server";

import { revalidatePath } from "next/cache";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireUser } from "@/shared/lib/auth/guards";
import { createClient } from "@/shared/lib/supabase/server";

import { ProfileService } from "../services/profile-service";

/**
 * Toggle follow/unfollow a user
 */
export async function toggleFollow(targetUserId: string) {
    const auth = await requireUser();
    if (isAuthError(auth)) return auth;

    const currentUserId = auth.userId;

    if (currentUserId === targetUserId) {
        return { success: false, error: "Kendinizi takip edemezsiniz" };
    }

    return await safeAction(async () => {
        const result = await ProfileService.toggleFollow(currentUserId, targetUserId);

        const [targetProfile, currentProfile] = await Promise.all([
            ProfileService.getProfileBasic(targetUserId),
            ProfileService.getProfileBasic(currentUserId)
        ]);

        if (result.isFollowing) {
            const supabase = await createClient();
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
        }

        revalidatePath(`/profil/${targetProfile?.username}`);
        revalidatePath(`/profil/${currentProfile?.username}`);

        return { isFollowing: result.isFollowing };
    }, "toggleFollow");
}

/**
 * Get follow status for a user
 */
export async function getFollowStatus(targetUserId: string) {
    const auth = await requireUser();
    // Return compatible structure for auth error or not-logged-in
    if (isAuthError(auth)) return { success: true, data: { isFollowing: false } };

    return await safeAction(async () => {
        const isFollowing = await ProfileService.getFollowStatus(auth.userId, targetUserId);
        return { isFollowing };
    }, "getFollowStatus");
}

/**
 * Get follower and following counts for a user
 */
export async function getFollowCounts(userId: string) {
    return await safeAction(async () => {
        return await ProfileService.getFollowCounts(userId);
    }, "getFollowCounts");
}
