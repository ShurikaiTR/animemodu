import { notFound } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { getUserProfile } from "@/features/profile/actions/getProfile";
import { getUserWatchList } from "@/features/profile/actions/userList";
import { getUserFavorites } from "@/features/profile/actions/favorites";
import { getUserActivities } from "@/features/profile/actions/activities";
import { getFollowStatus, getFollowCounts } from "@/features/profile/actions/followQueries";
import ProfileLayout from "@/features/profile/components/ProfileLayout";
import type { WatchListItem, FavoriteItem, Activity } from "@/shared/types/helpers";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
    // Ensure dynamic rendering
    await connection();

    const { username } = await params;
    const profile = await getUserProfile(username);

    if (!profile) {
        notFound();
    }

    // Mevcut kullanıcıyı kontrol et (takip durumu için)
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const isOwnProfile = authUser?.id === profile.id;

    const [watchListResult, favoritesResult, activitiesResult, followCountsResult, followStatusResult] = await Promise.all([
        getUserWatchList(profile.id),
        getUserFavorites(profile.id),
        getUserActivities(profile.id),
        getFollowCounts(profile.id),
        isOwnProfile ? Promise.resolve({ success: true, isFollowing: false }) : getFollowStatus(profile.id),
    ]);

    const watchListItems: WatchListItem[] = watchListResult.success ? watchListResult.data : [];
    const favoriteItems: FavoriteItem[] = favoritesResult.success ? favoritesResult.data : [];
    const activities: Activity[] = activitiesResult.success ? activitiesResult.data : [];
    const followCounts = followCountsResult.success ? followCountsResult.data : { followers: 0, following: 0 };
    const isFollowing = followStatusResult.success ? followStatusResult.isFollowing : false;

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
