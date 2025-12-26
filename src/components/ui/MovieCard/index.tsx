import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Play, X } from "lucide-react";
import WatchStatusDropdown from "../WatchStatusDropdown";
import type { WatchStatus } from "../WatchStatusDropdown/config";
import { RatingBadge } from "./RatingBadge";

interface MovieCardProps {
    id?: string;
    title: string;
    year: number;
    genres?: string[] | null;
    rating: number;
    image: string;
    slug?: string;
    className?: string;
    /** Anime'nin mevcut izleme durumu */
    initialStatus?: WatchStatus;
    /** True ise WatchStatusDropdown gizlenir */
    hideWatchButton?: boolean;
    /** Listeden kaldırma callback'i - varsa X butonu gösterilir */
    onRemove?: () => void;
}

export default function MovieCard({
    id,
    title,
    year,
    genres,
    rating,
    image,
    slug,
    className,
    initialStatus,
    hideWatchButton = false,
    onRemove
}: MovieCardProps) {
    const href = slug ? `/anime/${slug}` : `/anime/${title.toLowerCase().replace(/ /g, "-")}`;

    return (
        <div className={cn("group relative w-full aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer", className)}>

            {/* Kaldır butonu - sol üst */}
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="absolute top-3 left-3 z-30 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 backdrop-blur-sm border border-red-400/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                    aria-label="Listeden kaldır"
                >
                    <X className="w-4 h-4 text-white" />
                </button>
            )}

            {/* Yıl badge - sol üst (kaldır butonu yoksa) */}
            {!onRemove && (
                <div className="absolute top-3 left-3 z-20 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
                    <span className="text-xs font-bold text-white">{year}</span>
                </div>
            )}

            <Link href={href} className="block w-full h-full relative">

                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]" />

                <RatingBadge rating={rating} />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                    <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/50 flex items-center justify-center shadow-[0_0_30px_rgba(47,128,237,0.4)] group-hover:scale-100 scale-50 transition-transform duration-500">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg text-white">
                            <Play className="w-5 h-5 ml-1 fill-current" />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">

                    <h3
                        title={title}
                        className="text-lg font-bold text-white font-rubik leading-tight mb-2 line-clamp-2 drop-shadow-lg group-hover:!text-primary transition-colors duration-300"
                    >
                        {title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-white/70 font-medium">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {genres && genres.length > 0 ? (
                                <>
                                    {genres.slice(0, 2).map((g, i) => (
                                        <span key={i} className="text-primary font-semibold">
                                            {g}{i < Math.min(genres.length, 2) - 1 ? "," : ""}
                                        </span>
                                    ))}
                                    {genres.length > 2 && (
                                        <span className="text-primary font-semibold">+{genres.length - 2}</span>
                                    )}
                                </>
                            ) : (
                                <span className="text-primary font-semibold">Anime</span>
                            )}
                        </div>

                        {!hideWatchButton && id && (
                            <div className="backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 -mr-2">
                                <WatchStatusDropdown animeId={id} initialStatus={initialStatus} variant="card" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-2xl transition-colors duration-500 pointer-events-none" />

            </Link>
        </div>
    );
}

