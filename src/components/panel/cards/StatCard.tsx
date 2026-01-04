import { LucideIcon, Minus,TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    change?: string;
    trend?: "up" | "down" | "neutral";
}

export default function StatCard({ title, value, icon: Icon, change, trend }: StatCardProps) {
    const trendStyles = {
        up: {
            text: "text-accent-green bg-accent-green/10",
            icon: TrendingUp
        },
        down: {
            text: "text-danger bg-danger/10",
            icon: TrendingDown
        },
        neutral: {
            text: "text-text-main/40 bg-white/5",
            icon: Minus
        }
    };

    const TrendIcon = trend ? trendStyles[trend].icon : null;

    return (
        <div className="flex flex-col relative overflow-hidden p-6 rounded-2xl bg-bg-secondary/40 border border-white/5 shadow-sm backdrop-blur-md transition-all duration-300 group hover:bg-bg-secondary/60">
            <div className="flex items-start justify-between">
                <div>
                    <p className="mb-1.5 font-inter text-sm font-medium text-text-main/50">{title}</p>
                    <h3 className="font-rubik text-3xl font-bold tracking-tight text-white">{value}</h3>
                </div>

                <div className="flex items-center justify-center w-12 h-12 rounded-xl text-primary bg-primary/10 border border-primary/20 transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div className="flex items-center gap-2 mt-5">
                {change && TrendIcon && (
                    <span className={cn(
                        "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold",
                        trendStyles[trend!].text
                    )}>
                        <TrendIcon className="w-4 h-4" />
                        {change}
                    </span>
                )}
                <span className="font-inter text-xs font-medium text-text-main/40">geçen aydan beri</span>
            </div>

            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-primary blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-20" />
        </div>
    );
}
