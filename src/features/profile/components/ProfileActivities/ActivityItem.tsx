import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { getImageUrl } from "@/shared/lib/tmdb/utils";
import type { Activity } from "@/shared/types/helpers";
import {
    getActivityIcon,
    getActivityText,
    formatTimestamp,
    FollowContent
} from "./ActivityHelpers";

interface ActivityItemProps {
    activity: Activity;
    username: string;
    index: number;
}

export default function ActivityItem({ activity, username, index }: ActivityItemProps) {
    const posterUrl = activity.anime?.poster_path ? getImageUrl(activity.anime.poster_path, "w200") : null;
    const isFollow = activity.activity_type === "follow_add" || activity.activity_type === "followed_by";

    return (
        <div className="relative pl-6 pb-6 last:pb-0 border-l border-white/10 last:border-0 ml-2 animate-fade-in-left" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="absolute -left-1 top-0 w-2.5 h-2.5 rounded-full bg-white/20 ring-4 ring-bg-secondary" />

            <div className="flex gap-4">
                {posterUrl && activity.anime && (
                    <Link href={`/anime/${activity.anime.slug}`} className="shrink-0 w-12 h-16 relative rounded-lg overflow-hidden border border-white/10 group">
                        <Image src={posterUrl} alt={activity.anime.title} fill sizes="48px" className="object-cover group-hover:scale-110 transition-transform" />
                    </Link>
                )}

                <div className="flex-1">
                    <div className="text-sm text-white/50 mb-1 flex items-center gap-2">
                        {getActivityIcon(activity.activity_type)}
                        <span>{formatTimestamp(activity.created_at)}</span>
                    </div>

                    <p className="text-white text-sm leading-relaxed">
                        <span className="font-bold text-primary">{username}</span>{" "}
                        {isFollow ? <FollowContent activity={activity} /> : (
                            <>
                                {getActivityText(activity)}
                                {activity.anime && (
                                    <>{" "}<Link href={`/anime/${activity.anime.slug}`} className="font-bold text-white hover:text-primary transition-colors">{activity.anime.title}</Link></>
                                )}
                            </>
                        )}
                    </p>

                    {activity.activity_type === "review_add" && activity.metadata?.rating && (
                        <div className="mt-2 text-sm font-medium text-white/80 bg-white/5 px-3 py-1.5 rounded-lg w-fit">
                            <Star className="w-3 h-3 text-yellow-500 inline mr-1 mb-0.5" />
                            {activity.metadata.rating}/10
                        </div>
                    )}

                    {activity.activity_type === "profile_update" && activity.metadata?.changed_fields && (
                        <div className="mt-2 text-xs text-text-main/50">{activity.metadata.changed_fields.join(", ")}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
