type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface ProfilesTable {
    Row: {
        id: string
        username: string | null
        full_name: string | null
        avatar_url: string | null
        role: "user" | "admin"
        created_at: string
        updated_at: string
        bio: string | null
        location: string | null
        banner_url: string | null
        social_media: Json
        age: string | null
    }
    Insert: {
        id: string
        username?: string | null
        full_name?: string | null
        avatar_url?: string | null
        role?: "user" | "admin"
        created_at?: string
        updated_at?: string
        bio?: string | null
        location?: string | null
        banner_url?: string | null
        social_media?: Json
        age?: string | null
    }
    Update: {
        id?: string
        username?: string | null
        full_name?: string | null
        avatar_url?: string | null
        role?: "user" | "admin"
        created_at?: string
        updated_at?: string
        bio?: string | null
        location?: string | null
        banner_url?: string | null
        social_media?: Json
        age?: string | null
    }
    Relationships: [
        {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
        }
    ]
}


















