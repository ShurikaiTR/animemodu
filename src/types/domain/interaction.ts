/**
 * Domain types for user interaction entities
 * These are the canonical types used throughout the application
 */

// Re-export database row types for convenience
export type { CommentRow, ReviewRow, ProfileRow } from "../helpers";

/**
 * Comment type for frontend display (transformed from database)
 */
export interface Comment {
    id: number;
    author: string;
    username: string;
    role: string;
    avatarUrl: string | null;
    avatarColor: string;
    timeAgo: string;
    content: string;
    likes: number;
    isPinned: boolean;
    isSpoiler: boolean;
    replies: Reply[];
}

/**
 * Reply type (child comment)
 */
export interface Reply {
    id: number;
    author: string;
    username: string;
    role: string;
    avatarUrl: string | null;
    avatarColor: string;
    timeAgo: string;
    content: string;
    likes: number;
    isSpoiler: boolean;
}

/**
 * Review type for frontend display
 */
export interface Review {
    id: number;
    author: string;
    role: string;
    avatarUrl: string | null;
    avatarColor: string;
    timeAgo: string;
    title: string;
    content: string;
    rating: number;
    helpfulCount: number;
    isVerified: boolean;
}

/**
 * User profile for display
 */
export interface UserProfile {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: "admin" | "user";
    created_at: string;
}






