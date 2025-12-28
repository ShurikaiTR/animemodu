import { createClient } from "@/shared/lib/supabase/server";
import EpisodesClient from "./EpisodesClient";
import type { EpisodeWithAnime } from "@/components/panel/tables/EpisodesTable/EpisodesTableRow";

export const metadata = {
    title: "Bölümler - Admin Panel",
    description: "Tüm bölümleri yönetin",
};

interface EpisodesPageProps {
    searchParams?: Promise<{
        page?: string;
    }>;
}

export default async function EpisodesPage({ searchParams }: EpisodesPageProps) {
    const supabase = await createClient();
    const params = await searchParams;
    const currentPage = Number(params?.page) || 1;
    const itemsPerPage = 20;
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    // Fetch data with count
    const { data, count } = await supabase
        .from("episodes")
        .select(`
            *,
            animes (
                id,
                title,
                slug,
                poster_path,
                structure_type
            )
        `, { count: "exact" })
        .order("created_at", { ascending: false })
        .order("season_number", { ascending: false })
        .order("episode_number", { ascending: false })
        .range(from, to);

    const episodes: EpisodeWithAnime[] = (data || []) as EpisodeWithAnime[];
    const totalItems = count || 0;

    return (
        <EpisodesClient
            initialEpisodes={episodes}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
        />
    );
}
