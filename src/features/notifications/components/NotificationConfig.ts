"use client";

import { Bell, Film, Heart, MessageCircle, UserPlus } from "lucide-react";

export const notificationConfig: Record<string, { icon: typeof Bell; color: string; bgColor: string }> = {
    new_episode: { icon: Film, color: "text-green-400", bgColor: "bg-green-500/20" },
    comment_reply: { icon: MessageCircle, color: "text-blue-400", bgColor: "bg-blue-500/20" },
    new_follower: { icon: UserPlus, color: "text-purple-400", bgColor: "bg-purple-500/20" },
    review_like: { icon: Heart, color: "text-pink-400", bgColor: "bg-pink-500/20" },
    comment_like: { icon: Heart, color: "text-pink-400", bgColor: "bg-pink-500/20" },
};

export const getColorConfig = (type: string) => {
    return notificationConfig[type] || {
        icon: Bell,
        color: "text-white/60",
        bgColor: "bg-white/10"
    };
};
