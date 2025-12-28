import { z } from "zod";

// UUID validation schema for user IDs
export const userIdSchema = z.string().uuid("Geçerli bir kullanıcı ID gerekli");

export type UserId = z.infer<typeof userIdSchema>;

// Helper to validate userId
export function validateUserId(userId: string): { success: true; data: string } | { success: false; error: string } {
    const result = userIdSchema.safeParse(userId);
    if (!result.success) {
        return { success: false, error: "Geçersiz kullanıcı ID" };
    }
    return { success: true, data: result.data };
}
