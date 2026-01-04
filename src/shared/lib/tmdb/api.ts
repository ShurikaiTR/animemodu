import { TMDB_API_KEY, TMDB_BASE_URL } from "./constants";
import { Genre,TMDBDetailResult, TMDBResult } from "./types";

// --- DETAILS ---

export async function getAnimeDetails(id: number, type: "movie" | "tv"): Promise<TMDBDetailResult | null> {
    if (!TMDB_API_KEY) {
        return null;
    }

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

export async function getTMDBDetails(id: number, type: "movie" | "tv") {
    if (!TMDB_API_KEY) {
        return null;
    }

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

export async function getSeasonDetails(tvId: number, seasonNumber: number) {
    if (!TMDB_API_KEY) {
        return null;
    }

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

export async function getTVGenres(): Promise<Genre[]> {
    if (!TMDB_API_KEY) {
        return [];
    }

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

export async function getMovieGenres(): Promise<Genre[]> {
    if (!TMDB_API_KEY) {
        return [];
    }

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

// --- DISCOVER ---

export async function getTrendingAnime(page: number = 1): Promise<TMDBResult[]> {
    if (!TMDB_API_KEY) {
        return [];
    }

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

export async function getPopularAnimeMovies(page: number = 1): Promise<TMDBResult[]> {
    if (!TMDB_API_KEY) {
        return [];
    }

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

export async function getWeeklyTrendingAnime(): Promise<TMDBResult[]> {
    if (!TMDB_API_KEY) {
        return [];
    }

    try {
        const res = await fetch(
            `${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}&language=tr-TR`,
            { next: { revalidate: 3600 } }
        );

        if (!res.ok) return [];

        const data = await res.json();
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

// --- SEARCH ---

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
