"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import { logError } from "@/lib/errors";
import { revalidatePath, revalidateTag } from "next/cache";
import { parseSettingsFormData, formatZodError } from "@/lib/validations/settings";
import { saveFileLocally } from "@/lib/file-system";

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
        const settings: Record<string, string> = {};

        // General settings
        if (data.site_name) settings.site_name = data.site_name;
        if (data.site_footer_text) settings.site_footer_text = data.site_footer_text;

        // Feature toggles
        if (data.maintenance_mode !== undefined) settings.maintenance_mode = data.maintenance_mode;
        if (data.watch_together !== undefined) settings.watch_together = data.watch_together;

        // Social media - allow empty strings to clear values
        if (data.social_x !== undefined) settings.social_x = data.social_x;
        if (data.social_instagram !== undefined) settings.social_instagram = data.social_instagram;
        if (data.social_telegram !== undefined) settings.social_telegram = data.social_telegram;
        if (data.social_discord !== undefined) settings.social_discord = data.social_discord;
        if (data.social_reddit !== undefined) settings.social_reddit = data.social_reddit;

        if (data.site_logo instanceof File) {
            const fileName = `logo-${Date.now()}.${data.site_logo.name.split('.').pop()}`;
            const upload = await saveFileLocally(data.site_logo, fileName, "uploads/logo");
            if (upload.success && upload.path) settings.site_logo = upload.path;
            else return { success: false, error: "Logo kaydedilemedi: " + upload.error };
        }

        if (data.site_favicon instanceof File) {
            const fileName = `favicon-${Date.now()}.${data.site_favicon.name.split('.').pop()}`;
            const upload = await saveFileLocally(data.site_favicon, fileName, "uploads/icon");
            if (upload.success && upload.path) settings.site_favicon = upload.path;
            else return { success: false, error: "Favicon kaydedilemedi: " + upload.error };
        }

        const updates = Object.entries(settings).map(([key, value]) =>
            supabase.from("site_settings").update({ value }).eq("key", key)
        );

        await Promise.all(updates);

        // Fixed revalidateTag with correct parameters for the project
        revalidateTag("site-info", "max");

        revalidatePath("/panel/settings", "page");
        revalidatePath("/", "layout");

        return { success: true };
    } catch (error) {
        logError("updateSiteInfo", error);
        return { success: false, error: "Ayarlar güncellenirken hata oluştu." };
    }
}
