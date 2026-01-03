"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { requireAdmin, isAuthError } from "@/shared/lib/auth/guards";
import { logError } from "@/shared/lib/errors";
import { revalidatePath } from "next/cache";
import { parseSettingsFormData, formatZodError } from "@/shared/lib/validations/settings";

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
        const supabase = await createClient();
        const { error } = await supabase
            .from("site_settings")
            .update({ value })
            .eq("key", key);

        if (error) {
            logError("updateSetting", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/panel/settings", "page");
        revalidatePath("/", "layout");

        return { success: true };
    } catch (error) {
        logError("updateSetting", error);
        return { success: false, error: "Ayar güncellenirken hata oluştu." };
    }
}

/**
 * Birden fazla ayarı topluca günceller (admin only)
 */
export async function updateSettings(
    settings: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    try {
        const supabase = await createClient();
        const updates = Object.entries(settings).map(([key, value]) =>
            supabase.from("site_settings").update({ value }).eq("key", key)
        );

        const results = await Promise.all(updates);
        const errors = results.filter((r) => r.error);
        if (errors.length > 0) {
            logError("updateSettings", errors[0].error);
            return { success: false, error: "Bazı ayarlar güncellenemedi." };
        }

        revalidatePath("/panel/settings", "page");
        revalidatePath("/", "layout");

        return { success: true };
    } catch (error) {
        logError("updateSettings", error);
        return { success: false, error: "Ayarlar güncellenirken hata oluştu." };
    }
}

import { mapSettingsData, handleSettingsFiles } from "./utils";

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

        const data = validation.data;
        const supabase = await createClient();
        const settings = mapSettingsData(data);

        const fileJob = await handleSettingsFiles(data, settings);
        if (!fileJob.success) return fileJob;

        const updates = Object.entries(settings).map(([key, value]) =>
            supabase.from("site_settings").update({ value }).eq("key", key)
        );

        await Promise.all(updates);

        revalidatePath("/panel/settings", "page");
        revalidatePath("/", "layout");

        return { success: true };
    } catch (error) {
        logError("updateSiteInfo", error);
        return { success: false, error: "Ayarlar güncellenirken hata oluştu." };
    }
}
