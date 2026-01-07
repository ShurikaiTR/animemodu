import { TMDB_API_KEY, TMDB_BASE_URL } from "./constants";
import type { Genre } from "./types";

export class TMDBReferenceService {
    static async getTVGenres(): Promise<Genre[]> {
        if (!TMDB_API_KEY) return [];

        try {
            const res = await fetch(
                `${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=tr-TR`,
                { next: { revalidate: 86400 } }
            );

            if (!res.ok) return [];

            const data = await res.json();
            return data.genres;
        } catch {
            return [];
        }
    }

    static async getMovieGenres(): Promise<Genre[]> {
        if (!TMDB_API_KEY) return [];

        try {
            const res = await fetch(
                `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=tr-TR`,
                { next: { revalidate: 86400 } }
            );

            if (!res.ok) return [];

            const data = await res.json();
            return data.genres;
        } catch {
            return [];
        }
    }
}
