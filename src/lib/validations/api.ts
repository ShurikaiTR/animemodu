import { z } from "zod";

// Search query schema - for internal anime search
export const searchQuerySchema = z.object({
    q: z.string().min(2, "Arama en az 2 karakter olmalı").max(100, "Arama çok uzun"),
});

// TMDB search query schema
export const tmdbSearchQuerySchema = z.object({
    query: z.string().min(1, "Arama terimi gerekli").max(100, "Arama çok uzun"),
});

// TMDB details query schema
export const tmdbDetailsQuerySchema = z.object({
    id: z.coerce.number().positive("Geçerli bir ID gerekli"),
    type: z.enum(["movie", "tv"], "Type 'movie' veya 'tv' olmalı"),
});

// Helper to parse URL search params
export function parseSearchParams<T extends z.ZodSchema>(
    searchParams: URLSearchParams,
    schema: T
): ReturnType<T["safeParse"]> {
    const data: Record<string, string> = {};
    searchParams.forEach((value, key) => {
        data[key] = value;
    });
    return schema.safeParse(data) as ReturnType<T["safeParse"]>;
}
