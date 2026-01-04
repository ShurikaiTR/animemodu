"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { requireAdmin, isAuthError } from "@/shared/lib/auth/guards";
import { logError } from "@/shared/lib/errors";
import { revalidatePath } from "next/cache";
import { parseSettingsFormData, formatZodError } from "@/shared/lib/validations/settings";
import { mapSettingsData, handleSettingsFiles } from "./utils";

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

        // Use upsert to handle both insert and update
        const upsertData = Object.entries(settings).map(([key, value]) => ({
            key,
            value
        }));

        const { error } = await supabase
            .from("site_settings")
            .upsert(upsertData, { onConflict: "key" });

        if (error) {
            logError("updateSiteInfo upsert", error);
            return { success: false, error: `Ayarlar kaydedilemedi: ${error.message}` };
        }

        revalidatePath("/panel/settings", "page");
        revalidatePath("/", "layout");

        return { success: true };
    } catch (error) {
        logError("updateSiteInfo", error);
        return { success: false, error: "Ayarlar güncellenirken hata oluştu." };
    }
}
