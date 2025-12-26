// Reports table types - standalone definition

export interface ReportsTable {
    Row: {
        id: number;
        anime_id: string;
        anime_title: string;
        episode_id: number | null;
        episode_number: number | null;
        season_number: number | null;
        user_id: string | null;
        reason: string;
        description: string | null;
        status: "pending" | "resolved" | "dismissed";
        created_at: string;
        updated_at: string;
    };
    Insert: {
        id?: number;
        anime_id: string;
        anime_title: string;
        episode_id?: number | null;
        episode_number?: number | null;
        season_number?: number | null;
        user_id?: string | null;
        reason: string;
        description?: string | null;
        status?: "pending" | "resolved" | "dismissed";
        created_at?: string;
        updated_at?: string;
    };
    Update: {
        id?: number;
        anime_id?: string;
        episode_id?: number | null;
        user_id?: string;
        reason?: string;
        description?: string | null;
        status?: "pending" | "resolved" | "dismissed";
        created_at?: string;
        updated_at?: string;
    };
    Relationships: [
        {
            foreignKeyName: "reports_anime_id_fkey";
            columns: ["anime_id"];
            referencedRelation: "animes";
            referencedColumns: ["id"];
        },
        {
            foreignKeyName: "reports_episode_id_fkey";
            columns: ["episode_id"];
            referencedRelation: "episodes";
            referencedColumns: ["id"];
        },
        {
            foreignKeyName: "reports_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
        }
    ];
}

export type ReportRow = ReportsTable["Row"];
export type ReportInsert = ReportsTable["Insert"];
export type ReportUpdate = ReportsTable["Update"];
