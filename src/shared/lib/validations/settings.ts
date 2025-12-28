import { z } from "zod";

export const siteInfoSchema = z.object({
    // General
    site_name: z.string().min(1, "Site adı zorunludur").max(50, "Site adı en fazla 50 karakter olabilir"),
    site_footer_text: z.string().max(500, "Footer metni en fazla 500 karakter olabilir").optional(),
    site_logo: z.union([z.instanceof(File), z.string()]).optional(),
    site_favicon: z.union([z.instanceof(File), z.string()]).optional(),
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
