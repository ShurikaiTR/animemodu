"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { requireUser, isAuthError } from "@/shared/lib/auth/guards";
import { logError } from "@/shared/lib/errors";

type FollowCountsResult =
    | { success: true; data: { followers: number; following: number } }
    | { success: false; error: string };

type FollowStatusResult =
    | { success: true; isFollowing: boolean }
    | { success: false; error: string };

/**
 * Get follow status for a user
 */
export async function getFollowStatus(targetUserId: string): Promise<FollowStatusResult> {
    const auth = await requireUser();
    if (isAuthError(auth)) {
        return { success: true, isFollowing: false };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("user_follows")
        .select("id")
        .eq("follower_id", auth.userId)
        .eq("following_id", targetUserId)
        .maybeSingle();

    if (error) {
        logError("getFollowStatus", error);
        return { success: false, error: "Durum alınamadı" };
    }

    return { success: true, isFollowing: !!data };
}

/**
 * Get follower and following counts for a user
 */
export async function getFollowCounts(userId: string): Promise<FollowCountsResult> {
    const supabase = await createClient();

    const { count: followersCount, error: followersError } = await supabase
        .from("user_follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId);

    if (followersError) {
        logError("getFollowCounts.followers", followersError);
        return { success: false, error: "Takipçi sayısı alınamadı" };
    }

    const { count: followingCount, error: followingError } = await supabase
        .from("user_follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId);

    if (followingError) {
        logError("getFollowCounts.following", followingError);
        return { success: false, error: "Takip sayısı alınamadı" };
    }

    return {
        success: true,
        data: {
            followers: followersCount || 0,
            following: followingCount || 0,
        },
    };
}
