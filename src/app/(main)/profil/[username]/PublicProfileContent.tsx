import { notFound } from "next/navigation";
import { connection } from "next/server";

import { getUserFavorites,getUserProfile, getUserWatchList } from "@/features/profile/actions";
import { getUserActivities } from "@/features/profile/actions/activities";
import ProfileLayout from "@/features/profile/components/ProfileLayout";
import type { Activity, FavoriteItem, WatchListItem } from "@/shared/types/helpers";

interface PublicProfileContentProps {
    username: string;
}

export default async function PublicProfileContent({ username }: PublicProfileContentProps) {
    // Force dynamic rendering - profil sayfası her zaman fresh data göstermeli
    await connection();

    const profileResult = await getUserProfile(username);

    if (!profileResult.success || !profileResult.data) {
        notFound();
    }
    const profile = profileResult.data;

    const [watchListResult, favoritesResult, activitiesResult] = await Promise.all([
        getUserWatchList(profile.id),
        getUserFavorites(profile.id),
        getUserActivities(profile.id)
    ]);

    const watchListItems: WatchListItem[] = (watchListResult.success && watchListResult.data) ? watchListResult.data : [];
    const favoriteItems: FavoriteItem[] = (favoritesResult.success && favoritesResult.data) ? favoritesResult.data : [];
    const activities: Activity[] = (activitiesResult.success && activitiesResult.data) ? activitiesResult.data : [];

    const user = {
        ...profile,
        email: "", // Public profilde email göstermiyoruz
        age: profile.age,
        role: profile.role || "user",
        joinDate: profile.joinDate,
    };

    return (
        <ProfileLayout
            user={user}
            watchListItems={watchListItems}
            favoriteItems={favoriteItems}
            activities={activities}
            isOwnProfile={false}
        />
    );
}
