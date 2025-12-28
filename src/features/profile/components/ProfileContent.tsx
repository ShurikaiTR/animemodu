import { createClient } from "@/shared/lib/supabase/server";
import { getUserProfileById } from "@/features/profile/actions/getProfile";
import { getUserWatchList } from "@/features/profile/actions/userList";
import { getUserFavorites } from "@/features/profile/actions/favorites";
import { redirect } from "next/navigation";
import ProfileLayout from "./ProfileLayout";
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
        <ProfileLayout
            user={user}
            watchListItems={watchListItems}
            favoriteItems={favoriteItems}
            isOwnProfile={true}
        />
    );
}
