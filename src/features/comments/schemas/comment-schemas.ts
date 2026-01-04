import { z } from "zod";

export const commentContentSchema = z.string()
    .min(1, "Yorum boş olamaz")
    .max(2000, "Yorum çok uzun (maksimum 2000 karakter)");

export const createCommentSchema = z.object({
    animeId: z.string().uuid("Geçerli bir anime ID gerekli"),
    episodeId: z.string().uuid("Geçerli bir bölüm ID gerekli").optional().nullable(),
    parentId: z.string().uuid("Geçerli bir üst yorum ID gerekli").optional().nullable(),
    content: commentContentSchema,
    isSpoiler: z.boolean().default(false),
});

export const updateCommentSchema = z.object({
    id: z.string().uuid("Geçerli bir yorum ID gerekli"),
    content: commentContentSchema,
    isSpoiler: z.boolean().optional(),
});

export const commentIdSchema = z.string().uuid("Geçerli bir yorum ID gerekli");

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
