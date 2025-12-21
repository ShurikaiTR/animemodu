export type InteractionType = "comment" | "review";

export interface InteractionItem {
    id: number;
    type: InteractionType;
    content: string;
    user: {
        username: string | null;
        avatar_url: string | null;
        role?: "user" | "admin";
    } | null;
    anime: {
        id: number;
        title: string;
        slug: string;
    } | null;
    created_at: string;
    is_spoiler: boolean;
    rating?: number | null;
    likes_count?: number;
}


