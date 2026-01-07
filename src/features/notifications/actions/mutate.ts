"use server";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireUser } from "@/shared/lib/auth/guards";

import { NotificationService } from "../services/notification-service";

/**
 * Tek bir bildirimi okundu olarak işaretle
 */
export async function markNotificationAsRead(notificationId: string) {
    const auth = await requireUser();
    if (isAuthError(auth)) return auth;

    return await safeAction(async () => {
        await NotificationService.markAsRead(auth.userId, notificationId);
    }, "markNotificationAsRead");
}

/**
 * Tüm bildirimleri okundu olarak işaretle
 */
export async function markAllNotificationsAsRead() {
    const auth = await requireUser();
    if (isAuthError(auth)) return auth;

    return await safeAction(async () => {
        await NotificationService.markAllAsRead(auth.userId);
    }, "markAllNotificationsAsRead");
}

/**
 * Bildirimi sil
 */
export async function deleteNotification(notificationId: string) {
    const auth = await requireUser();
    if (isAuthError(auth)) return auth;

    return await safeAction(async () => {
        await NotificationService.deleteNotification(auth.userId, notificationId);
    }, "deleteNotification");
}
