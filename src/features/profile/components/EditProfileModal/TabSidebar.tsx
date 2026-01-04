"use client";

import type { LucideIcon } from "lucide-react";
import { Settings } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface TabItem {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface TabSidebarProps {
    tabs: TabItem[];
    activeTab: string;
    isPending: boolean;
    onTabChange: (tabId: string) => void;
}

/**
 * Modal sol sidebar - tab navigasyonu
 */
export default function TabSidebar({
    tabs,
    activeTab,
    isPending,
    onTabChange
}: TabSidebarProps) {
    return (
        <div className="w-64 bg-bg-secondary border-r border-white/5 p-6 flex flex-col gap-2 shrink-0">
            <div className="mb-6 px-2">
                <h2 className="text-xl font-bold text-text-heading font-rubik flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Ayarlar
                </h2>
                <p className="text-xs text-text-main/50 mt-1">Profilini özelleştir</p>
            </div>

            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    disabled={isPending}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left relative overflow-hidden group disabled:opacity-50",
                        activeTab === tab.id
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "text-text-main/50 hover:text-text-main hover:bg-white/5"
                    )}
                >
                    <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-white" : "text-text-main/50 group-hover:text-text-main")} />
                    <span className="relative z-10">{tab.label}</span>
                </button>
            ))}
        </div>
    );
}
