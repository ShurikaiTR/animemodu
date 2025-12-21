import { notFound } from "next/navigation";
import { getUserProfile } from "@/actions/profile/getProfile";
import { getUserWatchList } from "@/actions/profile/userList";
import { getUserFavorites } from "@/actions/profile/favorites";
import Container from "@/components/ui/container";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AnimatedProfileHeader from "@/components/profile/AnimatedProfileHeader";
import WatchListTabs from "@/components/profile/WatchListTabs";
import ProfileActivities from "@/components/profile/ProfileActivities";
import type { WatchListItem, FavoriteItem } from "@/types/helpers";

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
