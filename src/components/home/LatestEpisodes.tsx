"use client";

import Container from "@/components/ui/container";
import EpisodeCard from "@/components/ui/EpisodeCard";
import { getImageUrl } from "@/lib/tmdb";
import { getWatchUrl } from "@/lib/utils";

interface EpisodeItem {
    id: string;
    episode_number: number;
    season_number: number;
    absolute_episode_number: number | null;
    still_path: string | null;
    created_at: string;
    anime: {
        title: string;
        slug: string;
        poster_path: string | null;
        structure_type: "seasonal" | "absolute";
    };
}

function getTimeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Az önce";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}dk önce`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
    return `${Math.floor(diffInSeconds / 86400)} gün önce`;
}

export default function LatestEpisodes({ episodes }: { episodes: EpisodeItem[] }) {
    if (!episodes || episodes.length === 0) return null;

    return (
        <section className="pb-10 pt-4 first:pt-28">
            <Container>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold font-rubik text-white drop-shadow-md border-l-4 border-primary pl-4">
                        Son Eklenen Bölümler
                    </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
                    {episodes.map((ep) => {
                        const isSeasonal = ep.anime.structure_type === "seasonal";
                        const epNumberText = isSeasonal
                            ? `Sezon ${ep.season_number} Bölüm ${ep.episode_number}`
                            : `${ep.absolute_episode_number || ep.episode_number}. Bölüm`;

                        const imagePath = ep.still_path || ep.anime.poster_path;

                        // Absolute modda: episode_number = absolute, season = 1
                        const watchEpNum = isSeasonal ? ep.episode_number : (ep.absolute_episode_number || ep.episode_number);
                        const watchSeasonNum = isSeasonal ? ep.season_number : 1;

                        return (
                            <EpisodeCard
                                key={ep.id}
                                title={ep.anime.title}
                                episodeNumber={epNumberText}
                                image={getImageUrl(imagePath, "w500")}
                                timeAgo={getTimeAgo(ep.created_at)}
                                href={getWatchUrl(ep.anime.slug, watchEpNum, watchSeasonNum, ep.anime.structure_type)}
                            />
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
