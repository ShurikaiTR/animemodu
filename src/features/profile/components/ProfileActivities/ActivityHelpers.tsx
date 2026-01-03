import Link from "next/link";
import { MessageSquare, Play, Heart, Star, UserPlus, Plus, RefreshCw, Trash2, User } from "lucide-react";
import type { Activity, ActivityType } from "@/shared/types/helpers";

/** Aktivite tipine göre ikon döndürür */
export function getActivityIcon(type: ActivityType) {
    const iconClass = "w-3 h-3";
    switch (type) {
        case "watchlist_add": return <Plus className={`${iconClass} text-accent-green`} />;
        case "watchlist_update": return <RefreshCw className={`${iconClass} text-primary`} />;
        case "watchlist_remove": return <Trash2 className={`${iconClass} text-danger`} />;
        case "favorite_add": return <Heart className={`${iconClass} text-danger fill-danger`} />;
        case "favorite_remove": return <Heart className={`${iconClass} text-text-main/50`} />;
        case "comment_add": return <MessageSquare className={`${iconClass} text-primary`} />;
        case "review_add": return <Star className={`${iconClass} text-yellow-500`} />;
        case "profile_update": return <User className={`${iconClass} text-primary`} />;
        case "follow_add":
        case "followed_by": return <UserPlus className={`${iconClass} ${type === 'follow_add' ? 'text-accent-green' : 'text-primary'}`} />;
        default: return <Play className={`${iconClass} text-primary`} />;
    }
}

/** Aktivite tipine göre metin döndürür */
export function getActivityText(activity: Activity): string | null {
    const { activity_type, metadata } = activity;
    switch (activity_type) {
        case "watchlist_add": return `"${metadata?.status || 'izleme listesine'}" listesine ekledi:`;
        case "watchlist_update": return `durumu "${metadata?.new_status}" olarak güncelledi:`;
        case "watchlist_remove": return "listesinden çıkardı:";
        case "favorite_add": return "favorilerine ekledi:";
        case "favorite_remove": return "favorilerinden çıkardı:";
        case "comment_add": return "yorum yaptı:";
        case "review_add": return "inceleme yazdı:";
        case "profile_update": return "profilini güncelledi";
        default: return null;
    }
}

/** Zaman damgasını formatlar */
export function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const min = Math.floor(diffMs / 60000);
    const hour = Math.floor(diffMs / 3600000);
    const day = Math.floor(diffMs / 86400000);

    if (min < 1) return "Az önce";
    if (min < 60) return `${min} dakika önce`;
    if (hour < 24) return `${hour} saat önce`;
    if (day < 7) return `${day} gün önce`;
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export function FollowContent({ activity }: { activity: Activity }) {
    if (activity.activity_type === "follow_add") {
        return (
            <>
                takip etti:{" "}
                <Link href={`/profil/${activity.metadata?.target_username}`} className="font-bold text-white hover:text-primary transition-colors">
                    {activity.metadata?.target_username || "kullanıcı"}
                </Link>
            </>
        );
    }
    return (
        <>
            tarafından takip edildi:{" "}
            <Link href={`/profil/${activity.metadata?.follower_username}`} className="font-bold text-white hover:text-primary transition-colors">
                {activity.metadata?.follower_username || "kullanıcı"}
            </Link>
        </>
    );
}
