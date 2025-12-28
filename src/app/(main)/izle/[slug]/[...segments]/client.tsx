"use client";

import { useState } from "react";
import Container from "@/shared/components/container";
import VideoPlayer from "@/features/anime/components/VideoPlayer";
import FakeVideoPlayer from "@/features/anime/components/FakeVideoPlayer";
import CommentsSection from "@/features/anime/components/CommentsSection";
import WatchHero from "./WatchHero";

import WatchSidebar from "./WatchSidebar";
import type { Episode } from "@/app/(main)/anime/[slug]/types";
import { getImageUrl } from "@/shared/lib/tmdb";
import WatchControls from "./WatchControls";
import { toast } from "sonner";
import ReportModal from "@/features/anime/components/ReportModal";

interface WatchClientProps {
    episode: Episode;
    anime: {
        id: string;
        title: string;
        slug: string;
        backdrop_path: string | null;
        poster_path: string | null;
        structure_type: "seasonal" | "absolute";
    };
    episodes: Episode[];
}

export default function WatchClient({ episode, anime, episodes }: WatchClientProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const backdrop = episode.still_path || anime.backdrop_path || "";

    const currentIndex = episodes.findIndex(e => e.id === episode.id);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < episodes.length - 1;

    // Construct URL format: /izle/[slug]/[season]-[number]
    const getEpisodeUrl = (ep: Episode) => `/izle/${anime.slug}/${ep.season_number}-${ep.episode_number}`;

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link kopyalandı!");
    };

    const handleReport = () => {
        setIsReportModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-bg-main relative -mt-36 pt-36">

            <WatchHero backdrop={backdrop} />

            <Container className="relative z-20 pt-32 pb-16">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_22rem] gap-8 items-start">
                    <div className="flex flex-col gap-8 min-w-0">
                        <div className="flex flex-col gap-4">
                            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/10 relative z-10">
                                {isPlaying ? (
                                    <VideoPlayer
                                        src={episode.video_url}
                                        poster={getImageUrl(backdrop, "original")}
                                        animeTitle={anime.title}
                                        episodeTitle={`${episode.season_number}. Sezon ${episode.episode_number}. Bölüm`}
                                        logo={getImageUrl(anime.poster_path, "w500")}
                                    />
                                ) : (
                                    <FakeVideoPlayer
                                        poster={getImageUrl(backdrop, "original")}
                                        onClick={() => setIsPlaying(true)}
                                        animeTitle={anime.title}
                                        episodeTitle={`${episode.season_number}. Sezon ${episode.episode_number}. Bölüm`}
                                        logo={getImageUrl(anime.poster_path, "w500")}
                                    />
                                )}
                            </div>

                            <WatchControls
                                prevEpisodeUrl={hasPrev ? getEpisodeUrl(episodes[currentIndex - 1]) : null}
                                nextEpisodeUrl={hasNext ? getEpisodeUrl(episodes[currentIndex + 1]) : null}
                                onShare={handleShare}
                                onReport={handleReport}
                            />
                        </div>

                        <div>
                            <CommentsSection animeId={anime.id} episodeId={episode.id} />
                        </div>
                    </div>

                    <WatchSidebar
                        animeTitle={anime.title}
                        animeSlug={anime.slug}
                        backdrop={anime.poster_path || backdrop}
                        episodes={episodes.map(ep => ({
                            id: ep.id.toString(),
                            episode_number: ep.episode_number,
                            season_number: ep.season_number,
                            title: `${ep.season_number}. Sezon ${ep.episode_number}. Bölüm`,
                            overview: ep.overview || "",
                            still_path: ep.still_path,
                            air_date: ep.air_date || "",
                            vote_average: ep.vote_average || 0,
                        }))}
                        currentEpisodeId={episode.id.toString()}
                        currentEpisodeNumber={episode.episode_number}
                        currentSeasonNumber={episode.season_number}
                        structureType={anime.structure_type}
                        animeId={anime.id}
                    />
                </div>

            </Container>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                animeTitle={anime.title}
                episodeTitle={`${episode.season_number}. Sezon ${episode.episode_number}. Bölüm`}
                animeId={anime.id}
                seasonNumber={episode.season_number}
                episodeNumber={episode.episode_number}
            />
        </div>
    );
}
