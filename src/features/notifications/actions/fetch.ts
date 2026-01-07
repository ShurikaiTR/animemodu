"use server";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireUser } from "@/shared/lib/auth/guards";
import { formatZodError, getNotificationsSchema } from "@/shared/lib/validations/notification";

import { NotificationQueryService } from "../services/notification-query-service";

/**
 * Kullanıcının bildirimlerini getir
 */
export async function getNotifications(limit = 50, filter = "all", tab = "all") {
    const auth = await requireUser();
    if (isAuthError(auth)) return auth;

    const validation = getNotificationsSchema.safeParse({ limit, filter, tab });
    if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
    }

    return await safeAction(async () => {
        return await NotificationQueryService.getUserNotifications(
            auth.userId,
            validation.data.limit,
            validation.data.filter as "all" | "likes" | "replies" | "system",
            validation.data.tab as "all" | "unread"
        );
    }, "getNotifications");
}

/**
 * Okunmamış bildirim sayısını getir
 */
export async function getUnreadCount() {
    const auth = await requireUser();
    if (isAuthError(auth)) return { success: false, error: auth.error };

    return await safeAction(async () => {
        const count = await NotificationQueryService.getUnreadCount(auth.userId);
        return { count };
    }, "getUnreadCount");
}
