import Container from "@/shared/components/container";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import AnimatedProfileHeader from "@/features/profile/components/AnimatedProfileHeader";
import WatchListTabs from "@/features/profile/components/WatchListTabs";
import ProfileActivities from "@/features/profile/components/ProfileActivities";
import type { WatchListItem, FavoriteItem, ProfileRow } from "@/shared/types/helpers";

export interface ProfileUser extends ProfileRow {
    email: string;
    joinDate?: string;
    age: string | null;
    followers?: string;
    following?: string;
    avatar?: string;
}

interface ProfileLayoutProps {
    user: ProfileUser;
    watchListItems: WatchListItem[];
    favoriteItems: FavoriteItem[];
    isOwnProfile?: boolean;
}

export default function ProfileLayout({
    user,
    watchListItems,
    favoriteItems,
    isOwnProfile = true,
}: ProfileLayoutProps) {
    return (
        <div className="bg-bg-main min-h-screen pb-20">
            <AnimatedProfileHeader>
                <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
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
