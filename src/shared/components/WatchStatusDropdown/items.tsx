
import { DropdownMenuItem } from "@/shared/components/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { WatchStatus } from "./config";

interface StatusItemProps {
    statusKey: string;
    config: {
        label: string;
        icon: LucideIcon;
        color: string;
        bgColor: string;
        borderColor: string;
    };
    isSelected: boolean;
    isPending: boolean;
    onSelect: (status: WatchStatus) => void;
}

export function StatusItem({ statusKey, config, isSelected, isPending, onSelect }: StatusItemProps) {
    const Icon = config.icon;

    return (
        <DropdownMenuItem
            disabled={isPending}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(statusKey as WatchStatus);
            }}
            className={cn(
                "cursor-pointer rounded-lg p-2.5 transition-colors focus:bg-white/5",
                isSelected && "bg-white/10",
                isPending && "opacity-50 cursor-wait"
            )}
        >
            <div className="flex items-center gap-3 w-full">
                <div className={cn(
                    "p-1.5 rounded-md transition-colors",
                    isSelected ? config.bgColor : "bg-white/5 group-hover:bg-white/10"
                )}>
                    <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <span className={cn(
                    "font-medium transition-colors",
                    isSelected ? "text-white" : "text-white/70 group-hover:text-white"
                )}>
                    {config.label}
                </span>
                {isSelected && !isPending && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                {isSelected && isPending && (
                    <div className="ml-auto w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
            </div>
        </DropdownMenuItem>
    );
}

interface RemoveItemProps {
    isPending: boolean;
    onRemove: () => void;
}

export function RemoveItem({ isPending, onRemove }: RemoveItemProps) {
    return (
        <DropdownMenuItem
            disabled={isPending}
            onClick={(e) => {
                e.stopPropagation();
                onRemove();
            }}
            className="cursor-pointer rounded-lg p-2.5 text-white/50 hover:text-white hover:bg-white/5 transition-colors focus:bg-white/5 focus:text-white"
        >
            <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-white/5">
                    <XCircle className="w-4 h-4" />
                </div>
                <span className="font-medium">Listeden Kaldır</span>
            </div>
        </DropdownMenuItem>
    );
}
