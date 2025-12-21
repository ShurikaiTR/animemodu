import { createClient } from "@/lib/supabase/server";
import { getUserProfileById } from "@/actions/profile/getProfile";
import { getUserWatchList } from "@/actions/profile/userList";
import { getUserFavorites } from "@/actions/profile/favorites";
import { redirect } from "next/navigation";
import Container from "@/components/ui/container";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AnimatedProfileHeader from "@/components/profile/AnimatedProfileHeader";
import WatchListTabs from "@/components/profile/WatchListTabs";
import ProfileActivities from "@/components/profile/ProfileActivities";
import type { WatchListItem, FavoriteItem } from "@/types/helpers";

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
