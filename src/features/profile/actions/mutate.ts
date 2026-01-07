"use server";

import { revalidatePath } from "next/cache";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireOwnerOrAdmin } from "@/shared/lib/auth/guards";
import { profileSchema } from "@/shared/lib/validations/profile";
import type { Json } from "@/shared/types/helpers";

import { ProfileService } from "../services/profile-service";

/** Profile update için partial data tipi */
type ProfileUpdateData = Partial<{
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    banner_url: string | null;
    bio: string | null;
    location: string | null;
    social_media: Json;
    age: string | null;
}>;


/**
 * Creates or updates a user profile
 */
export async function createOrUpdateProfile(userId: string, data?: unknown) {
    return await safeAction(async () => {
        const auth = await requireOwnerOrAdmin(userId);
        if (isAuthError(auth)) {
            throw new Error(auth.error);
        }

        // Validation
        const validation = profileSchema.safeParse(data);
        if (!validation.success) {
            throw new Error(validation.error.issues[0].message);
        }

        const validatedData = validation.data;
        const existingProfile = await ProfileService.getProfileById(userId);

        if (!existingProfile) {
            const insertData = {
                username: validatedData.username || null,
                full_name: validatedData.full_name || null,
                avatar_url: validatedData.avatar_url || "/default-avatar.webp",
                banner_url: validatedData.banner_url || null,
                bio: validatedData.bio || null,
                location: validatedData.location || null,
                social_media: validatedData.social_media || {},
                age: validatedData.age || null,
            };

            const newProfile = await ProfileService.upsertProfile(userId, insertData);
            revalidatePath("/profil");
            return newProfile;
        }

        const updateData: ProfileUpdateData = {};
        if (validatedData.username !== undefined) updateData.username = validatedData.username;
        if (validatedData.full_name !== undefined) updateData.full_name = validatedData.full_name;
        if (validatedData.avatar_url !== undefined) updateData.avatar_url = validatedData.avatar_url;
        if (validatedData.banner_url !== undefined) updateData.banner_url = validatedData.banner_url;
        if (validatedData.bio !== undefined) updateData.bio = validatedData.bio;
        if (validatedData.location !== undefined) updateData.location = validatedData.location;
        if (validatedData.social_media !== undefined) {
            updateData.social_media = validatedData.social_media as Json;
        }
        if (validatedData.age !== undefined) updateData.age = validatedData.age;

        if (updateData.avatar_url === null || updateData.avatar_url === "") {
            updateData.avatar_url = "/default-avatar.webp";
        }

        const updatedProfile = await ProfileService.upsertProfile(userId, updateData);

        revalidatePath("/profil");
        return updatedProfile;
    }, "createOrUpdateProfile");
}

