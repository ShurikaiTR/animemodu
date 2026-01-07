"use server";

import { createActivity } from "@/features/profile/actions/activities";
import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireUser } from "@/shared/lib/auth/guards";
import { revalidateProfileData } from "@/shared/lib/cache/revalidate";
import type { WatchStatus } from "@/shared/types/domain/watchlist";

import { FavoriteService } from "../services/favorite-service";
import { WatchListService } from "../services/watchlist-service";

/** Toggles favorite status for an anime */
export async function toggleFavorite(animeId: string) {
    const auth = await requireUser();
    if (isAuthError(auth)) return auth;

    return await safeAction(async () => {
        const result = await FavoriteService.toggleFavorite(auth.userId, animeId);

        // Track activity
        await createActivity(result.isFavorite ? "favorite_add" : "favorite_remove", animeId);

        if (auth.username) revalidateProfileData(auth.username);
        return { isFavorite: result.isFavorite };
    }, "toggleFavorite");
}

/** Check if an anime is in user's favorites */
export async function checkFavorite(animeId: string) {
    const auth = await requireUser();
    // Return standard error structure if auth fails, or allow it to fail? 
    // Consumers likely expect { success: false }/null. 
    // But safeAction forces standardized error.
    if (isAuthError(auth)) return { success: false, error: auth.error };

    return await safeAction(async () => {
        const isFavorite = await FavoriteService.checkFavorite(auth.userId, animeId);
        return { isFavorite };
    }, "checkFavorite");
}

/** Get user's favorite animes */
export async function getUserFavorites(userId: string) {
    const auth = await requireUser();
    if (isAuthError(auth)) return auth;

    return await safeAction(async () => {
        if (auth.userId !== userId) throw new Error("Bu listeye erişim yetkiniz yok");
        return await FavoriteService.getUserFavorites(userId);
    }, "getUserFavorites");
}

/** Fetches the complete watch list for the current authenticated user */
export async function getUserWatchList(userId: string) {
    const auth = await requireUser();
    if (isAuthError(auth)) return auth;

    return await safeAction(async () => {
        if (auth.userId !== userId) throw new Error("Bu listeye erişim yetkiniz yok");
        return await WatchListService.getUserWatchList(userId);
    }, "getUserWatchList");
}

/** Updates or creates a watch status for an anime */
export async function updateWatchStatus(animeId: string, status: WatchStatus | null) {
    const auth = await requireUser();
    if (isAuthError(auth)) return auth;

    return await safeAction(async () => {
        const result = await WatchListService.updateWatchStatus(auth.userId, animeId, status);

        // Track activity
        if (result.action === 'remove') {
            await createActivity("watchlist_remove", animeId);
        } else if (result.action === 'add') {
            await createActivity("watchlist_add", animeId, { status: status || undefined });
        } else {
            await createActivity("watchlist_update", animeId, {
                status: status || undefined,
                old_status: (result.oldStatus as string) || undefined
            });
        }

        if (auth.username) revalidateProfileData(auth.username);
    }, "updateWatchStatus");
}

/** Check the watch status of an anime for the current user */
export async function checkWatchStatus(animeId: string) {
    const auth = await requireUser();
    if (isAuthError(auth)) return { success: false, error: auth.error };

    return await safeAction(async () => {
        const status = await WatchListService.checkWatchStatus(auth.userId, animeId);
        return { status };
    }, "checkWatchStatus");
}
