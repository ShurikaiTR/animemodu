import { revalidatePath, updateTag, revalidateTag } from "next/cache";

/**
 * Revalidates all anime-related cache tags and paths
 * Use after adding, updating, or deleting anime content
 */
export function revalidateAnimeData(slug?: string) {
    // Update cache tags
    updateTag("animes");
    updateTag("featured-anime");
    updateTag("latest-episodes");
    updateTag("episodes");

    // Force revalidation with max stale time
    revalidateTag("animes", "max");
    revalidateTag("featured-anime", "max");
    revalidateTag("latest-episodes", "max");
    revalidateTag("episodes", "max");

    // Revalidate common paths
    revalidatePath("/");
    revalidatePath("/arsiv");
    revalidatePath("/animeler");
    revalidatePath("/filmler");

    // Revalidate specific anime page if slug provided
    if (slug) {
        revalidatePath(`/anime/${slug}`);
    }
}

/**
 * Revalidates episode-related cache tags and paths
 * Use after adding, updating, or deleting episodes
 */
export function revalidateEpisodeData(animeSlug?: string) {
    updateTag("episodes");
    updateTag("latest-episodes");

    revalidateTag("episodes", "max");
    revalidateTag("latest-episodes", "max");

    revalidatePath("/");
    revalidatePath("/arsiv");

    if (animeSlug) {
        revalidatePath(`/anime/${animeSlug}`);
        // Also revalidate watch page pattern
        revalidatePath(`/izle/${animeSlug}`);
    }
}

/**
 * Revalidates featured anime cache
 * Use when toggling featured status
 */
export function revalidateFeaturedAnime() {
    updateTag("featured-anime");
    revalidateTag("featured-anime", "max");
    revalidatePath("/");
}

/**
 * Revalidates user profile data
 * Use after profile updates
 */
export function revalidateUserData(userId?: string) {
    revalidatePath("/profil");

    if (userId) {
        // Could add user-specific paths if needed in the future
        revalidatePath("/profil");
    }
}

/**
 * Revalidates comments and reviews
 * Use after adding/updating/deleting comments or reviews
 * @param animeSlug 
 */
export function revalidateInteractionData(animeSlug?: string) {
    // Comments and reviews are typically fetched client-side,
    // but we can still revalidate the anime page
    if (animeSlug) {
        revalidatePath(`/anime/${animeSlug}`);
    }
}

/**
 * Full revalidation - use sparingly
 * This invalidates all cached data
 */
export function revalidateAll() {
    revalidateAnimeData();
    revalidateUserData();
}

