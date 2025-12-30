export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      animes: {
        Row: {
          anilist_id: number | null
          backdrop_path: string | null
          characters: Json | null
          created_at: string
          genres: string[] | null
          id: string
          is_featured: boolean | null
          media_type: string | null
          original_title: string | null
          overview: string | null
          poster_path: string | null
          release_date: string | null
          slug: string
          structure_type: string | null
          title: string
          tmdb_id: number
          trailer_key: string | null
          updated_at: string
          vote_average: number | null
          vote_count: number | null
        }
        Insert: {
          anilist_id?: number | null
          backdrop_path?: string | null
          characters?: Json | null
          created_at?: string
          genres?: string[] | null
          id?: string
          is_featured?: boolean | null
          media_type?: string | null
          original_title?: string | null
          overview?: string | null
          poster_path?: string | null
          release_date?: string | null
          slug: string
          structure_type?: string | null
          title: string
          tmdb_id: number
          trailer_key?: string | null
          updated_at?: string
          vote_average?: number | null
          vote_count?: number | null
        }
        Update: {
          anilist_id?: number | null
          backdrop_path?: string | null
          characters?: Json | null
          created_at?: string
          genres?: string[] | null
          id?: string
          is_featured?: boolean | null
          media_type?: string | null
          original_title?: string | null
          overview?: string | null
          poster_path?: string | null
          release_date?: string | null
          slug?: string
          structure_type?: string | null
          title?: string
          tmdb_id?: number
          trailer_key?: string | null
          updated_at?: string
          vote_average?: number | null
          vote_count?: number | null
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          anime_id: string
          content: string
          created_at: string | null
          episode_id: string | null
          id: string
          is_pinned: boolean | null
          is_spoiler: boolean | null
          like_count: number | null
          parent_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          anime_id: string
          content: string
          created_at?: string | null
          episode_id?: string | null
          id?: string
          is_pinned?: boolean | null
          is_spoiler?: boolean | null
          like_count?: number | null
          parent_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          anime_id?: string
          content?: string
          created_at?: string | null
          episode_id?: string | null
          id?: string
          is_pinned?: boolean | null
          is_spoiler?: boolean | null
          like_count?: number | null
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes: {
        Row: {
          absolute_episode_number: number | null
          air_date: string | null
          anime_id: string
          created_at: string
          duration: number | null
          episode_number: number
          id: string
          overview: string | null
          season_number: number
          still_path: string | null
          tmdb_id: number | null
          updated_at: string
          video_url: string | null
          vote_average: number | null
        }
        Insert: {
          absolute_episode_number?: number | null
          air_date?: string | null
          anime_id: string
          created_at?: string
          duration?: number | null
          episode_number: number
          id?: string
          overview?: string | null
          season_number: number
          still_path?: string | null
          tmdb_id?: number | null
          updated_at?: string
          video_url?: string | null
          vote_average?: number | null
        }
        Update: {
          absolute_episode_number?: number | null
          air_date?: string | null
          anime_id?: string
          created_at?: string
          duration?: number | null
          episode_number?: number
          id?: string
          overview?: string | null
          season_number?: number
          still_path?: string | null
          tmdb_id?: number | null
          updated_at?: string
          video_url?: string | null
          vote_average?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "episodes_anime_id_fkey"
            columns: ["anime_id"]
            isOneToOne: false
            referencedRelation: "animes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: string | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          location: string | null
          role: string | null
          social_media: Json | null
          updated_at: string
          username: string | null
        }
        Insert: {
          age?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          location?: string | null
          role?: string | null
          social_media?: Json | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          age?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          role?: string | null
          social_media?: Json | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          anime_id: string
          anime_title: string
          created_at: string
          description: string | null
          episode_id: string | null
          episode_number: number | null
          id: string
          reason: string
          season_number: number | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          anime_id: string
          anime_title: string
          created_at?: string
          description?: string | null
          episode_id?: string | null
          episode_number?: number | null
          id?: string
          reason: string
          season_number?: number | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          anime_id?: string
          anime_title?: string
          created_at?: string
          description?: string | null
          episode_id?: string | null
          episode_number?: number | null
          id?: string
          reason?: string
          season_number?: number | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_anime_id_fkey"
            columns: ["anime_id"]
            isOneToOne: false
            referencedRelation: "animes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      review_likes: {
        Row: {
          created_at: string | null
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          anime_id: string
          content: string
          created_at: string | null
          helpful_count: number | null
          id: string
          is_spoiler: boolean | null
          is_verified_critic: boolean | null
          rating: number | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          anime_id: string
          content: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_spoiler?: boolean | null
          is_verified_critic?: boolean | null
          rating?: number | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          anime_id?: string
          content?: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_spoiler?: boolean | null
          is_verified_critic?: boolean | null
          rating?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          key: string
          label: string | null
          type: string | null
          updated_at: string | null
          value: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          label?: string | null
          type?: string | null
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          label?: string | null
          type?: string | null
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: string
          anime_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          anime_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          anime_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_anime_id_fkey"
            columns: ["anime_id"]
            isOneToOne: false
            referencedRelation: "animes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_anime_list: {
        Row: {
          anime_id: string
          created_at: string | null
          id: string
          score: number | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          anime_id: string
          created_at?: string | null
          id?: string
          score?: number | null
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          anime_id?: string
          created_at?: string | null
          id?: string
          score?: number | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          anime_id: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          anime_id: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          anime_id?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_episode_like_count: {
        Args: { p_anime_id: string; p_episode_number: number }
        Returns: number
      }
      get_episode_report_count: {
        Args: { p_anime_id: string; p_episode_number: number }
        Returns: number
      }
      get_episode_share_count: {
        Args: { p_anime_id: string; p_episode_number: number }
        Returns: number
      }
      get_episode_shares_by_platform: {
        Args: { p_anime_id: string; p_episode_number: number }
        Returns: {
          count: number
          platform: Database["public"]["Enums"]["share_platform"]
        }[]
      }
      get_most_shared_episodes: {
        Args: { p_limit?: number }
        Returns: {
          anime_id: string
          episode_number: number
          share_count: number
        }[]
      }
      get_setting_value: {
        Args: { p_category: string; p_default?: string; p_key: string }
        Returns: string
      }
      get_site_setting: { Args: { p_category: string }; Returns: Json }
      update_site_setting: {
        Args: { p_category: string; p_settings: Json; p_user_id: string }
        Returns: boolean
      }
      user_liked_episode: {
        Args: {
          p_anime_id: string
          p_episode_number: number
          p_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      CommentableType: "anime" | "episode" | "movie"
      MediaType: "tv" | "movie"
      share_platform: "x" | "whatsapp" | "telegram" | "discord" | "link_copy"
      user_role: "user" | "admin"
      xp_action_type:
        | "anime_complete"
        | "anime_rate"
        | "anime_comment"
        | "anime_favorite"
        | "discussion_create"
        | "discussion_comment"
        | "discussion_like"
        | "follow_user"
        | "followed_by_user"
        | "profile_complete"
        | "daily_login"
        | "streak_bonus"
        | "quest_complete"
        | "badge_earned"
        | "level_up"
        | "rank_up"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      CommentableType: ["anime", "episode", "movie"],
      MediaType: ["tv", "movie"],
      share_platform: ["x", "whatsapp", "telegram", "discord", "link_copy"],
      user_role: ["user", "admin"],
      xp_action_type: [
        "anime_complete",
        "anime_rate",
        "anime_comment",
        "anime_favorite",
        "discussion_create",
        "discussion_comment",
        "discussion_like",
        "follow_user",
        "followed_by_user",
        "profile_complete",
        "daily_login",
        "streak_bonus",
        "quest_complete",
        "badge_earned",
        "level_up",
        "rank_up",
      ],
    },
  },
} as const
