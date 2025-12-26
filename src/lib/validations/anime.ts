import { z } from "zod";

// Common schemas
const mediaTypeSchema = z.enum(["movie", "tv"]);
const structureTypeSchema = z.enum(["seasonal", "absolute"]);

// TMDB Item schema for addAnime
const tmdbItemSchema = z.object({
    id: z.number().positive(),
    title: z.string().optional(),
    name: z.string().optional(),
    original_title: z.string().optional(),
    original_name: z.string().optional(),
    overview: z.string().optional(),
    poster_path: z.string().nullable().optional(),
    backdrop_path: z.string().nullable().optional(),
    vote_average: z.number().optional(),
    release_date: z.string().optional(),
    first_air_date: z.string().optional(),
    media_type: mediaTypeSchema.optional(),
});

// Add Anime schema
export const addAnimeSchema = z.object({
    tmdbItem: z.string().transform((val, ctx) => {
        try {
            const parsed = JSON.parse(val);
            return tmdbItemSchema.parse(parsed);
        } catch {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Geçersiz TMDB verisi",
            });
            return z.NEVER;
        }
    }),
    customTitle: z.string().min(1, "Başlık zorunludur").max(200, "Başlık çok uzun"),
    structureType: structureTypeSchema,
});

export type AddAnimeInput = z.infer<typeof addAnimeSchema>;

// Update Anime schema
export const updateAnimeSchema = z.object({
    id: z.coerce.number().positive("Geçerli bir ID gerekli"),
    title: z.string().min(1).max(200).optional().nullable(),
    original_title: z.string().max(200).optional().nullable(),
    slug: z.string().min(1).max(200).optional().nullable(),
    overview: z.string().max(5000).optional().nullable(),
    poster_path: z.string().max(500).optional().nullable(),
    backdrop_path: z.string().max(500).optional().nullable(),
    vote_average: z.coerce.number().min(0).max(10).optional().nullable(),
    release_date: z.string().optional().nullable(),
    structure_type: structureTypeSchema.optional().nullable(),
    is_featured: z.string().transform(val => val === "true").optional(),
    trailer_key: z.string().max(100).optional().nullable(),
    genres: z.string().transform(val => {
        try {
            return JSON.parse(val) as string[];
        } catch {
            return [];
        }
    }).optional(),
});

export type UpdateAnimeInput = z.infer<typeof updateAnimeSchema>;

// Update Episode schema
export const updateEpisodeSchema = z.object({
    id: z.coerce.number().positive("Geçerli bir bölüm ID gerekli"),
    overview: z.string().max(5000).optional().nullable(),
    vote_average: z.coerce.number().min(0).max(10).optional().nullable(),
    duration: z.coerce.number().min(0).optional().nullable(),
    still_path: z.string().max(500).optional().nullable(),
    air_date: z.string().optional().nullable(),
    video_url: z.string().url("Geçerli bir URL gerekli").max(1000).optional().nullable()
        .or(z.literal(""))
        .transform(val => val === "" ? null : val),
});

export type UpdateEpisodeInput = z.infer<typeof updateEpisodeSchema>;

// Anime ID schema (for delete, syncCharacters, updateEpisodes)
export const animeIdSchema = z.coerce.number().positive("Geçerli bir anime ID gerekli");

// Genre validation schemas
export const genreNameSchema = z.string()
    .min(1, "Tür adı boş olamaz")
    .max(50, "Tür adı çok uzun")
    .trim();

export const renameGenreSchema = z.object({
    oldName: genreNameSchema,
    newName: genreNameSchema,
}).refine(data => data.oldName !== data.newName, {
    message: "Yeni tür adı eskisiyle aynı olamaz",
    path: ["newName"],
});

export type RenameGenreInput = z.infer<typeof renameGenreSchema>;

// Helper to parse FormData with a schema
export function parseFormData<T extends z.ZodSchema>(
    formData: FormData,
    schema: T
): ReturnType<T["safeParse"]> {
    const data: Record<string, unknown> = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    return schema.safeParse(data) as ReturnType<T["safeParse"]>;
}

// Helper to format Zod errors for user display
export function formatZodError(error: z.ZodError): string {
    const messages = error.issues.map(issue => {
        const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
        return `${path}${issue.message}`;
    });
    return messages.join(", ");
}

// Report validation schemas
export const reportStatusSchema = z.enum(["pending", "resolved", "dismissed"]);
export const reportIdSchema = z.coerce.number().positive("Geçerli bir rapor ID gerekli");

export const updateReportStatusSchema = z.object({
    id: reportIdSchema,
    status: reportStatusSchema,
});

export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>;
