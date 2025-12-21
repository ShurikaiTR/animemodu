export interface UserItem {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: "user" | "admin";
    created_at: string;
}

