import { TMDBResult } from "./types";
import { TMDB_API_KEY, TMDB_BASE_URL } from "./constants";

export async function searchMulti(query: string): Promise<TMDBResult[]> {
    if (!query) return [];

    if (!TMDB_API_KEY) {
        throw new Error("TMDB API key is not configured");
    }

    try {
        const res = await fetch(
            `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=tr-TR&include_adult=false`,
            { next: { revalidate: 60 } }
        );

        if (!res.ok) {
            throw new Error(`TMDB API Error: ${res.statusText}`);
        }

        const data = await res.json();
        return (data.results as TMDBResult[]).filter(item => item.media_type === "movie" || item.media_type === "tv");
    } catch {
        return [];
    }
}










