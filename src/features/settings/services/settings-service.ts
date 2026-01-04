import { saveFileLocally } from "@/shared/lib/file-system";
import { createClient } from "@/shared/lib/supabase/server";

import { SiteInfoInput } from "../schemas/settings-schemas";

export type SettingsResult =
    | { success: true; error?: never }
    | { success: false; error: string };

export const SettingsService = {
    /**
     * Tüm ayarları anahtar-değer haritası olarak döndürür
     */
    async getAllSettings(): Promise<Record<string, string>> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("site_settings")
            .select("key, value");

        if (error) throw new Error(error.message);

        const settingsCurrent: Record<string, string> = {};
        data?.forEach((item) => {
            if (item.value) settingsCurrent[item.key] = item.value;
        });

        return settingsCurrent;
    },

    /**
     * Ayarları günceller ve dosyaları kaydeder
     */
    async updateSettings(data: SiteInfoInput): Promise<SettingsResult> {
        const settingsToSave: Record<string, string> = {};

        // 1. Data Mapping

        // General
        if (data.site_name) settingsToSave.site_name = data.site_name;
        if (data.site_footer_text) settingsToSave.site_footer_text = data.site_footer_text;

        // SEO Keys
        const seoKeys = [
            "seo_og_image", "seo_home_title", "seo_home_description",
            "seo_discover_title", "seo_discover_description",
            "seo_animes_title", "seo_animes_description",
            "seo_movies_title", "seo_movies_description",
            "seo_calendar_title", "seo_calendar_description",
            "seo_anime_title", "seo_anime_description",
            "seo_watch_title", "seo_watch_description"
        ] as const;

        seoKeys.forEach(key => {
            if (data[key] !== undefined) settingsToSave[key] = data[key] as string;
        });

        // Feature toggles
        if (data.maintenance_mode !== undefined) settingsToSave.maintenance_mode = data.maintenance_mode;
        if (data.watch_together !== undefined) settingsToSave.watch_together = data.watch_together;

        // Social keys
        const socialKeys = ["social_x", "social_instagram", "social_telegram", "social_discord", "social_reddit"] as const;
        socialKeys.forEach(key => {
            if (data[key] !== undefined) settingsToSave[key] = data[key] as string;
        });

        // 2. File Handling
        if (data.site_logo instanceof File) {
            const ext = data.site_logo.name.split('.').pop();
            const upload = await saveFileLocally(data.site_logo, `logo-${Date.now()}.${ext}`, "uploads/logo");
            if (!upload.success) return { success: false, error: "Logo kaydedilemedi: " + upload.error };
            settingsToSave.site_logo = upload.path!;
        }

        if (data.site_favicon instanceof File) {
            const ext = data.site_favicon.name.split('.').pop();
            const upload = await saveFileLocally(data.site_favicon, `favicon-${Date.now()}.${ext}`, "uploads/icon");
            if (!upload.success) return { success: false, error: "Favicon kaydedilemedi: " + upload.error };
            settingsToSave.site_favicon = upload.path!;
        }

        // 3. Database Upsert
        const supabase = await createClient();
        const upsertData = Object.entries(settingsToSave).map(([key, value]) => ({
            key,
            value
        }));

        const { error } = await supabase
            .from("site_settings")
            .upsert(upsertData, { onConflict: "key" });

        if (error) return { success: false, error: error.message };

        return { success: true };
    },

    /**
     * Tekil güncelleme (fallback için)
     */
    async updateSingleSetting(key: string, value: string): Promise<SettingsResult> {
        const supabase = await createClient();
        const { error } = await supabase
            .from("site_settings")
            .update({ value })
            .eq("key", key);

        if (error) return { success: false, error: error.message };
        return { success: true };
    }
};
