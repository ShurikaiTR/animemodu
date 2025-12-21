import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EpisodeList from "@/components/anime/EpisodeList";
import { getImageUrl } from "@/lib/tmdb";
import type { EpisodeListItem } from "@/types/domain/anime";

interface WatchSidebarProps {
    animeTitle: string;
    animeSlug: string;
    backdrop: string;
    episodes: EpisodeListItem[];
    currentEpisodeId: string;
    currentEpisodeNumber: number;
    currentSeasonNumber: number;
    structureType: "seasonal" | "absolute";
    animeId: string | number;
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
        <div className="xl:block w-full">
            <div className="sticky top-24 space-y-6">
                <Link href={`/anime/${animeSlug}`} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                    <div className="relative w-16 aspect-[2/3] shrink-0 rounded-lg overflow-hidden bg-black/20">
                        <Image
                            src={getImageUrl(backdrop, "w300")}
                            alt={animeTitle}
                            fill
                            sizes="64px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                        <span className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Şu an İzleniyor</span>
                        <h3 className="text-white font-bold font-rubik line-clamp-1 group-hover:text-primary transition-colors">
                            {animeTitle}
                        </h3>
                        <span className="text-xs text-text-main/60 mt-1">Anime Detayına Git &rarr;</span>
                    </div>
                </Link>

                <div className="bg-bg-secondary/20 rounded-xl border border-white/5 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <h3 className="font-bold text-white font-rubik flex items-center gap-2">
                            <Play className="w-4 h-4 text-primary" />
                            Bölümler
                        </h3>
                        <Badge variant="outline" className="text-xs border-white/10 text-text-main/60">{episodes.length}</Badge>
                    </div>
                    <div className="overflow-y-auto max-h-[37.5rem] custom-scrollbar p-3">
                        <EpisodeList
                            episodes={episodes}
                            structureType={structureType}
                            animeId={typeof animeId === 'string' ? parseInt(animeId) : (animeId || 0)}
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
        </div>
    );
}
