import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Play, Heart, Star, UserPlus } from "lucide-react";

interface Activity {
    id: number;
    type: "watch" | "comment" | "like" | "follow" | "rate";
    user: {
        username: string;
        avatar: string;
    };
    target: {
        title: string;
        image?: string;
        link: string;
    };
    meta?: string;
    timestamp: string;
}

interface ActivityItemProps {
    activity: Activity;
    index: number;
}

function getActivityIcon(type: Activity["type"]) {
    switch (type) {
        case "watch": return <Play className="w-3 h-3 text-primary" />;
        case "rate": return <Star className="w-3 h-3 text-yellow-500" />;
        case "comment": return <MessageSquare className="w-3 h-3 text-blue-400" />;
        case "like": return <Heart className="w-3 h-3 text-red-500" />;
        case "follow": return <UserPlus className="w-3 h-3 text-purple-500" />;
    }
}

function getActivityText(activity: Activity) {
    switch (activity.type) {
        case "watch": return "izledi:";
        case "rate": return "puanladı:";
        case "comment": return "yorum yaptı:";
        case "like": return "beğendi:";
        case "follow": return "takip etti:";
    }
}

export default function ActivityItem({ activity, index }: ActivityItemProps) {
    return (
        <div
            className="relative pl-6 pb-6 last:pb-0 border-l border-white/10 last:border-0 ml-2 animate-fade-in-left"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="absolute -left-1 top-0 w-2.5 h-2.5 rounded-full bg-white/20 ring-4 ring-bg-secondary" />

            <div className="flex gap-4">
                {activity.target.image && (
                    <Link href={activity.target.link} className="shrink-0 w-12 h-16 relative rounded-lg overflow-hidden border border-white/10 group">
                        <Image
                            src={activity.target.image}
                            alt={activity.target.title}
                            fill
                            sizes="48px"
                            className="object-cover group-hover:scale-110 transition-transform"
                        />
                    </Link>
                )}

                <div className="flex-1">
                    <div className="text-sm text-white/50 mb-1 flex items-center gap-2">
                        {getActivityIcon(activity.type)}
                        <span>{activity.timestamp}</span>
                    </div>

                    <p className="text-white text-sm leading-relaxed">
                        <span className="font-bold text-primary">{activity.user.username}</span>
                        {" "}
                        {getActivityText(activity)}
                        {" "}
                        <Link href={activity.target.link} className="font-bold text-white hover:text-primary transition-colors">
                            {activity.target.title}
                        </Link>
                    </p>

                    {activity.meta && (
                        <div className="mt-2 text-sm font-medium text-white/80 bg-white/5 px-3 py-1.5 rounded-lg w-fit">
                            {activity.type === "rate" && <Star className="w-3 h-3 text-yellow-500 inline mr-1 mb-0.5" />}
                            {activity.meta}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}



















