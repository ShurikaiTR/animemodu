"use server";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireUser } from "@/shared/lib/auth/guards";
import { formatZodError,notificationIdSchema } from "@/shared/lib/validations/notification";

import { NotificationService } from "../services/notification-service";

/**
 * Tek bir bildirimi okundu olarak işaretle
 */
export async function markNotificationAsRead(notificationId: string) {
    const auth = await requireUser();
    if (isAuthError(auth)) return auth;

    const validation = notificationIdSchema.safeParse({ id: notificationId });
    if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
    }

    return await safeAction(async () => {
        await NotificationService.markAsRead(auth.userId, validation.data.id);
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

    const validation = notificationIdSchema.safeParse({ id: notificationId });
    if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
    }

    return await safeAction(async () => {
        await NotificationService.deleteNotification(auth.userId, validation.data.id);
    }, "deleteNotification");
}
