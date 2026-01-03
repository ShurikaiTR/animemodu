import { z } from "zod";

export const siteInfoSchema = z.object({
    // General
    site_name: z.string().min(1, "Site adı zorunludur").max(50, "Site adı en fazla 50 karakter olabilir"),
    site_footer_text: z.string().max(500, "Footer metni en fazla 500 karakter olabilir").optional(),
    site_logo: z.union([z.instanceof(File), z.string()]).optional(),
    site_favicon: z.union([z.instanceof(File), z.string()]).optional(),
    // SEO - General
    seo_og_image: z.string().max(200, "OG görsel URL en fazla 200 karakter olabilir").optional(),
    // SEO - Home
    seo_home_title: z.string().max(70, "Başlık en fazla 70 karakter olabilir").optional(),
    seo_home_description: z.string().max(200, "Açıklama en fazla 200 karakter olabilir").optional(),
    // SEO - Discover
    seo_discover_title: z.string().max(70, "Başlık en fazla 70 karakter olabilir").optional(),
    seo_discover_description: z.string().max(200, "Açıklama en fazla 200 karakter olabilir").optional(),
    // SEO - Animes
    seo_animes_title: z.string().max(70, "Başlık en fazla 70 karakter olabilir").optional(),
    seo_animes_description: z.string().max(200, "Açıklama en fazla 200 karakter olabilir").optional(),
    // SEO - Movies
    seo_movies_title: z.string().max(70, "Başlık en fazla 70 karakter olabilir").optional(),
    seo_movies_description: z.string().max(200, "Açıklama en fazla 200 karakter olabilir").optional(),
    // SEO - Calendar
    seo_calendar_title: z.string().max(70, "Başlık en fazla 70 karakter olabilir").optional(),
    seo_calendar_description: z.string().max(200, "Açıklama en fazla 200 karakter olabilir").optional(),
    // SEO - Anime Detail
    seo_anime_title: z.string().max(100, "Başlık şablonu en fazla 100 karakter olabilir").optional(),
    seo_anime_description: z.string().max(250, "Açıklama şablonu en fazla 250 karakter olabilir").optional(),
    // SEO - Watch
    seo_watch_title: z.string().max(100, "Başlık şablonu en fazla 100 karakter olabilir").optional(),
    seo_watch_description: z.string().max(250, "Açıklama şablonu en fazla 250 karakter olabilir").optional(),
    // Feature toggles
    maintenance_mode: z.string().optional(),
    watch_together: z.string().optional(),
    // Social media
    social_x: z.string().url("Geçerli bir URL giriniz").or(z.literal("")).optional(),
    social_instagram: z.string().url("Geçerli bir URL giriniz").or(z.literal("")).optional(),
    social_telegram: z.string().url("Geçerli bir URL giriniz").or(z.literal("")).optional(),
    social_discord: z.string().url("Geçerli bir URL giriniz").or(z.literal("")).optional(),
    social_reddit: z.string().url("Geçerli bir URL giriniz").or(z.literal("")).optional(),
});

export type SiteInfoInput = z.infer<typeof siteInfoSchema>;

export const parseSettingsFormData = (formData: FormData) => {
    const data: Record<string, unknown> = {};

    formData.forEach((value, key) => {
        if (value instanceof File && value.size === 0) return;
        data[key] = value;
    });

    return siteInfoSchema.safeParse(data);
};

export const formatZodError = (error: z.ZodError) => {
    return error.issues.map((issue) => issue.message).join(", ");
};
