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
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <Bell className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-sm text-white/50 font-medium">Henüz bildiriminiz yok</p>
                <p className="text-xs text-white/30 mt-1">Yeni bildirimler burada görünecek</p>
            </div>
        );
    }

    const unreadNotifications = notifications.filter(n => !n.is_read);
    const readNotifications = notifications.filter(n => n.is_read);

    return (
        <div className="max-h-[450px] overflow-y-auto bg-bg-dropdown">
            {/* Unread Section */}
            {unreadNotifications.length > 0 && (
                <>
                    <div className="sticky top-0 z-10 px-4 py-2 bg-bg-dropdown/95 backdrop-blur-sm border-b border-white/10">
                        <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Yeni</span>
                    </div>
                    {unreadNotifications.map(notification => (
                        <NotificationItem key={notification.id} notification={notification} onMarkAsRead={onMarkAsRead} variant="compact" />
                    ))}
                </>
            )}

            {/* Read Section */}
            {readNotifications.length > 0 && (
                <>
                    <div className="sticky top-0 z-10 px-4 py-2 bg-bg-dropdown/95 backdrop-blur-sm border-y border-white/10">
                        <span className="text-[10px] font-bold tracking-wider text-white/50 uppercase">Önceki</span>
                    </div>
                    {readNotifications.map(notification => (
                        <NotificationItem key={notification.id} notification={notification} onMarkAsRead={onMarkAsRead} variant="compact" />
                    ))}
                </>
            )}
        </div>
    );
}
