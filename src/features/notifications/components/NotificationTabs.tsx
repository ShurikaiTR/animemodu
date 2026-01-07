"use client";

import { cn } from "@/shared/lib/utils";

export type TabType = "all" | "unread";

interface NotificationTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    unreadCount: number;
}

export default function NotificationTabs({ activeTab, onTabChange, unreadCount }: NotificationTabsProps) {
    const tabs: { id: TabType; label: string; count?: number }[] = [
        { id: "all", label: "Tüm Bildirimler" },
        { id: "unread", label: "Okunmamış", count: unreadCount },
    ];

    return (
        <div className="flex items-center border-b border-white/10 mb-10 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "relative flex items-center gap-2 px-8 py-5 text-sm font-semibold transition-all whitespace-nowrap uppercase tracking-widest",
                        activeTab === tab.id
                            ? "text-primary border-b-2 border-primary"
                            : "text-white/30 hover:text-white border-b-2 border-transparent"
                    )}
                >
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                        <span className="bg-primary px-2 py-0.5 rounded-full text-[0.625rem] font-bold text-white">
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
