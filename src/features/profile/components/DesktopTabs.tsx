"use client";

import { motion } from "framer-motion";

import { cn } from "@/shared/lib/utils";

interface TabItem {
    id: string;
    label: string;
}

interface DesktopTabsProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

/**
 * Desktop için yatay tab bar component'ı
 */
export default function DesktopTabs({ tabs, activeTab, onTabChange }: DesktopTabsProps) {
    return (
        <div className="hidden md:flex items-center gap-1 p-1 bg-bg-secondary/50 backdrop-blur-sm border border-white/5 rounded-xl w-fit mb-8">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "relative px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 whitespace-nowrap z-10",
                        activeTab === tab.id ? "text-white" : "text-white/50 hover:text-white hover:bg-white/5"
                    )}
                >
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-lg shadow-primary/25"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
