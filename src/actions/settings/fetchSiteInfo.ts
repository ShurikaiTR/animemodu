"use server";

import { createPublicClient } from "@/lib/supabase/server";
import { logError } from "@/lib/errors";
import { unstable_cache } from "next/cache";
import type { SiteInfo } from "@/types/supabase/tables";
import { DEFAULT_SITE_INFO } from "@/types/supabase/tables";

type SettingRow = { key: string | null; value: string | null };

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
                const typedRow = row as unknown as SettingRow;
                if (typedRow.key && typedRow.value) {
                    settings[typedRow.key] = typedRow.value;
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
        revalidate: 3600,
        tags: ["site-info"]
    }
);

/**
 * Site bilgilerini typed olarak getirir (Server Action uyumlu wrapper)
 */
export async function getSiteInfo(): Promise<SiteInfo> {
    return getSiteInfoCached();
}
