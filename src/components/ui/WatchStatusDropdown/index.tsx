"use client";

import { useState, useTransition, useEffect } from "react";
import { Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { statusConfig, type WatchStatus } from "./config";
import { updateWatchStatus, checkWatchStatus } from "@/actions/profile/userList";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { StatusItem, RemoveItem } from "./items";

interface WatchStatusDropdownProps {
    animeId?: number;
    initialStatus?: WatchStatus | null; // Allow explicit null
    variant?: "hero" | "card" | "featured";
}

export default function WatchStatusDropdown({ animeId, initialStatus, variant = "hero" }: WatchStatusDropdownProps) {
    const [status, setStatus] = useState<WatchStatus | null>(initialStatus ?? null);
    const [isPending, startTransition] = useTransition();
    const { user } = useAuth();
    const { openAuthModal } = useAuthModal();

    // Fetch user status on mount if not provided (undefined)
    useEffect(() => {
        if (!user || !animeId || initialStatus !== undefined) return;

        const syncStatus = async () => {
            const result = await checkWatchStatus(animeId);
            if (result.success && result.status) {
                setStatus(result.status as WatchStatus);
            }
        };

        syncStatus();
    }, [user, animeId, initialStatus]);

    const handleStatusChange = async (newStatus: WatchStatus | null) => {
        if (!user) {
            openAuthModal("login");
            return;
        }

        if (!animeId) return;

        startTransition(async () => {
            const result = await updateWatchStatus(animeId, newStatus);
            if (result.success) {
                setStatus(newStatus);
                toast.success(newStatus ? "Listeye eklendi" : "Listeden kaldırıldı");
            } else {
                toast.error(result.error || "Bir hata oluştu");
            }
        });
    };

    const currentConfig = status ? statusConfig[status] : null;

    const containerClasses = cn(
        "flex items-center justify-center rounded-full border transition-all duration-300 backdrop-blur-sm",
        variant === "hero" && "w-12 h-12",
        variant === "card" && "w-8 h-8",
        variant === "featured" && "w-10 h-10 rounded-xl",
        currentConfig
            ? `${currentConfig.bgColor} ${currentConfig.borderColor}`
            : cn(
                "bg-white/5 border-white/20 hover:bg-white/10 hover:border-primary/50",
                variant === "featured" && "bg-white/5 border-white/10 hover:bg-white/10"
            )
    );

    const iconClasses = cn(
        variant === "hero" && "w-6 h-6",
        variant === "card" && "w-4 h-4",
        variant === "featured" && "w-6 h-6"
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none group" onClick={(e) => e.preventDefault()} aria-label={status ? "İzleme durumunu değiştir" : "Listeye ekle"}>
                <div className={containerClasses}>
                    {currentConfig ? (
                        <currentConfig.icon className={cn(
                            variant === "hero" && "w-5 h-5",
                            variant === "card" && "w-3.5 h-3.5",
                            variant === "featured" && "w-5 h-5",
                            currentConfig.color
                        )} />
                    ) : (
                        <Plus className={cn(iconClasses, "text-white group-hover:text-primary transition-colors")} />
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align={variant === "featured" ? "center" : "start"}
                side={variant === "card" ? "top" : "bottom"}
                className="w-56 bg-[#1a1f2e]/95 backdrop-blur-xl border-white/10 text-white p-2 shadow-2xl rounded-xl animate-in fade-in zoom-in-95 duration-200 z-[60]"
                onClick={(e) => e.stopPropagation()}
            >
                <DropdownMenuLabel className="text-xs font-normal text-white/50 mb-2 px-2 uppercase tracking-wider">
                    Listeye Ekle
                </DropdownMenuLabel>

                <div className="space-y-1">
                    {Object.entries(statusConfig).map(([key, config]) => (
                        <StatusItem
                            key={key}
                            statusKey={key}
                            config={config}
                            isSelected={status === key}
                            isPending={isPending}
                            onSelect={handleStatusChange}
                        />
                    ))}
                </div>

                {status && (
                    <>
                        <DropdownMenuSeparator className="bg-white/10 my-2" />
                        <RemoveItem isPending={isPending} onRemove={() => handleStatusChange(null)} />
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
