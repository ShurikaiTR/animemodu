/**
 * Re-export domain types for this page
 * Kept for backward compatibility with existing imports
 */
export type {
    Episode,
    CastMember,
    VideoResult,
    AnimeDetailData,
    AnimeDetailClientProps,
    DatabaseAnime,
    SimilarResult,
} from "@/types/domain/anime";

// Re-export Character type from central location
export type { Character as CharacterData } from "@/types/supabase/tables/characters";
