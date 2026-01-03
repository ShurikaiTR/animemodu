"use server";

import { createPublicClient } from "@/shared/lib/supabase/server";
import { logError } from "@/shared/lib/errors";
import { unstable_cache } from "next/cache";
import type { SiteInfo } from "@/shared/types/helpers";
import { DEFAULT_SITE_INFO } from "@/shared/types/helpers";

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
                const typedRow = row as SettingRow;
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
                // SEO - General
                seo_og_image: settings.seo_og_image || DEFAULT_SITE_INFO.seo_og_image,
                // SEO - Home
                seo_home_title: settings.seo_home_title || DEFAULT_SITE_INFO.seo_home_title,
                seo_home_description: settings.seo_home_description || DEFAULT_SITE_INFO.seo_home_description,
                // SEO - Discover
                seo_discover_title: settings.seo_discover_title || DEFAULT_SITE_INFO.seo_discover_title,
                seo_discover_description: settings.seo_discover_description || DEFAULT_SITE_INFO.seo_discover_description,
                // SEO - Animes
                seo_animes_title: settings.seo_animes_title || DEFAULT_SITE_INFO.seo_animes_title,
                seo_animes_description: settings.seo_animes_description || DEFAULT_SITE_INFO.seo_animes_description,
                // SEO - Movies
                seo_movies_title: settings.seo_movies_title || DEFAULT_SITE_INFO.seo_movies_title,
                seo_movies_description: settings.seo_movies_description || DEFAULT_SITE_INFO.seo_movies_description,
                // SEO - Calendar
                seo_calendar_title: settings.seo_calendar_title || DEFAULT_SITE_INFO.seo_calendar_title,
                seo_calendar_description: settings.seo_calendar_description || DEFAULT_SITE_INFO.seo_calendar_description,
                // SEO - Anime Detail
                seo_anime_title: settings.seo_anime_title || DEFAULT_SITE_INFO.seo_anime_title,
                seo_anime_description: settings.seo_anime_description || DEFAULT_SITE_INFO.seo_anime_description,
                // SEO - Watch
                seo_watch_title: settings.seo_watch_title || DEFAULT_SITE_INFO.seo_watch_title,
                seo_watch_description: settings.seo_watch_description || DEFAULT_SITE_INFO.seo_watch_description,
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
