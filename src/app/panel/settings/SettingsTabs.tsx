"use client";

import { cn } from "@/shared/lib/utils";
import { Settings, Search } from "lucide-react";

export type SettingsTab = "general" | "seo";

interface SettingsTabsProps {
    activeTab: SettingsTab;
    onTabChange: (tab: SettingsTab) => void;
}

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "general", label: "Genel", icon: Settings },
    { id: "seo", label: "SEO", icon: Search },
];

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
    return (
        <div className="flex gap-1 p-1 bg-bg-secondary/30 rounded-xl border border-white/5">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                            isActive
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "text-text-main/60 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
