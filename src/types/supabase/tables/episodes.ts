export interface EpisodesTable {
    Row: {
        id: number
        anime_id: number
        tmdb_id: number | null
        title: string | null
        overview: string | null
        still_path: string | null
        vote_average: number | null
        air_date: string | null
        season_number: number
        episode_number: number
        absolute_episode_number: number | null
        duration: number | null
        video_url: string | null
        created_at: string
    }
    Insert: {
        id?: number
        anime_id: number
        tmdb_id?: number | null
        title?: string | null
        overview?: string | null
        still_path?: string | null
        vote_average?: number | null
        air_date?: string | null
        season_number: number
        episode_number: number
        absolute_episode_number?: number | null
        duration?: number | null
        video_url?: string | null
        created_at?: string
    }
    Update: {
        id?: number
        anime_id?: number
        tmdb_id?: number | null
        title?: string | null
        overview?: string | null
        still_path?: string | null
        vote_average?: number | null
        air_date?: string | null
        season_number?: number
        episode_number?: number
        absolute_episode_number?: number | null
        duration?: number | null
        video_url?: string | null
        created_at?: string
    }
    Relationships: [
        {
            foreignKeyName: "episodes_anime_id_fkey"
            columns: ["anime_id"]
            referencedRelation: "animes"
            referencedColumns: ["id"]
        }
    ]
}













