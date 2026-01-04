import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import EpisodeList from "@/features/anime/components/EpisodeList";
import { Badge } from "@/shared/components/badge";
import { getImageUrl } from "@/shared/lib/tmdb";
import type { EpisodeListItem } from "@/shared/types/domain/anime";

interface WatchSidebarProps {
    animeTitle: string;
    animeSlug: string;
    backdrop: string;
    episodes: EpisodeListItem[];
    currentEpisodeId: string;
    currentEpisodeNumber: number;
    currentSeasonNumber: number;
    structureType: "seasonal" | "absolute";
    animeId: string;
}


export default function WatchSidebar({
    animeTitle,
    animeSlug,
    backdrop,
    episodes,
    currentEpisodeId,
    currentEpisodeNumber,
    currentSeasonNumber,
    structureType,
    animeId
}: WatchSidebarProps) {
    return (
        <aside className="xl:block w-full" aria-label="Bölüm Navigasyonu">
            <div className="sticky top-24 space-y-6">
                <Link
                    href={`/anime/${animeSlug}`}
                    aria-label={`${animeTitle} anime detayına git`}
                    className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
                >
                    <div className="relative w-16 aspect-[2/3] shrink-0 rounded-lg overflow-hidden bg-black/20">
                        <Image
                            src={getImageUrl(backdrop, "w300")}
                            alt={`${animeTitle} posteri`}
                            fill
                            sizes="64px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Şu an İzleniyor</span>
                        <h2 className="text-white font-bold font-rubik text-base line-clamp-1 group-hover:text-primary transition-colors">
                            {animeTitle}
                        </h2>
                        <span className="text-xs text-white/50 mt-1">Anime Detayına Git &rarr;</span>
                    </div>
                </Link>

                <div className="bg-bg-secondary/20 rounded-xl border border-white/5 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <h2 className="font-bold text-white font-rubik flex items-center gap-2 text-sm">
                            <Play className="w-4 h-4 text-primary" />
                            Bölümler
                        </h2>
                        <Badge variant="outline" className="text-xs border-white/10 text-white/60">{episodes.length}</Badge>
                    </div>
                    <div
                        className="overflow-y-auto max-h-[37.5rem] custom-scrollbar p-3 outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
                        role="region"
                        aria-label="Bölüm listesi"
                        tabIndex={0}
                    >
                        <EpisodeList
                            episodes={episodes}
                            structureType={structureType}
                            animeId={animeId}
                            animeSlug={animeSlug}
                            layoutMode="list"
                            currentEpisodeId={currentEpisodeId}
                            currentEpisodeNumber={currentEpisodeNumber}
                            currentSeasonNumber={currentSeasonNumber}
                            hideHeader={true}
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
}
