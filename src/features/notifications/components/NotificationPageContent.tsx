"use client";

import { isToday, isYesterday } from "date-fns";
import { Bell } from "lucide-react";
import { useCallback, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteNotification, markAllNotificationsAsRead, markNotificationAsRead } from "@/features/notifications/actions";
import Container from "@/shared/components/container";
import EmptyState from "@/shared/components/EmptyState";
import { useAuth } from "@/shared/contexts/AuthContext";
import type { Notification, NotificationRow } from "@/shared/types/domain/notification";

import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";
import NotificationHeader from "./NotificationHeader";
import NotificationItem from "./NotificationItem";
import NotificationSidebar, { type FilterType } from "./NotificationSidebar";
import NotificationTabs, { type TabType } from "./NotificationTabs";

interface Props {
    initialNotifications: Notification[];
}

export default function NotificationPageContent({ initialNotifications }: Props) {
    const { user } = useAuth();
    const [isPending, startTransition] = useTransition();

    // Client-side state - URL sync kaldırıldı, anında çalışıyor
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [activeTab, setActiveTab] = useState<TabType>("all");
    const [filterType, setFilterType] = useState<FilterType>("all");

    // Realtime: Yeni bildirimleri dinle
    const handleNewNotification = useCallback((newNotification: NotificationRow) => {
        // NotificationRow'u Notification tipine dönüştür
        const notification: Notification = {
            ...newNotification,
            actor: null, // Realtime'da actor bilgisi gelmiyor, sonradan fetch edilebilir
        };
        setNotifications(prev => [notification, ...prev]);
        toast.info("Yeni bildirim geldi!");
    }, []);

    useRealtimeNotifications({
        userId: user?.id,
        onNewNotification: handleNewNotification,
    });

    // Client-side filtreleme - anında çalışır, server'a istek yok
    const filteredNotifications = useMemo(() => {
        return notifications.filter(n => {
            const matchesType = (() => {
                if (filterType === "all") return true;
                if (filterType === "likes") return n.type === "review_like" || n.type === "comment_like";
                if (filterType === "replies") return n.type === "comment_reply";
                return true;
            })();

            const matchesTab = activeTab === "all" ? true : !n.is_read;
            return matchesType && matchesTab;
        });
    }, [notifications, filterType, activeTab]);

    const groupedNotifications = useMemo(() => {
        const groups: Record<string, Notification[]> = { Today: [], Yesterday: [], Earlier: [] };
        filteredNotifications.forEach(n => {
            const date = new Date(n.created_at);
            if (isToday(date)) groups.Today.push(n);
            else if (isYesterday(date)) groups.Yesterday.push(n);
            else groups.Earlier.push(n);
        });
        return groups;
    }, [filteredNotifications]);

    const handleMarkAllRead = () => {
        startTransition(async () => {
            const result = await markAllNotificationsAsRead();
            if (result.success) {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                toast.success("Tüm bildirimler okundu olarak işaretlendi");
            }
        });
    };

    const handleDelete = (id: string) => {
        startTransition(async () => {
            const result = await deleteNotification(id);
            if (result.success) {
                setNotifications(prev => prev.filter(n => n.id !== id));
                toast.success("Bildirim silindi");
            }
        });
    };

    const handleMarkRead = (id: string) => {
        startTransition(async () => {
            const result = await markNotificationAsRead(id);
            if (result.success) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            }
        });
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;
    const filterCounts = {
        all: notifications.length,
        likes: notifications.filter(n => n.type === "review_like" || n.type === "comment_like").length,
        replies: notifications.filter(n => n.type === "comment_reply").length,
    };

    return (
        <div className="min-h-screen bg-bg-main pb-20">
            <Container>
                <NotificationHeader unreadCount={unreadCount} isPending={isPending} onMarkAllRead={handleMarkAllRead} />
                <NotificationTabs activeTab={activeTab} onTabChange={setActiveTab} unreadCount={unreadCount} />

                <div className="flex flex-col lg:flex-row gap-0 lg:gap-12 items-start">
                    <NotificationSidebar filterType={filterType} onFilterChange={setFilterType} counts={filterCounts} />

                    <div className="flex-1 w-full space-y-12">
                        {filteredNotifications.length === 0 ? (
                            <EmptyState
                                icon={Bell}
                                title="Henüz bildirim yok"
                                description="Bu kategori için gösterilecek bildirim bulunamadı."
                            />
                        ) : (
                            (['Today', 'Yesterday', 'Earlier'] as const).map(groupKey => {
                                const groupList = groupedNotifications[groupKey];
                                if (groupList.length === 0) return null;

                                return (
                                    <div key={groupKey} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <div className="flex items-center gap-4 mb-6 px-1">
                                            <h3 className="text-xs font-bold text-white/20 uppercase tracking-[0.3em] whitespace-nowrap">
                                                {groupKey === 'Today' ? 'Bugün' : groupKey === 'Yesterday' ? 'Dün' : 'Daha Eski'}
                                            </h3>
                                            <div className="h-px bg-white/5 w-full" />
                                        </div>
                                        <div className="grid gap-4">
                                            {groupList.map(n => (
                                                <NotificationItem key={n.id} notification={n} onMarkAsRead={handleMarkRead} onDelete={handleDelete} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
}
