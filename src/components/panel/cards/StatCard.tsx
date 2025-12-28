import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    change?: string;
    trend?: "up" | "down" | "neutral";
}

export default function StatCard({ title, value, icon: Icon, change, trend }: StatCardProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-bg-secondary/50 border border-white/5 p-6 group hover:bg-bg-secondary/80 transition-all duration-300 backdrop-blur-sm">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-text-main/70 text-sm font-medium mb-1 font-inter">{title}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white font-rubik tracking-tight">{value}</span>
                        {change && (
                            <span className={cn(
                                "text-xs font-bold px-1.5 py-0.5 rounded-md",
                                trend === "up" ? "text-emerald-400 bg-emerald-400/10" :
                                    trend === "down" ? "text-red-400 bg-red-400/10" : "text-white/50 bg-white/5"
                            )}>
                                {change}
                            </span>
                        )}
                    </div>
                </div>

                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 cursor-default">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    );
}
