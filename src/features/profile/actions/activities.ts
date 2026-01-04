"use server";

import { revalidatePath } from "next/cache";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireUser } from "@/shared/lib/auth/guards";
import type { ActivityMetadata, ActivityType } from "@/shared/types/helpers";

import { ActivityService } from "../services/activity-service";

/**
 * Kullanıcının son aktivitelerini getirir
 * Public data - auth gerektirmez
 */
export async function getUserActivities(userId: string, limit = 20) {
    return await safeAction(async () => {
        return await ActivityService.getUserActivities(userId, limit);
    }, "getUserActivities");
}

export async function createActivity(
    activityType: ActivityType,
    animeId: string | null = null,
    metadata: ActivityMetadata = {}
) {
    return await safeAction(async () => {
        const auth = await requireUser();
        if (isAuthError(auth)) {
            throw new Error(auth.error);
        }

        await ActivityService.createActivity({
            userId: auth.userId,
            activityType,
            animeId,
            metadata
        });

        // Aktivite cache'ini invalidate et
        if (auth.username) {
            revalidatePath(`/profil/${auth.username}`);
        }
    }, "createActivity");
}
