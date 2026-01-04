import { Genre,TMDBDetailResult } from "./types";

export function getImageUrl(path: string | null, size: "w200" | "w300" | "w500" | "w780" | "original" = "w500"): string {
    if (!path) return "/img/placeholder.jpg";
    if (path.startsWith("http") || path.startsWith("https")) return path;
    if (path.startsWith("/img/") || path.startsWith("/icons/")) return path;
    return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getTrailerUrl(videos: TMDBDetailResult["videos"]): string | null {
    if (!videos?.results) return null;

    const trailer = videos.results.find(
        v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
    );

    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}

export function getGenreName(genreIds: number[] | undefined, genres: Genre[]): string {
    if (!genreIds || genreIds.length === 0) return "Anime";
    const genre = genres.find(g => genreIds.includes(g.id));
    return genre?.name || "Anime";
}

export function getYear(releaseDate?: string, firstAirDate?: string): number {
    const date = releaseDate || firstAirDate;
    return date ? parseInt(date.split("-")[0], 10) : new Date().getFullYear();
}
