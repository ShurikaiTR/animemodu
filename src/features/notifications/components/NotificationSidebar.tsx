"use client";

import { Bell, Filter, Heart, Inbox, MessageCircle } from "lucide-react";

import { cn } from "@/shared/lib/utils";

export type FilterType = "all" | "likes" | "replies" | "system";

interface NotificationSidebarProps {
    filterType: FilterType;
    onFilterChange: (type: FilterType) => void;
    counts: {
        all: number;
        likes: number;
        replies: number;
        system: number;
    };
}

export default function NotificationSidebar({ filterType, onFilterChange, counts }: NotificationSidebarProps) {
    const filters = [
        { id: "all", label: "Tüm Bildirimler", icon: Inbox, count: counts.all },
        { id: "likes", label: "Beğeniler", icon: Heart, count: counts.likes },
        { id: "replies", label: "Yanıtlar", icon: MessageCircle, count: counts.replies },
        { id: "system", label: "Sistem Mesajları", icon: Bell, count: counts.system },
    ] as const;

    return (
        <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 mb-10 lg:mb-0">
            <h3 className="flex items-center gap-2 px-4 mb-6 text-[0.6875rem] font-semibold text-white/20 uppercase tracking-[0.2em]">
                <Filter className="w-3 h-3" />
                Kategori Filtrele
            </h3>
            <nav className="flex flex-col gap-2">
                {filters.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onFilterChange(item.id)}
                        className={cn(
                            "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden text-left",
                            filterType === item.id
                                ? "bg-primary/10 text-primary font-bold shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                                : "text-white/40 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5 transition-transform group-hover:scale-110",
                            filterType === item.id ? "text-primary" : "text-white/30"
                        )} />
                        <span className="text-sm">{item.label}</span>
                        {item.count > 0 && (
                            <span className={cn(
                                "ml-auto text-[0.625rem] font-bold px-2 py-1 rounded-lg transition-colors",
                                filterType === item.id
                                    ? "bg-primary text-white"
                                    : "bg-white/5 text-white/30 group-hover:bg-white/10"
                            )}>
                                {item.count}
                            </span>
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
}
