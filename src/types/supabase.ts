
import type {
    AnimesTable,
    EpisodesTable,
    ProfilesTable,
    ReviewsTable,
    CommentsTable,
    CommentLikesTable,
    ReviewLikesTable,
    UserAnimeListTable,
    UserFavoritesTable,
    SiteSettingsTable
} from "./supabase/tables";

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            animes: AnimesTable;
            episodes: EpisodesTable;
            profiles: ProfilesTable;
            reviews: ReviewsTable;
            comments: CommentsTable;
            comment_likes: CommentLikesTable;
            review_likes: ReviewLikesTable;
            user_anime_list: UserAnimeListTable;
            user_favorites: UserFavoritesTable;
            site_settings: SiteSettingsTable;
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}
