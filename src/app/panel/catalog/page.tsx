import { createClient } from "@/lib/supabase/server";
import CatalogClient from "./CatalogClient";
import type { AnimeRow } from "../types";

export const metadata = {
    title: "Katalog - Admin Panel",
    description: "İçerik kataloğunu yönetin",
};

export default async function CatalogPage() {
    const supabase = await createClient();

    const { data } = await supabase
        .from("animes")
        .select("*")
        .order("created_at", { ascending: false });

    const animes: AnimeRow[] = data || [];

    return <CatalogClient initialAnimes={animes} />;
}
