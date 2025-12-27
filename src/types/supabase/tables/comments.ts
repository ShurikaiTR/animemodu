export interface CommentsTable {
    Row: {
        id: string
        user_id: string
        anime_id: string
        episode_id: string | null
        parent_id: string | null
        content: string
        is_spoiler: boolean
        is_pinned: boolean
        like_count: number
        created_at: string
        updated_at: string
    }
    Insert: {
        id?: string
        user_id: string
        anime_id: string
        episode_id?: string | null
        parent_id?: string | null
        content: string
        is_spoiler?: boolean
        is_pinned?: boolean
        like_count?: number
        created_at?: string
        updated_at?: string
    }
    Update: {
        id?: string
        user_id?: string
        anime_id?: string
        episode_id?: string | null
        parent_id?: string | null
        content?: string
        is_spoiler?: boolean
        is_pinned?: boolean
        like_count?: number
        created_at?: string
        updated_at?: string
    }
    Relationships: [
        {
            foreignKeyName: "comments_anime_id_fkey"
            columns: ["anime_id"]
            referencedRelation: "animes"
            referencedColumns: ["id"]
        },
        {
            foreignKeyName: "comments_episode_id_fkey"
            columns: ["episode_id"]
            referencedRelation: "episodes"
            referencedColumns: ["id"]
        },
        {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "comments"
            referencedColumns: ["id"]
        },
        {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
        }
    ]
}




















