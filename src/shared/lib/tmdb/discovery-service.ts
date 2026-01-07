import { TMDB_API_KEY, TMDB_BASE_URL } from "./constants";
import type { TMDBResult } from "./types";

export class TMDBDiscoveryService {
    static async getTrendingAnime(page: number = 1): Promise<TMDBResult[]> {
        if (!TMDB_API_KEY) return [];

        try {
            const res = await fetch(
                `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=tr-TR&sort_by=popularity.desc&with_genres=16&with_original_language=ja&page=${page}`,
                { next: { revalidate: 3600 } }
            );

            if (!res.ok) return [];

            const data = await res.json();
            return (data.results as TMDBResult[]).map(item => ({ ...item, media_type: "tv" as const }));
        } catch {
            return [];
        }
    }

    static async getPopularAnimeMovies(page: number = 1): Promise<TMDBResult[]> {
        if (!TMDB_API_KEY) return [];

        try {
            const res = await fetch(
                `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=tr-TR&sort_by=popularity.desc&with_genres=16&with_original_language=ja&page=${page}`,
                { next: { revalidate: 3600 } }
            );

            if (!res.ok) return [];

            const data = await res.json();
            return (data.results as TMDBResult[]).map(item => ({ ...item, media_type: "movie" as const }));
        } catch {
            return [];
        }
    }

    static async getWeeklyTrendingAnime(): Promise<TMDBResult[]> {
        if (!TMDB_API_KEY) return [];

        try {
            const res = await fetch(
                `${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}&language=tr-TR`,
                { next: { revalidate: 3600 } }
            );

            if (!res.ok) return [];

            const data = await res.json();
            // Expanded TMDBResult type locally to avoid touching global types if not needed
            const results = (data.results as (TMDBResult & { origin_country?: string[], genre_ids?: number[] })[])
                .filter(item =>
                    item.origin_country?.includes("JP") &&
                    item.genre_ids?.includes(16)
                )
                .map(item => ({ ...item, media_type: "tv" as const }));

            return results;
        } catch {
            return [];
        }
    }
}
