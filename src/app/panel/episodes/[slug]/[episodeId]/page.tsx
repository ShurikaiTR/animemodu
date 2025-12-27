import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { EditEpisodeForm } from "./EditEpisodeForm";
import type { EpisodeManagement } from "@/types/domain/anime";

interface PageProps {
    params: Promise<{ slug: string; episodeId: string }>;
}

interface AnimeInfo {
    id: string;
    title: string;
    slug: string;
}

interface EpisodeWithAnime extends EpisodeManagement {
    anime: AnimeInfo;
}

export default async function EditEpisodePage({ params }: PageProps) {
    const { slug, episodeId } = await params;
    const supabase = await createClient();

    // Fetch episode data
    const { data: rawEpisode, error } = await supabase
        .from("episodes")
        .select("*, anime:animes!inner(id, title, slug)")
        .eq("id", episodeId)
        .single();

    if (error || !rawEpisode) {
        notFound();
    }

    const episode = rawEpisode as unknown as EpisodeWithAnime;

    // Verify slug matches
    if (episode.anime.slug !== slug) {
        redirect(`/panel/episodes/${episode.anime.slug}/${episodeId}`);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-text-heading font-rubik">
                    Bölüm Düzenle
                </h1>
                <span className="text-white/50 text-sm">
                    {episode.anime.title} - S{episode.season_number} B{episode.episode_number}
                </span>
            </div>

            <EditEpisodeForm episode={episode} animeSlug={slug} />
        </div>
    );
}
