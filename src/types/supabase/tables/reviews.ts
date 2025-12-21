export interface ReviewsTable {
    Row: {
        id: number
        user_id: string
        anime_id: number
        title: string | null
        rating: number | null
        content: string
        is_spoiler: boolean
        is_verified_critic: boolean
        helpful_count: number
        created_at: string
        updated_at: string
    }
    Insert: {
        id?: number
        user_id: string
        anime_id: number
        title?: string | null
        rating?: number | null
        content: string
        is_spoiler?: boolean
        is_verified_critic?: boolean
        helpful_count?: number
        created_at?: string
        updated_at?: string
    }
    Update: {
        id?: number
        user_id?: string
        anime_id?: number
        title?: string | null
        rating?: number | null
        content?: string
        is_spoiler?: boolean
        is_verified_critic?: boolean
        helpful_count?: number
        created_at?: string
        updated_at?: string
    }
    Relationships: [
        {
            foreignKeyName: "reviews_anime_id_fkey"
            columns: ["anime_id"]
            referencedRelation: "animes"
            referencedColumns: ["id"]
        },
        {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
        }
    ]
}


















