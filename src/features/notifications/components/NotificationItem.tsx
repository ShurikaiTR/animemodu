"use client";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn, getAvatarUrl } from "@/shared/lib/utils";
import type { Notification as NotificationType } from "@/shared/types/domain/notification";

import { getColorConfig } from "./NotificationConfig";

interface NotificationItemProps {
    notification: NotificationType;
    onMarkAsRead: (id: string) => void;
    onDelete?: (id: string) => void;
    variant?: "default" | "compact";
}

export default function NotificationItem({
    notification,
    onMarkAsRead,
    onDelete,
    variant = "default"
}: NotificationItemProps) {
    const config = getColorConfig(notification.type);
    const Icon = config.icon;

    const formattedTime = format(new Date(notification.created_at), "d MMM HH:mm", { locale: tr });

    const handleClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("button")) return;
        if (!notification.is_read) onMarkAsRead(notification.id);
    };

    const itemContent = (
        <div
            className={cn(
                "relative group transition-all cursor-pointer",
                variant === "default"
                    ? "p-5 rounded-xl border border-white/5 mb-4"
                    : "p-4 border-b border-white/5",
                notification.is_read
                    ? "bg-transparent hover:bg-white/5 opacity-75 hover:opacity-100"
                    : "bg-primary/[0.04] border-primary/20 hover:bg-primary/10 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.02)]"
            )}
            onClick={handleClick}
        >
            {!notification.is_read && (
                <div className={cn(
                    "absolute left-0 w-1 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.5)] transition-all duration-300",
                    variant === "default" ? "top-1/4 bottom-1/4 group-hover:top-2 group-hover:bottom-2" : "top-0 bottom-0"
                )} />
            )}

            <div className="flex gap-4 items-start">
                <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/30 shadow-[0_5px_15px_-5px_rgba(var(--color-primary-rgb),0.3)] overflow-hidden transition-transform group-hover:scale-105">
                        {notification.actor?.avatar_url ? (
                            <Image src={getAvatarUrl(notification.actor.avatar_url)} alt={notification.actor.username || "Avatar"} width={48} height={48} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-primary font-bold text-lg leading-none">
                                {notification.actor?.username?.charAt(0).toUpperCase() || <Icon className={cn("w-6 h-6", config.color)} />}
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-bg-main rounded-xl p-1 shadow-lg ring-1 ring-white/10">
                        <div className={cn("rounded-lg w-5 h-5 flex items-center justify-center", config.bgColor)}>
                            <Icon className={cn("w-3 h-3", config.color)} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-start gap-3 mb-1">
                        <div className={cn(
                            "text-sm leading-relaxed flex-1",
                            notification.is_read ? "text-white/60" : "text-white/90 font-medium"
                        )}>
                            {notification.actor?.username && (
                                <span className="font-semibold text-white mr-1.5 hover:text-primary transition-colors cursor-pointer capitalize">
                                    {notification.actor.username}
                                </span>
                            )}
                            <span className={cn(
                                "font-normal",
                                variant === "compact" ? "text-xs" : "text-sm"
                            )}>
                                {notification.actor?.username && notification.title.startsWith(notification.actor.username)
                                    ? notification.title.replace(notification.actor.username, "").trim()
                                    : notification.title}
                            </span>
                        </div>
                        <div className={cn("flex items-center gap-1.5 flex-shrink-0 mt-0.5 px-2 py-1 rounded-lg border border-white/5", notification.is_read ? "text-white/20 bg-white/[0.02]" : "text-primary/80 bg-primary/5 border-primary/10")}>
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{formattedTime}</span>
                        </div>
                    </div>

                    {notification.message && (
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/50 line-clamp-2 italic group-hover:bg-white/[0.04] transition-colors relative mb-2">
                            "{notification.message}"
                        </div>
                    )}

                    {!notification.is_read && (
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.5)]" />
                            <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Yeni Mesaj</span>
                        </div>
                    )}
                </div>

                {onDelete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
                        className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all flex-shrink-0 mt-0.5 border border-transparent hover:border-red-500/20"
                        title="Bildirimi Sil"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );

    if (notification.link && !onDelete) {
        return <Link href={notification.link} className="block">{itemContent}</Link>;
    }
    return itemContent;
}
