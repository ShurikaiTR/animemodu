import { TMDBDetailResult, Genre } from "./types";
import { TMDB_API_KEY, TMDB_BASE_URL } from "./constants";

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










