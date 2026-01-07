import { TMDB_API_KEY, TMDB_BASE_URL } from "./constants";
import type { TMDBDetailResult, TMDBSeriesData } from "./types";

export class TMDBDetailsService {
    static async getAnimeDetails(id: number, type: "movie" | "tv"): Promise<TMDBDetailResult | null> {
        if (!TMDB_API_KEY) return null;

        try {
            const res = await fetch(
                `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=tr-TR&append_to_response=credits,videos,similar`,
                { next: { revalidate: 3600 } }
            );

            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    }

    static async getTMDBDetails(id: number, type: "movie" | "tv") {
        if (!TMDB_API_KEY) return null;

        try {
            const res = await fetch(
                `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=tr-TR`,
                { next: { revalidate: 3600 } }
            );

            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    }

    static async getSeasonDetails(tvId: number, seasonNumber: number): Promise<TMDBSeriesData | null> {
        if (!TMDB_API_KEY) return null;

        try {
            const res = await fetch(
                `${TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=tr-TR`,
                { next: { revalidate: 3600 } }
            );

            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    }
}
