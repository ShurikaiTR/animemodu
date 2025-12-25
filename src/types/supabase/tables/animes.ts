import type { CharacterJson } from "./characters";

export interface AnimesTable {
    Row: {
        id: number
        tmdb_id: number
        title: string
        original_title: string | null
        overview: string | null
        poster_path: string | null
        backdrop_path: string | null
        vote_average: number | null
        release_date: string | null
        slug: string
        media_type: "movie" | "tv"
        structure_type?: "seasonal" | "absolute" | null
        genres?: string[] | null
        anilist_id?: number | null
        characters?: CharacterJson | null
        is_featured?: boolean
        trailer_key?: string | null
        created_at: string
    }
    Insert: {
        id?: number
        tmdb_id: number
        title: string
        original_title?: string | null
        overview?: string | null
        poster_path?: string | null
        backdrop_path?: string | null
        vote_average?: number | null
        release_date?: string | null
        slug: string
        media_type: "movie" | "tv"
        structure_type?: "seasonal" | "absolute" | null
        genres?: string[] | null
        anilist_id?: number | null
        characters?: CharacterJson | null
        is_featured?: boolean
        trailer_key?: string | null
        created_at?: string
    }
    Update: {
        id?: number
        tmdb_id?: number
        title?: string
        original_title?: string | null
        overview?: string | null
        poster_path?: string | null
        backdrop_path?: string | null
        vote_average?: number | null
        release_date?: string | null
        slug?: string
        media_type?: "movie" | "tv"
        structure_type?: "seasonal" | "absolute" | null
        genres?: string[] | null
        anilist_id?: number | null
        characters?: CharacterJson | null
        is_featured?: boolean
        trailer_key?: string | null
        created_at?: string
    }
    Relationships: []
}





















