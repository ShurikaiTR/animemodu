import { z } from "zod";

/**
 * Notification ID validation schema
 */
export const notificationIdSchema = z.object({
    id: z.string().uuid("Geçersiz bildirim ID formatı"),
});

/**
 * Get notifications parameters validation schema
 */
export const getNotificationsSchema = z.object({
    limit: z.number().int().min(1).max(100).default(50),
    filter: z.enum(["all", "likes", "replies", "system"]).default("all"),
    tab: z.enum(["all", "unread"]).default("all"),
});

/**
 * Helper to parse notification ID from string
 */
export const parseNotificationId = (id: string) => {
    return notificationIdSchema.safeParse({ id });
};

/**
 * Formatting Zod errors in a human-readable way
 */
export const formatZodError = (error: z.ZodError): string => {
    return error.issues.map(err => err.message).join(", ");
};
