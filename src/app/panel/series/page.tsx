import { createClient } from "@/lib/supabase/server";
import SeriesClient from "./SeriesClient";
import type { AnimeRow } from "../types";

export const metadata = {
    title: "Diziler - Admin Panel",
    description: "İçerik kataloğunu yönetin",
};

export default async function CatalogPage() {
    const supabase = await createClient();

    const { data } = await supabase
        .from("animes")
        .select("*")
        .eq("media_type", "tv")
        .order("created_at", { ascending: false });

    const animes: AnimeRow[] = data || [];

    return <SeriesClient initialAnimes={animes} />;
}
