import { saveFileLocally } from "@/shared/lib/file-system";
import type { SiteInfoInput } from "@/shared/lib/validations/settings";

/**
 * FormData'dan gelen verileri veritabanı formatına map'ler
 */
export function mapSettingsData(data: SiteInfoInput): Record<string, string> {
    const settings: Record<string, string> = {};

    // General settings
    if (data.site_name) settings.site_name = data.site_name;
    if (data.site_footer_text) settings.site_footer_text = data.site_footer_text;

    // SEO settings
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
        if (data[key] !== undefined) settings[key] = data[key] as string;
    });

    // Feature toggles
    if (data.maintenance_mode !== undefined) settings.maintenance_mode = data.maintenance_mode;
    if (data.watch_together !== undefined) settings.watch_together = data.watch_together;

    // Social media
    const socialKeys = ["social_x", "social_instagram", "social_telegram", "social_discord", "social_reddit"] as const;
    socialKeys.forEach(key => {
        if (data[key] !== undefined) settings[key] = data[key] as string;
    });

    return settings;
}

/**
 * Logo ve favicon dosyalarını yükler ve ayarlara ekler
 */
export async function handleSettingsFiles(
    data: SiteInfoInput,
    settings: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
    if (data.site_logo instanceof File) {
        const ext = data.site_logo.name.split('.').pop();
        const upload = await saveFileLocally(data.site_logo, `logo-${Date.now()}.${ext}`, "uploads/logo");
        if (!upload.success) return { success: false, error: "Logo kaydedilemedi: " + upload.error };
        settings.site_logo = upload.path!;
    }

    if (data.site_favicon instanceof File) {
        const ext = data.site_favicon.name.split('.').pop();
        const upload = await saveFileLocally(data.site_favicon, `favicon-${Date.now()}.${ext}`, "uploads/icon");
        if (!upload.success) return { success: false, error: "Favicon kaydedilemedi: " + upload.error };
        settings.site_favicon = upload.path!;
    }

    return { success: true };
}
