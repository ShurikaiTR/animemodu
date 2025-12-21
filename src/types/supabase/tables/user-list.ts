export type WatchStatus = 'watching' | 'completed' | 'plan_to_watch' | 'on_hold' | 'dropped';

export interface UserAnimeListTable {
    Row: {
        id: string;
        user_id: string;
        anime_id: string | number;
        status: WatchStatus;
        score: number | null;
        created_at: string;
        updated_at: string;
    };
    Insert: {
        id?: string;
        user_id: string;
        anime_id: string | number;
        status: WatchStatus;
        score?: number | null;
        created_at?: string;
        updated_at?: string;
    };
    Update: {
        id?: string;
        user_id?: string;
        anime_id?: string | number;
        status?: WatchStatus;
        score?: number | null;
        created_at?: string;
        updated_at?: string;
    };
}
