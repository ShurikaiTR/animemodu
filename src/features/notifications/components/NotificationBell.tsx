"use client";

import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import {
    getNotifications,
    getUnreadCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "@/features/notifications/actions";
import { useAuth } from "@/shared/contexts/AuthContext";
import { cn } from "@/shared/lib/utils";
import type { Notification } from "@/shared/types/domain/notification";

import NotificationBellList from "./NotificationBellList";

export default function NotificationBell() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

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
        const interval = setInterval(fetchUnreadCount, 60000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        if (!isOpen || !user) return;

        const fetchNotifications = async () => {
            setIsLoading(true);
            const result = await getNotifications(20);
            if (result.success && "data" in result && result.data) {
                setNotifications(result.data);
            }
            setIsLoading(false);
        };

        fetchNotifications();
    }, [isOpen, user]);

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

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-notification-dropdown]")) setIsOpen(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen]);

    if (!user) return null;

    return (
        <div className="relative" data-notification-dropdown>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn("relative p-2 rounded-full transition-colors hover:bg-white/10", isOpen && "bg-white/10")}
                aria-label="Bildirimler"
            >
                <Bell className="w-5 h-5 text-white/80" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-main animate-pulse" />}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-bg-dropdown border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-black/5">
                    <div className="px-4 py-3.5 border-b border-white/10 flex justify-between items-center bg-bg-secondary">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-white tracking-tight">Bildirimler</h3>
                            {unreadCount > 0 && <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount > 99 ? "99+" : unreadCount}</span>}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={isPending}
                                className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-primary transition-colors disabled:opacity-50 group"
                            >
                                <CheckCheck className="w-4 h-4 group-hover:text-primary transition-colors" />
                                <span className="hidden sm:inline">Tümünü okundu say</span>
                            </button>
                        )}
                    </div>

                    <NotificationBellList notifications={notifications} isLoading={isLoading} onMarkAsRead={handleMarkAsRead} />

                    {notifications.length > 0 && (
                        <Link
                            href="/profil/bildirimler"
                            className="block py-3 text-center text-xs font-semibold text-white/40 bg-bg-secondary border-t border-white/10 hover:text-primary hover:bg-white/5 transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            Tüm Bildirimleri Görüntüle
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
