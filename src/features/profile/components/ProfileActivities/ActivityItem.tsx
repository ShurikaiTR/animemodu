import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Play, Heart, Star, UserPlus, Plus, RefreshCw, Trash2, User } from "lucide-react";
import { getImageUrl } from "@/shared/lib/tmdb/utils";
import type { Activity, ActivityType } from "@/shared/types/helpers";

interface ActivityItemProps {
    activity: Activity;
    username: string;
    index: number;
}

/** Aktivite tipine göre ikon döndürür */
function getActivityIcon(type: ActivityType) {
    switch (type) {
        case "watchlist_add": return <Plus className="w-3 h-3 text-accent-green" />;
        case "watchlist_update": return <RefreshCw className="w-3 h-3 text-primary" />;
        case "watchlist_remove": return <Trash2 className="w-3 h-3 text-danger" />;
        case "favorite_add": return <Heart className="w-3 h-3 text-danger fill-danger" />;
        case "favorite_remove": return <Heart className="w-3 h-3 text-text-main/50" />;
        case "comment_add": return <MessageSquare className="w-3 h-3 text-primary" />;
        case "review_add": return <Star className="w-3 h-3 text-yellow-500" />;
        case "profile_update": return <User className="w-3 h-3 text-primary" />;
        default: return <Play className="w-3 h-3 text-primary" />;
    }
}

/** Aktivite tipine göre metin döndürür */
function getActivityText(activity: Activity): string {
    switch (activity.activity_type) {
        case "watchlist_add":
            return `"${activity.metadata?.status || 'izleme listesine'}" listesine ekledi:`;
        case "watchlist_update":
            return `durumu "${activity.metadata?.new_status}" olarak güncelledi:`;
        case "watchlist_remove":
            return "listesinden çıkardı:";
        case "favorite_add":
            return "favorilerine ekledi:";
        case "favorite_remove":
            return "favorilerinden çıkardı:";
        case "comment_add":
            return "yorum yaptı:";
        case "review_add":
            return "inceleme yazdı:";
        case "profile_update":
            return "profilini güncelledi";
        default:
            return "";
    }
}

/** Zaman damgasını formatlar */
function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Az önce";
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export default function ActivityItem({ activity, username, index }: ActivityItemProps) {
    const posterUrl = activity.anime?.poster_path
        ? getImageUrl(activity.anime.poster_path, "w200")
        : null;

    return (
        <div
            className="relative pl-6 pb-6 last:pb-0 border-l border-white/10 last:border-0 ml-2 animate-fade-in-left"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="absolute -left-1 top-0 w-2.5 h-2.5 rounded-full bg-white/20 ring-4 ring-bg-secondary" />

            <div className="flex gap-4">
                {posterUrl && activity.anime && (
                    <Link
                        href={`/anime/${activity.anime.slug}`}
                        className="shrink-0 w-12 h-16 relative rounded-lg overflow-hidden border border-white/10 group"
                    >
                        <Image
                            src={posterUrl}
                            alt={activity.anime.title}
                            fill
                            sizes="48px"
                            className="object-cover group-hover:scale-110 transition-transform"
                        />
                    </Link>
                )}

                <div className="flex-1">
                    <div className="text-sm text-white/50 mb-1 flex items-center gap-2">
                        {getActivityIcon(activity.activity_type)}
                        <span>{formatTimestamp(activity.created_at)}</span>
                    </div>

                    <p className="text-white text-sm leading-relaxed">
                        <span className="font-bold text-primary">{username}</span>
                        {" "}
                        {getActivityText(activity)}
                        {activity.anime && (
                            <>
                                {" "}
                                <Link
                                    href={`/anime/${activity.anime.slug}`}
                                    className="font-bold text-white hover:text-primary transition-colors"
                                >
                                    {activity.anime.title}
                                </Link>
                            </>
                        )}
                    </p>

                    {/* Rating meta gösterimi */}
                    {activity.activity_type === "review_add" && activity.metadata?.rating && (
                        <div className="mt-2 text-sm font-medium text-white/80 bg-white/5 px-3 py-1.5 rounded-lg w-fit">
                            <Star className="w-3 h-3 text-yellow-500 inline mr-1 mb-0.5" />
                            {activity.metadata.rating}/10
                        </div>
                    )}

                    {/* Profil güncelleme meta gösterimi */}
                    {activity.activity_type === "profile_update" && activity.metadata?.changed_fields && (
                        <div className="mt-2 text-xs text-text-main/50">
                            {activity.metadata.changed_fields.join(", ")}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
