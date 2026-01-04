import { z } from "zod";

export const reviewTitleSchema = z.string()
    .min(1, "Başlık boş olamaz")
    .max(100, "Başlık çok uzun (maksimum 100 karakter)");

export const reviewContentSchema = z.string()
    .min(10, "İnceleme en az 10 karakter olmalı")
    .max(5000, "İnceleme çok uzun (maksimum 5000 karakter)");

export const createReviewSchema = z.object({
    animeId: z.string().uuid("Geçerli bir anime ID gerekli"),
    title: reviewTitleSchema.optional().nullable(),
    content: reviewContentSchema,
    rating: z.number().min(1, "En az 1 yıldız vermelisiniz").max(10, "En fazla 10 yıldız verebilirsiniz"),
    isSpoiler: z.boolean().default(false),
});

export const updateReviewSchema = z.object({
    id: z.string().uuid("Geçerli bir inceleme ID gerekli"),
    title: reviewTitleSchema.optional().nullable(),
    content: reviewContentSchema.optional(),
    rating: z.number().min(1).max(10).optional(),
    isSpoiler: z.boolean().optional(),
});

export const reviewIdSchema = z.string().uuid("Geçerli bir inceleme ID gerekli");

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
