import { getImageUrl } from "@/shared/lib/tmdb/utils";

/**
 * Raw anime data from database query
 */
export interface AnimeDataRaw {
    id: string;
    title: string;
    slug: string;
    poster_path: string | null;
    vote_average: number | null;
    release_date: string | null;
    genres: string[] | null;
}

/**
 * Transformed anime card data for UI
 */
export interface AnimeCardDTO {
    id: string;
    title: string;
    slug: string;
    poster_url: string;
    score: number | null;
    release_year: number;
    genres: string[] | null;
}

/**
 * Minimal anime data for references (activities, etc.)
 */
export interface AnimeMinimalDTO {
    title: string;
    slug: string;
    poster_path: string | null;
}

/**
 * Mapper for transforming anime data between layers
 */
export const AnimeMapper = {
    /**
     * Transform raw anime data to card display format
     */
    toCard(anime: AnimeDataRaw): AnimeCardDTO {
        return {
            id: anime.id,
            title: anime.title,
            slug: anime.slug,
            poster_url: getImageUrl(anime.poster_path, "w500"),
            score: anime.vote_average,
            release_year: anime.release_date
                ? new Date(anime.release_date).getFullYear()
                : 0,
            genres: anime.genres
        };
    },

    /**
     * Transform raw anime data to minimal reference format
     */
    toMinimal(anime: AnimeDataRaw): AnimeMinimalDTO {
        return {
            title: anime.title,
            slug: anime.slug,
            poster_path: anime.poster_path
        };
    }
};
