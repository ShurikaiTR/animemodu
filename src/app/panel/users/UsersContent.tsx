import { createClient } from "@/shared/lib/supabase/server";
import { UsersTable } from "@/components/panel/tables/UsersTable";
import type { UserItem } from "@/components/panel/tables/UsersTable";
import { handleSupabaseError } from "@/shared/lib/panel/utils";

export async function UsersContent() {
    const supabase = await createClient();

    const result = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true });

    const profiles = handleSupabaseError(result, "Kullanıcılar yüklenirken hata oluştu");

    type ProfileData = { id: string; username: string | null; full_name: string | null; avatar_url: string | null; role: string; created_at: string };
    const items: UserItem[] = (profiles as ProfileData[]).map((p) => ({
        id: p.id,
        username: p.username,
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        role: p.role as "user" | "admin",
        created_at: p.created_at,
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-white/5">
                <div>
                    <h2 className="text-3xl font-rubik font-bold text-white mb-1">Kullanıcılar</h2>
                    <p className="text-text-main/60 text-sm">
                        Tüm kayıtlı kullanıcıları buradan görüntüleyebilir ve yönetebilirsin.
                    </p>
                </div>
            </div>

            <UsersTable items={items} />
        </div>
    );
}
