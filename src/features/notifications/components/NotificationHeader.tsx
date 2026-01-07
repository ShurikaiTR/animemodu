"use client";

import { Bell, CheckCheck } from "lucide-react";

interface NotificationHeaderProps {
    unreadCount: number;
    isPending: boolean;
    onMarkAllRead: () => void;
}

export default function NotificationHeader({ unreadCount, isPending, onMarkAllRead }: NotificationHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
                <h1 className="text-3xl md:text-5xl font-bold text-white flex items-center gap-3 mb-4 tracking-tight">
                    <Bell className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                    Bildirimler
                </h1>
                <p className="text-white/60 text-lg">Tüm aktivitelerinden ve güncellemelerden haberdar ol.</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onMarkAllRead}
                    disabled={isPending || unreadCount === 0}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white/50 hover:text-primary hover:bg-white/5 rounded-xl transition-all disabled:opacity-30 group border border-white/5"
                >
                    <CheckCheck className="w-5 h-5 group-hover:text-primary" />
                    Tümünü okundu say
                </button>
            </div>
        </div>
    );
}
