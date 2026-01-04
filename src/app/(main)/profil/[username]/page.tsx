import { notFound } from "next/navigation";
import { connection } from "next/server";

import { getUserProfile } from "@/features/profile/actions";
import { getUserActivities } from "@/features/profile/actions/activities";
import { getFollowCounts, getFollowStatus } from "@/features/profile/actions/follow-actions";
import { getUserWatchList } from "@/features/profile/actions/list-actions";
import { getUserFavorites } from "@/features/profile/actions/list-actions";
import ProfileLayout from "@/features/profile/components/ProfileLayout";
import { createClient } from "@/shared/lib/supabase/server";
import type { Activity, FavoriteItem, WatchListItem } from "@/shared/types/helpers";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
    // Ensure dynamic rendering
    await connection();

    const { username } = await params;
    const profileResult = await getUserProfile(username);

    if (!profileResult.success || !profileResult.data) {
        notFound();
    }
    const profile = profileResult.data;

    // Mevcut kullanıcıyı kontrol et (takip durumu için)
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const isOwnProfile = authUser?.id === profile.id;

    const [watchListResult, favoritesResult, activitiesResult, followCountsResult, followStatusResult] = await Promise.all([
        getUserWatchList(profile.id),
        getUserFavorites(profile.id),
        getUserActivities(profile.id),
        getFollowCounts(profile.id),
        isOwnProfile ? Promise.resolve({ success: true, data: { isFollowing: false } }) : getFollowStatus(profile.id),
    ]);

    const watchListItems: WatchListItem[] = (watchListResult.success && 'data' in watchListResult && watchListResult.data) ? watchListResult.data : [];
    const favoriteItems: FavoriteItem[] = (favoritesResult.success && 'data' in favoritesResult && favoritesResult.data) ? favoritesResult.data : [];
    const activities: Activity[] = (activitiesResult.success && 'data' in activitiesResult && activitiesResult.data) ? activitiesResult.data : [];
    const followCounts = (followCountsResult.success && 'data' in followCountsResult && followCountsResult.data) ? followCountsResult.data : { followers: 0, following: 0 };
    // TypeScript safe access
    const followStatusData = (followStatusResult.success && 'data' in followStatusResult) ? followStatusResult.data : undefined;
    const isFollowing = followStatusData ? followStatusData.isFollowing : false;

    const user = {
        ...profile,
        email: "", // Public profilde email göstermiyoruz
        age: profile.age,
        role: profile.role || "user",
        joinDate: profile.joinDate,
        followers: String(followCounts.followers),
        following: String(followCounts.following),
    };

    return (
        <ProfileLayout
            user={user}
            watchListItems={watchListItems}
            favoriteItems={favoriteItems}
            activities={activities}
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            targetUserId={profile.id}
        />
    );
}
