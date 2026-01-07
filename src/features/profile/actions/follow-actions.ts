"use server";

import { revalidatePath } from "next/cache";

import { NotificationMutationService } from "@/features/notifications/services/notification-mutation-service";
import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireUser } from "@/shared/lib/auth/guards";

import { ActivityService } from "../services/activity-service";
import { FollowService } from "../services/follow-service";
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
        const result = await FollowService.toggleFollow(currentUserId, targetUserId);

        const [targetProfile, currentProfile] = await Promise.all([
            ProfileService.getProfileById(targetUserId),
            ProfileService.getProfileById(currentUserId)
        ]);

        if (result.isFollowing) {
            await Promise.all([
                ActivityService.createActivity({
                    userId: currentUserId,
                    activityType: "follow_add",
                    metadata: { target_user_id: targetUserId, target_username: targetProfile?.username || "Kullanıcı" },
                }),
                ActivityService.createActivity({
                    userId: targetUserId,
                    activityType: "followed_by",
                    metadata: { follower_user_id: currentUserId, follower_username: currentProfile?.username || "Kullanıcı" },
                }),
                // Takip edilen kullanıcıya bildirim gönder
                NotificationMutationService.createNotification({
                    userId: targetUserId,
                    type: "new_follower",
                    title: "seni takip etmeye başladı",
                    link: `/profil/${currentProfile?.username}`,
                    actorId: currentUserId,
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
        const isFollowing = await FollowService.getFollowStatus(auth.userId, targetUserId);
        return { isFollowing };
    }, "getFollowStatus");
}

/**
 * Get follower and following counts for a user
 */
export async function getFollowCounts(userId: string) {
    return await safeAction(async () => {
        return await FollowService.getFollowCounts(userId);
    }, "getFollowCounts");
}
