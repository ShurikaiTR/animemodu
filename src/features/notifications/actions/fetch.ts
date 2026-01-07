"use server";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireUser } from "@/shared/lib/auth/guards";

import { NotificationService } from "../services/notification-service";

/**
 * Kullanıcının bildirimlerini getir
 */
export async function getNotifications(limit = 20) {
    const auth = await requireUser();
    if (isAuthError(auth)) return auth;

    return await safeAction(async () => {
        return await NotificationService.getUserNotifications(auth.userId, limit);
    }, "getNotifications");
}

/**
 * Okunmamış bildirim sayısını getir
 */
export async function getUnreadCount() {
    const auth = await requireUser();
    if (isAuthError(auth)) return { success: false, error: auth.error };

    return await safeAction(async () => {
        const count = await NotificationService.getUnreadCount(auth.userId);
        return { count };
    }, "getUnreadCount");
}
