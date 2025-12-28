
import Link from "next/link";
import Image from "next/image";
import { Clock, Bell, Play } from "lucide-react";
import { Button } from "@/shared/components/button";
import { getImageUrl } from "@/shared/lib/tmdb";

interface CalendarEpisode {
    id: number;
    episode_number: number;
    air_date: string | null;
    anime: {
        id: string;
        title: string;
        poster_path: string | null;
        backdrop_path: string | null;
        genres: string[] | null | undefined;
        slug: string;
    } | null;
}

interface CalendarEpisodeCardProps {
    episode: CalendarEpisode;
}

export default function CalendarEpisodeCard({ episode }: CalendarEpisodeCardProps) {
    const anime = episode.anime;
    if (!anime) return null;

    const imageUrl = getImageUrl(anime.backdrop_path || anime.poster_path, "w500");
    if (!episode.air_date) return null;
    const dateObj = new Date(episode.air_date);
    const timeStr = dateObj.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' });
    const isMidnight = timeStr === "00:00";

    return (
        <div className="group relative flex flex-col md:flex-row items-center gap-6 bg-bg-secondary/30 border border-white/5 rounded-2xl p-4 md:p-6 hover:bg-white/5 transition-all duration-300 hover:border-white/10">
            <div className="shrink-0 flex flex-col items-center justify-center w-full md:w-24 h-16 md:h-24 bg-white/5 rounded-xl border border-white/5">
                <Clock className="w-5 h-5 text-primary mb-1" />
                <span className="text-xl font-bold text-white font-rubik tracking-wide">
                    {isMidnight ? "??" : timeStr}
                </span>
            </div>

            <div className="w-full md:w-40 aspect-video md:aspect-[16/9] relative rounded-xl overflow-hidden shadow-lg shrink-0">
                <Image
                    src={imageUrl}
                    alt={anime.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
            </div>

            <div className="flex-1 text-center md:text-left w-full md:w-auto">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <span className="text-primary text-xs font-bold uppercase tracking-wider border border-primary/20 px-2 py-0.5 rounded-md bg-primary/10">
                        {anime.genres?.[0] || "Anime"}
                    </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {anime.title}
                </h3>
                <p className="text-white/50 text-sm">
                    {episode.episode_number}. Bölüm
                </p>
            </div>

            <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0 flex gap-3 justify-center md:justify-end">
                <Button variant="glass" size="icon" className="h-12 w-12 rounded-xl text-yellow-400 hover:text-white">
                    <Bell className="w-5 h-5" />
                </Button>
                <Link href={`/anime/${anime.slug || anime.id}`} className="flex-1 md:flex-none">
                    <Button className="w-full md:w-40 h-12 text-base font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform gap-2">
                        <Play className="w-5 h-5 fill-current" /> İzle
                    </Button>
                </Link>
            </div>

            <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
        </div>
    );
}










