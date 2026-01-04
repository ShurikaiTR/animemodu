"use server";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { userIdSchema } from "@/shared/lib/validations/user";
import type { ProfileRow, SocialMediaLinks } from "@/shared/types/helpers";

import { ProfileService } from "../services/profile-service";

/** Profil veri transformasyonu */
function transformProfile(profile: ProfileRow) {
    const date = new Date(profile.created_at);
    const joinDate = date.toLocaleDateString("tr-TR", {
        month: "long",
        year: "numeric"
    });

    const initials = profile.username
        ? profile.username.slice(0, 2).toUpperCase()
        : "??";

    if (!profile.avatar_url || profile.avatar_url === "") {
        profile.avatar_url = "/default-avatar.webp";
    }

    return {
        ...profile,
        joinDate,
        initials,
        socials: (profile.social_media as unknown as SocialMediaLinks) || {}
    };
}

/**
 * Retrieves a user profile by userId
 */
export async function getProfile(userId: string) {
    return await safeAction(async () => {
        const validation = userIdSchema.safeParse(userId);
        if (!validation.success) throw new Error("Geçersiz kullanıcı ID");

        const profile = await ProfileService.getProfileById(userId);
        if (!profile) throw new Error("Profil bulunamadı.");

        return transformProfile(profile);
    }, "getProfile");
}

/**
 * Retrieves a user profile by username
 */
export async function getUserProfile(username: string) {
    return await safeAction(async () => {
        if (!username) throw new Error("Kullanıcı adı gerekli");

        const profile = await ProfileService.getProfileByUsername(username);
        if (!profile) throw new Error("Profil bulunamadı.");

        return transformProfile(profile);
    }, "getUserProfile");
}
