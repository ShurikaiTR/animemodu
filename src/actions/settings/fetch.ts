"use server";

import { createPublicClient } from "@/lib/supabase/server";
import { logError } from "@/lib/errors";
import { unstable_cache } from "next/cache";
import type { SiteInfo, SiteSettingRow } from "@/types/supabase/tables";
import { DEFAULT_SITE_INFO } from "@/types/supabase/tables";

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Tüm site ayarlarını getirir (public - herkes okuyabilir)
 */
export async function getAllSettings(): Promise<{
    success: boolean;
    data?: SiteSettingRow[];
    error?: string;
}> {
    try {
        const supabase = createPublicClient();

        const { data, error } = await supabase
            .from("site_settings")
            .select("*")
            .order("category", { ascending: true });

        if (error) {
            logError("getAllSettings", error);
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        logError("getAllSettings", error);
        return { success: false, error: "Ayarlar yüklenirken hata oluştu." };
    }
}

/**
 * Belirli bir kategorideki ayarları getirir
 */
export async function getSettingsByCategory(
    category: "general" | "seo" | "social" | "content" | "advanced"
): Promise<{ success: boolean; data?: SiteSettingRow[]; error?: string }> {
    try {
        const supabase = createPublicClient();

        const { data, error } = await supabase
            .from("site_settings")
            .select("*")
            .eq("category", category)
            .order("id", { ascending: true });

        if (error) {
            logError("getSettingsByCategory", error);
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        logError("getSettingsByCategory", error);
        return { success: false, error: "Ayarlar yüklenirken hata oluştu." };
    }
}

/**
 * Site bilgilerini çeken asıl önbellekli fonksiyon (Dahili kullanım)
 */
const getSiteInfoCached = unstable_cache(

    async (): Promise<SiteInfo> => {
        try {
            const supabase = createPublicClient();

            const { data, error } = await supabase
                .from("site_settings")
                .select("key, value");

            if (error || !data) {
                logError("getSiteInfo", error);
                return DEFAULT_SITE_INFO;
            }

            const settings: Record<string, string> = {};
            data.forEach((row) => {
                if (row.key && row.value) {
                    settings[row.key] = row.value;
                }
            });

            return {
                site_name: settings.site_name || DEFAULT_SITE_INFO.site_name,
                site_footer_text: settings.site_footer_text || DEFAULT_SITE_INFO.site_footer_text,
                site_logo: settings.site_logo || DEFAULT_SITE_INFO.site_logo,
                site_favicon: settings.site_favicon || DEFAULT_SITE_INFO.site_favicon,
                maintenance_mode: settings.maintenance_mode === "true",
                watch_together: settings.watch_together === "true",
                social_x: settings.social_x || DEFAULT_SITE_INFO.social_x,
                social_instagram: settings.social_instagram || DEFAULT_SITE_INFO.social_instagram,
                social_telegram: settings.social_telegram || DEFAULT_SITE_INFO.social_telegram,
                social_discord: settings.social_discord || DEFAULT_SITE_INFO.social_discord,
                social_reddit: settings.social_reddit || DEFAULT_SITE_INFO.social_reddit,
            };
        } catch (error) {
            logError("getSiteInfo", error);
            return DEFAULT_SITE_INFO;
        }
    },
    ["site-info"],
    {
        revalidate: 3600, // 1 saat önbellek
        tags: ["site-info"]
    }
);

/**
 * Site bilgilerini typed olarak getirir (Server Action uyumlu wrapper)
 */
export async function getSiteInfo(): Promise<SiteInfo> {
    return getSiteInfoCached();
}

/**
 * Tek bir ayarı key ile getirir
 */
export async function getSettingByKey(
    key: string
): Promise<{ success: boolean; data?: SiteSettingRow; error?: string }> {
    try {
        const supabase = createPublicClient();

        const { data, error } = await supabase
            .from("site_settings")
            .select("*")
            .eq("key", key)
            .single();

        if (error) {
            logError("getSettingByKey", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        logError("getSettingByKey", error);
        return { success: false, error: "Ayar yüklenirken hata oluştu." };
    }
}
