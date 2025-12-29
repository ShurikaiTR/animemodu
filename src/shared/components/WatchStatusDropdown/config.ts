import { Eye, Check, Clock, XCircle, Pause } from "lucide-react";

// Must match database enum: watching, completed, plan_to_watch, on_hold, dropped
export type WatchStatus = "watching" | "completed" | "plan_to_watch" | "on_hold" | "dropped";

export interface StatusConfig {
    label: string;
    icon: typeof Eye;
    color: string;
    bgColor: string;
    borderColor: string;
}

export const statusConfig: Record<WatchStatus, StatusConfig> = {
    watching: {
        label: "İzliyorum",
        icon: Eye,
        color: "text-primary",
        bgColor: "bg-primary/20",
        borderColor: "border-primary/50",
    },
    completed: {
        label: "İzledim",
        icon: Check,
        color: "text-green-500",
        bgColor: "bg-green-500/20",
        borderColor: "border-green-500/50",
    },
    plan_to_watch: {
        label: "İzleyeceğim",
        icon: Clock,
        color: "text-orange-500",
        bgColor: "bg-orange-500/20",
        borderColor: "border-orange-500/50",
    },
    on_hold: {
        label: "Beklemede",
        icon: Pause,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/50",
    },
    dropped: {
        label: "Bıraktım",
        icon: XCircle,
        color: "text-red-500",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500/50",
    },
};

