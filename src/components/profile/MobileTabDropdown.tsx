"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TabItem {
    id: string;
    label: string;
}

interface MobileTabDropdownProps {
    tabs: TabItem[];
    activeTab: string;
    activeTabLabel: string | undefined;
    onTabChange: (tabId: string) => void;
}

/**
 * Mobil cihazlarda gösterilen dropdown tab seçici
 */
export default function MobileTabDropdown({
    tabs,
    activeTab,
    activeTabLabel,
    onTabChange
}: MobileTabDropdownProps) {
    return (
        <div className="md:hidden mb-6">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-between w-full px-5 py-3.5 bg-bg-secondary/50 backdrop-blur-md border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all active:scale-[0.98]">
                        <span className="flex flex-col items-start leading-tight">
                            <span className="text-xs text-white/40 uppercase tracking-wider font-bold mb-0.5">Kategori</span>
                            <span className="text-sm">{activeTabLabel}</span>
                        </span>
                        <ChevronDown className="w-5 h-5 text-white/50" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="start"
                    className="w-[calc(100vw-2rem)] min-w-52 bg-bg-secondary/95 backdrop-blur-xl border-white/10 p-2 rounded-2xl shadow-2xl"
                >
                    {tabs.map((tab) => (
                        <DropdownMenuItem
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1 last:mb-0 cursor-pointer",
                                activeTab === tab.id
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                activeTab === tab.id ? "bg-white scale-125" : "bg-white/10"
                            )} />
                            {tab.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
