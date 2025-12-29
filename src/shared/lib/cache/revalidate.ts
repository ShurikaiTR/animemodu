import { revalidatePath } from "next/cache";

/**
 * Revalidates all anime-related cache paths
 * Use after adding, updating, or deleting anime content
 */
export function revalidateAnimeData(slug?: string) {
    // Revalidate common paths
    revalidatePath("/");
    revalidatePath("/arsiv");
    revalidatePath("/animeler");
    revalidatePath("/filmler");
    revalidatePath("/takvim");

    // Revalidate specific anime page if slug provided
    if (slug) {
        revalidatePath(`/anime/${slug}`);
    }
}

/**
 * Revalidates episode-related cache paths
 * Use after adding, updating, or deleting episodes
 */
export function revalidateEpisodeData(animeSlug?: string) {
    revalidatePath("/");
    revalidatePath("/arsiv");
    revalidatePath("/takvim");

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
 * Revalidates user profile page data
 * Use after watchlist, favorites, or other profile-related changes
 * @param username - Username for the profile path
 */
export function revalidateProfileData(username: string) {
    // Revalidate the specific profile page with layout
    revalidatePath(`/profil/${username}`, "layout");

    // Also revalidate with page type for good measure
    revalidatePath(`/profil/${username}`, "page");
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
