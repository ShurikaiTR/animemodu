import { redirect } from "next/navigation";

import { getProfile, getUserFavorites,getUserWatchList } from "@/features/profile/actions";
import { getUserActivities } from "@/features/profile/actions/activities";
import { getFollowCounts } from "@/features/profile/actions/follow-actions";
import { createClient } from "@/shared/lib/supabase/server";
import type { Activity, FavoriteItem, WatchListItem } from "@/shared/types/helpers";

import ProfileLayout from "./ProfileLayout";

/**
 * Profil içeriğini dinamik olarak çeken ve render eden Server Component.
 * cookies() kullanımı içerdiği için Suspense sınırı içinde olmalıdır.
 */
export default async function ProfileContent() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        redirect("/?login=true");
    }

    const [profileResult, watchListResult, favoritesResult, activitiesResult, followCountsResult] = await Promise.all([
        getProfile(authUser.id),
        getUserWatchList(authUser.id),
        getUserFavorites(authUser.id),
        getUserActivities(authUser.id),
        getFollowCounts(authUser.id),
    ]);

    if (!profileResult.success || !profileResult.data) {
        redirect("/");
    }
    const profile = profileResult.data;

    const watchListItems: WatchListItem[] = (watchListResult.success && watchListResult.data) ? watchListResult.data : [];
    const favoriteItems: FavoriteItem[] = (favoritesResult.success && favoritesResult.data) ? favoritesResult.data : [];
    const activities: Activity[] = (activitiesResult.success && activitiesResult.data) ? activitiesResult.data : [];
    const followCounts = (followCountsResult.success && followCountsResult.data) ? followCountsResult.data : { followers: 0, following: 0 };

    const user = {
        ...profile,
        email: authUser.email || "",
        age: profile.age,
        role: profile.role || "user",
        joinDate: new Date(authUser.created_at).toLocaleDateString("tr-TR", { month: "long", year: "numeric" }),
        followers: String(followCounts.followers),
        following: String(followCounts.following),
    };

    return (
        <ProfileLayout
            user={user}
            watchListItems={watchListItems}
            favoriteItems={favoriteItems}
            activities={activities}
            isOwnProfile={true}
        />
    );
}
