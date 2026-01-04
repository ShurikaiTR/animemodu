"use server";

import { revalidatePath } from "next/cache";

import { formatZodError, parseSettingsFormData } from "@/features/settings/schemas/settings-schemas";
import { SettingsService } from "@/features/settings/services/settings-service";
import { isAuthError, requireAdmin } from "@/shared/lib/auth/guards";
import { logError } from "@/shared/lib/errors";

// ============================================
// WRITE OPERATIONS (Admin only)
// ============================================

/**
 * Tek bir ayarı günceller (admin only)
 */
export async function updateSetting(
    key: string,
    value: string
): Promise<{ success: boolean; error?: string }> {
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    try {
        const result = await SettingsService.updateSingleSetting(key, value);

        if (!result.success) {
            return { success: false, error: result.error };
        }

        revalidatePath("/panel/settings", "page");
        revalidatePath("/", "layout");

        return { success: true };
    } catch (error: unknown) {
        logError("updateSetting", error);
        return { success: false, error: "Ayar güncellenirken hata oluştu." };
    }
}

/**
 * Site bilgilerini topluca günceller (admin only)
 */
export async function updateSiteInfo(
    formData: FormData
): Promise<{ success: boolean; error?: string }> {
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    try {
        const validation = parseSettingsFormData(formData);
        if (!validation.success) {
            return { success: false, error: formatZodError(validation.error) };
        }

        const result = await SettingsService.updateSettings(validation.data);

        if (!result.success) {
            return { success: false, error: result.error };
        }

        revalidatePath("/panel/settings", "page");
        revalidatePath("/", "layout");

        return { success: true };
    } catch (error: unknown) {
        logError("updateSiteInfo", error);
        return { success: false, error: "Ayarlar güncellenirken hata oluştu." };
    }
}
