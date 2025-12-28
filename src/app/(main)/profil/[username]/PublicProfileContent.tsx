import { notFound } from "next/navigation";
import { getUserProfile } from "@/features/profile/actions/getProfile";
import { getUserWatchList } from "@/features/profile/actions/userList";
import { getUserFavorites } from "@/features/profile/actions/favorites";
import ProfileLayout from "@/features/profile/components/ProfileLayout";
import type { WatchListItem, FavoriteItem } from "@/shared/types/helpers";

interface PublicProfileContentProps {
    username: string;
}

export default async function PublicProfileContent({ username }: PublicProfileContentProps) {
    const profile = await getUserProfile(username);

    if (!profile) {
        notFound();
    }

    const [watchListResult, favoritesResult] = await Promise.all([
        getUserWatchList(profile.id),
        getUserFavorites(profile.id)
    ]);

    const watchListItems: WatchListItem[] = watchListResult.success ? watchListResult.data : [];
    const favoriteItems: FavoriteItem[] = favoritesResult.success ? favoritesResult.data : [];

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
            isOwnProfile={false}
        />
    );
}
