/**
 * Re-export domain types for this page
 * Kept for backward compatibility with existing imports
 */
export type {
    AnimeDetailClientProps,
    AnimeDetailData,
    CastMember,
    DatabaseAnime,
    Episode,
    SimilarResult,
    VideoResult,
} from "@/shared/types/domain/anime";

// Re-export Character type from central location
export type { Character as CharacterData } from "@/shared/types/helpers";
