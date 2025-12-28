import { createClient } from "@/shared/lib/supabase/server";
import { getUserProfileById } from "@/features/profile/actions/getProfile";
import { getUserWatchList } from "@/features/profile/actions/userList";
import { getUserFavorites } from "@/features/profile/actions/favorites";
import { redirect } from "next/navigation";
import Container from "@/shared/components/container";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import AnimatedProfileHeader from "@/features/profile/components/AnimatedProfileHeader";
import WatchListTabs from "@/features/profile/components/WatchListTabs";
import ProfileActivities from "@/features/profile/components/ProfileActivities";
import type { WatchListItem, FavoriteItem } from "@/shared/types/helpers";

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

    const [profile, watchListResult, favoritesResult] = await Promise.all([
        getUserProfileById(authUser.id),
        getUserWatchList(authUser.id),
        getUserFavorites(authUser.id)
    ]);

    if (!profile) {
        redirect("/");
    }

    const watchListItems: WatchListItem[] = watchListResult.success ? watchListResult.data : [];
    const favoriteItems: FavoriteItem[] = favoritesResult.success ? favoritesResult.data : [];

    const user = {
        ...profile,
        email: authUser.email || "",
        age: profile.age,
        role: profile.role || "user",
        joinDate: new Date(authUser.created_at).toLocaleDateString("tr-TR", { month: "long", year: "numeric" }),
    };

    return (
        <div className="bg-bg-main min-h-screen pb-20">
            <AnimatedProfileHeader>
                <ProfileHeader user={user} />
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
