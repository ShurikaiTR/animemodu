import { createClient } from "@/shared/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { EditEpisodeForm } from "./EditEpisodeForm";
import type { EpisodeManagement } from "@/shared/types/domain/anime";

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

    const episode: EpisodeWithAnime = rawEpisode as EpisodeWithAnime;

    // Verify slug matches
    if (episode.anime.slug !== slug) {
        redirect(`/panel/episodes/${episode.anime.slug}/${episodeId}`);
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-white/5">
                <div>
                    <h1 className="font-rubik text-3xl font-bold tracking-tight text-white mb-2">
                        Bölüm Düzenle
                    </h1>
                    <p className="flex items-center gap-2 font-inter text-sm font-semibold text-primary">
                        İçerik: <span className="text-text-main/40 font-medium">
                            {episode.anime.title}
                            <span className="mx-2 text-white/5">•</span>
                            Sezon {episode.season_number}
                            <span className="mx-2 text-white/5">•</span>
                            Bölüm {episode.episode_number}
                        </span>
                    </p>
                </div>
                <div className="hidden md:block">
                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-accent-green/10 border border-accent-green/20 text-accent-green backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-green mr-2 animate-pulse" />
                        Yayında
                    </span>
                </div>
            </div>

            <EditEpisodeForm episode={episode} animeSlug={slug} />
        </div>
    );
}
