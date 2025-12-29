"use server";

import { createPublicClient } from "@/shared/lib/supabase/server";
import type { SocialMediaLinks, ProfileRow } from "@/shared/types/helpers";

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

    return {
        ...profile,
        joinDate,
        initials,
        followers: "0",
        following: "0",
        socials: (profile.social_media as SocialMediaLinks) || {}
    };
}

/**
 * Kullanıcı profil bilgilerini username ile getirir
 * Public data - auth gerektirmez
 */
export async function getUserProfile(username: string) {
    const supabase = createPublicClient();

    const { data: rawProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

    if (error || !rawProfile) {
        return null;
    }

    return transformProfile(rawProfile as ProfileRow);
}

/**
 * Kullanıcı profil bilgilerini userId ile getirir
 * Public data - auth gerektirmez
 */
export async function getUserProfileById(userId: string) {
    const supabase = createPublicClient();

    const { data: rawProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error || !rawProfile) {
        return null;
    }

    return transformProfile(rawProfile as ProfileRow);
}
