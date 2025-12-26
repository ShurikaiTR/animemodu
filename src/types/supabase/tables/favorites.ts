export interface UserFavoritesTable {
    Row: {
        id: string;
        user_id: string;
        anime_id: string;
        created_at: string;
        updated_at: string;
    };
    Insert: {
        id?: string;
        user_id: string;
        anime_id: string;
        created_at?: string;
        updated_at?: string;
    };
    Update: {
        id?: string;
        user_id?: string;
        anime_id?: string;
        created_at?: string;
        updated_at?: string;
    };
}
