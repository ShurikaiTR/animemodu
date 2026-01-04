"use server";

import { revalidatePath } from "next/cache";

import { isAuthError,requireOwnerOrAdmin } from "@/shared/lib/auth/guards";
import { logError } from "@/shared/lib/errors";
import { createClient } from "@/shared/lib/supabase/server";
import { profileSchema } from "@/shared/lib/validations/profile";
import type { SocialMediaLinks } from "@/shared/types/helpers";

type ProfileResult =
    | { success: true; data: unknown }
    | { success: false; error: string };

/** Profile update için partial data tipi */
type ProfileUpdateData = Partial<{
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    banner_url: string | null;
    bio: string | null;
    location: string | null;
    social_media: SocialMediaLinks;
    age: string | null;
}>;

/**
 * Creates or updates a user profile
 */
export async function createOrUpdateProfile(userId: string, data?: unknown): Promise<ProfileResult> {
    const auth = await requireOwnerOrAdmin(userId);
    if (isAuthError(auth)) {
        return { success: false, error: auth.error };
    }

    // Validation
    const validation = profileSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message };
    }

    const validatedData = validation.data;
    const supabase = await createClient();

    const { data: rawProfile, error: checkError } = await supabase
        .from("profiles")
        .select("id, avatar_url")
        .eq("id", userId)
        .single();

    if (checkError && checkError.code !== "PGRST116") {
        logError("createOrUpdateProfile.checkProfile", checkError);
        return { success: false, error: checkError.message };
    }

    const existingProfile = rawProfile as { id: string; avatar_url: string | null } | null;

    if (!existingProfile) {
        const insertData = {
            id: userId,
            username: validatedData.username || null,
            full_name: validatedData.full_name || null,
            avatar_url: validatedData.avatar_url || "/default-avatar.webp",
            banner_url: validatedData.banner_url || null,
            bio: validatedData.bio || null,
            location: validatedData.location || null,
            social_media: validatedData.social_media || {},
            age: validatedData.age || null,
        };

        const { data: newProfile, error: insertError } = await (supabase
            .from("profiles") as ReturnType<typeof supabase.from>)
            .insert(insertData as Record<string, unknown>)
            .select()
            .single();

        if (insertError) {
            logError("createOrUpdateProfile.insertProfile", insertError);
            return { success: false, error: insertError.message };
        }

        revalidatePath("/profil");
        return { success: true, data: newProfile };
    }

    const updateData: ProfileUpdateData = {};

    if (validatedData.username !== undefined) updateData.username = validatedData.username;
    if (validatedData.full_name !== undefined) updateData.full_name = validatedData.full_name;
    if (validatedData.avatar_url !== undefined) updateData.avatar_url = validatedData.avatar_url;
    if (validatedData.banner_url !== undefined) updateData.banner_url = validatedData.banner_url;
    if (validatedData.bio !== undefined) updateData.bio = validatedData.bio;
    if (validatedData.location !== undefined) updateData.location = validatedData.location;
    if (validatedData.social_media !== undefined) {
        updateData.social_media = validatedData.social_media as SocialMediaLinks;
    }
    if (validatedData.age !== undefined) updateData.age = validatedData.age;

    if (updateData.avatar_url === null || updateData.avatar_url === "") {
        updateData.avatar_url = "/default-avatar.webp";
    }

    if (!existingProfile.avatar_url || existingProfile.avatar_url === "") {
        if (!updateData.avatar_url) {
            updateData.avatar_url = "/default-avatar.webp";
        }
    }

    if (Object.keys(updateData).length === 0) {
        return { success: true, data: existingProfile };
    }

    const { data: updatedProfile, error: updateError } = await (supabase
        .from("profiles") as ReturnType<typeof supabase.from>)
        .update(updateData as Record<string, unknown>)
        .eq("id", userId)
        .select()
        .single();

    if (updateError) {
        logError("createOrUpdateProfile.updateProfile", updateError);
        return { success: false, error: updateError.message };
    }

    revalidatePath("/profil");
    return { success: true, data: updatedProfile };
}

