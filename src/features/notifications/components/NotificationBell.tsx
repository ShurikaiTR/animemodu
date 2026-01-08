"use client";

import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";

import {
    getNotifications,
    getUnreadCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "@/features/notifications/actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu";
import { useAuth } from "@/shared/contexts/AuthContext";
import type { Notification } from "@/shared/types/domain/notification";

import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";
import NotificationBellList from "./NotificationBellList";

export default function NotificationBell() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [hasNewNotification, setHasNewNotification] = useState(false);

    // Yeni bildirim geldiğinde çağrılacak callback
    const handleNewNotification = useCallback(() => {
        setHasNewNotification(true);
        // 2 saniye sonra animasyonu kapat
        setTimeout(() => setHasNewNotification(false), 2000);
    }, []);

    // Supabase Realtime hook
    const { realtimeCount, resetCount } = useRealtimeNotifications({
        userId: user?.id,
        onNewNotification: handleNewNotification,
    });

    // Realtime ile gelen yeni bildirimleri sayaca ekle
    const totalUnread = unreadCount + realtimeCount;

    useEffect(() => {
        if (!user) {
            setUnreadCount(0);
            setNotifications([]);
            return;
        }

        const fetchUnreadCount = async () => {
            const result = await getUnreadCount();
            if (result.success && "data" in result && result.data) {
                setUnreadCount(result.data.count);
            }
        };

        fetchUnreadCount();
        // Realtime aktif olduğu için polling interval'ı 5 dakikaya çıkarabiliriz
        const interval = setInterval(fetchUnreadCount, 300000);
        return () => clearInterval(interval);
    }, [user]);

    const fetchNotifications = async () => {
        setIsLoading(true);
        const result = await getNotifications(20);
        if (result.success && "data" in result && result.data) {
            setNotifications(result.data);
            // Dropdown açıldığında realtime sayacını sıfırla
            resetCount();
            // Sunucudan güncel sayıyı al
            const countResult = await getUnreadCount();
            if (countResult.success && "data" in countResult && countResult.data) {
                setUnreadCount(countResult.data.count);
            }
        }
        setIsLoading(false);
    };

    const handleMarkAsRead = (notificationId: string) => {
        startTransition(async () => {
            const result = await markNotificationAsRead(notificationId);
            if (result.success) {
                setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        });
    };

    const handleMarkAllAsRead = () => {
        startTransition(async () => {
            const result = await markAllNotificationsAsRead();
            if (result.success) {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                setUnreadCount(0);
            }
        });
    };

    if (!user) return null;

    return (
        <DropdownMenu onOpenChange={(open) => open && fetchNotifications()}>
            <DropdownMenuTrigger asChild>
                <button
                    className={`relative p-2 rounded-full transition-colors hover:bg-white/5 outline-none data-[state=open]:bg-white/5 border border-transparent hover:border-white/5 data-[state=open]:border-white/5 ${hasNewNotification ? "animate-shake" : ""}`}
                    aria-label="Bildirimler"
                >
                    <Bell className="w-5 h-5 text-white/80" />
                    {totalUnread > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-bg-main shadow-lg shadow-primary/30">
                            {totalUnread > 99 ? "99+" : totalUnread}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-80 sm:w-96 bg-bg-dropdown/95 backdrop-blur-xl border-white/10 text-white p-2 shadow-2xl rounded-xl mt-2 animate-in fade-in zoom-in-95 duration-200 z-50"
            >
                {/* Header - Profil dropdown stiliyle tutarlı */}
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 mb-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-white">Bildirimler</h3>
                        {totalUnread > 0 && (
                            <span className="bg-primary text-white text-[0.625rem] font-bold px-1.5 py-0.5 rounded-full">
                                {totalUnread > 99 ? "99+" : totalUnread}
                            </span>
                        )}
                    </div>
                    {totalUnread > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={isPending}
                            className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-primary transition-colors disabled:opacity-50 group"
                        >
                            <CheckCheck className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                            <span className="hidden sm:inline">Tümünü okundu say</span>
                        </button>
                    )}
                </div>

                {/* Notification List */}
                <div className="max-h-[400px] overflow-y-auto rounded-lg">
                    <NotificationBellList notifications={notifications} isLoading={isLoading} onMarkAsRead={handleMarkAsRead} />
                </div>

                {/* Footer Link */}
                {notifications.length > 0 && (
                    <Link
                        href="/profil/bildirimler"
                        className="block py-2.5 mt-2 text-center text-xs font-semibold text-white/50 bg-white/5 rounded-lg border border-white/5 hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all"
                    >
                        Tüm Bildirimleri Görüntüle
                    </Link>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
