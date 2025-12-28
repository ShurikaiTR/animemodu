import { notFound } from "next/navigation";
import { getUserProfile } from "@/features/profile/actions/getProfile";
import { getUserWatchList } from "@/features/profile/actions/userList";
import { getUserFavorites } from "@/features/profile/actions/favorites";
import Container from "@/shared/components/container";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import AnimatedProfileHeader from "@/features/profile/components/AnimatedProfileHeader";
import WatchListTabs from "@/features/profile/components/WatchListTabs";
import ProfileActivities from "@/features/profile/components/ProfileActivities";
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
        <div className="bg-bg-main min-h-screen pb-20">
            <AnimatedProfileHeader>
                <ProfileHeader user={user} isOwnProfile={false} />
            </AnimatedProfileHeader>

            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                    <div className="lg:col-span-8 xl:col-span-9">
                        <div>
                            <h2 className="text-2xl font-bold text-white font-rubik mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full" />
                                Kütüphane
                            </h2>
                            <WatchListTabs initialItems={watchListItems} favorites={favoriteItems} />
                        </div>
                    </div>

                    <div className="lg:col-span-4 xl:col-span-3">
                        <ProfileActivities />
                    </div>
                </div>
            </Container>
        </div>
    );
}
