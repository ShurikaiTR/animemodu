"use client";

import { Bell, Loader2 } from "lucide-react";

import type { Notification } from "@/shared/types/domain/notification";

import NotificationItem from "./NotificationItem";

interface NotificationBellListProps {
    notifications: Notification[];
    isLoading: boolean;
    onMarkAsRead: (id: string) => void;
}

export default function NotificationBellList({ notifications, isLoading, onMarkAsRead }: NotificationBellListProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/5">
                    <Bell className="w-7 h-7 text-white/20" />
                </div>
                <p className="text-sm text-white/50 font-medium">Henüz bildiriminiz yok</p>
                <p className="text-xs text-white/30 mt-1">Yeni bildirimler burada görünecek</p>
            </div>
        );
    }

    const unreadNotifications = notifications.filter(n => !n.is_read);
    const readNotifications = notifications.filter(n => n.is_read);

    return (
        <div className="space-y-1">
            {/* Unread Section */}
            {unreadNotifications.length > 0 && (
                <div>
                    <div className="px-2 py-1.5">
                        <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Yeni</span>
                    </div>
                    <div className="space-y-0.5">
                        {unreadNotifications.map(notification => (
                            <NotificationItem key={notification.id} notification={notification} onMarkAsRead={onMarkAsRead} variant="compact" />
                        ))}
                    </div>
                </div>
            )}

            {/* Read Section */}
            {readNotifications.length > 0 && (
                <div>
                    <div className="px-2 py-1.5">
                        <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase">Önceki</span>
                    </div>
                    <div className="space-y-0.5">
                        {readNotifications.map(notification => (
                            <NotificationItem key={notification.id} notification={notification} onMarkAsRead={onMarkAsRead} variant="compact" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
