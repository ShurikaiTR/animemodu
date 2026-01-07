"use client";

import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Bell, Film, Heart, MessageCircle, Star, UserPlus } from "lucide-react";
import Link from "next/link";

import { cn } from "@/shared/lib/utils";
import type { Notification as NotificationType } from "@/shared/types/domain/notification";

interface NotificationItemProps {
    notification: NotificationType;
    onMarkAsRead: (id: string) => void;
}

const notificationIcons: Record<string, typeof Bell> = {
    new_episode: Film,
    comment_reply: MessageCircle,
    new_follower: UserPlus,
    review_like: Star,
    comment_like: Heart,
};

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
    const Icon = notificationIcons[notification.type] || Bell;
    const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
        addSuffix: true,
        locale: tr
    });

    const handleClick = () => {
        if (!notification.is_read) {
            onMarkAsRead(notification.id);
        }
    };

    const content = (
        <div
            className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                notification.is_read
                    ? "bg-transparent hover:bg-white/5"
                    : "bg-primary/5 hover:bg-primary/10"
            )}
            onClick={handleClick}
        >
            <div className={cn(
                "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
                notification.is_read ? "bg-white/5" : "bg-primary/20"
            )}>
                <Icon className={cn(
                    "w-4 h-4",
                    notification.is_read ? "text-white/60" : "text-primary"
                )} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={cn(
                    "text-sm line-clamp-2",
                    notification.is_read ? "text-white/70" : "text-white"
                )}>
                    {notification.title}
                </p>
                {notification.message && (
                    <p className="text-xs text-white/50 mt-0.5 line-clamp-1">
                        {notification.message}
                    </p>
                )}
                <p className="text-xs text-white/40 mt-1">{timeAgo}</p>
            </div>
            {!notification.is_read && (
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
            )}
        </div>
    );

    if (notification.link) {
        return (
            <Link href={notification.link} className="block">
                {content}
            </Link>
        );
    }

    return content;
}
