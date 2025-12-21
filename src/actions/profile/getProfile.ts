"use server";

import { createPublicClient } from "@/lib/supabase/server";
import { cacheLife, cacheTag } from "next/cache";
import type { SocialMediaLinks, ProfileRow } from "@/types/helpers";

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
 * Public data - auth gerektirmez, cache kullanır
 */
export async function getUserProfile(username: string) {
    "use cache";
    cacheLife("minutes");
    cacheTag(`profile-${username}`);

    const supabase = createPublicClient();

    const { data: rawProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

    if (error || !rawProfile) {
        return null;
    }

    return transformProfile(rawProfile as unknown as ProfileRow);
}

/**
 * Kullanıcı profil bilgilerini userId ile getirir
 * Public data - auth gerektirmez, cache kullanır
 */
export async function getUserProfileById(userId: string) {
    "use cache";
    cacheLife("minutes");
    cacheTag(`profile-id-${userId}`);

    const supabase = createPublicClient();

    const { data: rawProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error || !rawProfile) {
        return null;
    }

    return transformProfile(rawProfile as unknown as ProfileRow);
}




