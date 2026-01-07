"use client";

import { Bell, CheckCheck, Loader2 } from "lucide-react";
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

import NotificationItem from "./NotificationItem";

export default function NotificationBell() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Initial load of unread count
    useEffect(() => {
        if (!user) {
            setUnreadCount(0);
            setNotifications([]);
            return;
        }

        const fetchUnreadCount = async () => {
            const result = await getUnreadCount();
            if (result.success && "data" in result) {
                setUnreadCount((result.data as { count: number }).count);
            }
        };

        fetchUnreadCount();
        // Poll every 60 seconds
        const interval = setInterval(fetchUnreadCount, 60000);
        return () => clearInterval(interval);
    }, [user]);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (!isOpen || !user) return;

        const fetchNotifications = async () => {
            setIsLoading(true);
            const result = await getNotifications(10);
            if (result.success && "data" in result) {
                setNotifications(result.data as Notification[]);
            }
            setIsLoading(false);
        };

        fetchNotifications();
    }, [isOpen, user]);

    const handleMarkAsRead = (notificationId: string) => {
        startTransition(async () => {
            const result = await markNotificationAsRead(notificationId);
            if (result.success) {
                setNotifications(prev =>
                    prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
                );
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
                setIsOpen(false);
            }
        });
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-notification-dropdown]")) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen]);

    if (!user) return null;

    return (
        <div className="relative" data-notification-dropdown>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative p-2 rounded-full transition-colors",
                    "hover:bg-white/10",
                    isOpen && "bg-white/10"
                )}
                aria-label="Bildirimler"
            >
                <Bell className="w-5 h-5 text-white/80" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-bg-dropdown border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <h3 className="font-semibold text-white">Bildirimler</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={isPending}
                                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Tümünü Okundu İşaretle
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Bell className="w-10 h-10 text-white/20 mb-2" />
                                <p className="text-sm text-white/50">Henüz bildiriminiz yok</p>
                            </div>
                        ) : (
                            <div className="p-2 space-y-1">
                                {notifications.map(notification => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={handleMarkAsRead}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="border-t border-white/10">
                            <Link
                                href="/bildirimler"
                                className="block text-center py-3 text-sm text-primary hover:bg-white/5 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Tüm Bildirimleri Gör
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
