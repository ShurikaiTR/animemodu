"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { checkFavorite, toggleFavorite } from "@/features/profile/actions/list-actions";
import { Button } from "@/shared/components/button";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useAuthModal } from "@/shared/contexts/AuthModalContext";

interface FavoriteButtonProps {
    animeId: string;
    initialFavorite?: boolean;
    variant?: "featured" | "card";
}

export default function FavoriteButton({ animeId, initialFavorite, variant = "featured" }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialFavorite ?? false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { user } = useAuth();
    const { openAuthModal } = useAuthModal();

    // Fetch user status on mount if not provided (undefined)
    useEffect(() => {
        if (!user || initialFavorite !== undefined) return;

        const syncStatus = async () => {
            const result = await checkFavorite(animeId);
            if (result.success && "data" in result) {
                setIsFavorite(!!(result.data as { isFavorite: boolean })?.isFavorite);
            }
        };

        syncStatus();
    }, [user, animeId, initialFavorite]);

    const handleClick = () => {
        if (!user) {
            openAuthModal("login");
            return;
        }

        const newFavorite = !isFavorite;
        setIsFavorite(newFavorite); // Optimistic update

        startTransition(async () => {
            const result = await toggleFavorite(animeId);
            if (result.success) {
                const updatedIsFavorite = (result.data as { isFavorite: boolean })?.isFavorite;
                setIsFavorite(updatedIsFavorite ?? newFavorite);
                toast.success(updatedIsFavorite ? "Favorilere eklendi" : "Favorilerden çıkarıldı");
                // Client-side router cache'i invalidate et
                router.refresh();
            } else {
                setIsFavorite(!newFavorite); // Revert
                toast.error(result.error || "Bir hata oluştu");
            }
        });
    };

    if (variant === "card") {
        return (
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClick();
                }}
                disabled={isPending}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all hover:scale-110 hover:bg-red-500/20 hover:border-red-500/50"
                aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
            >
                <Heart
                    className={`w-4 h-4 transition-colors ${isFavorite ? "text-red-500 fill-red-500" : "text-white hover:text-red-500"
                        }`}
                />
            </button>
        );
    }

    return (
        <Button
            variant="glass"
            size="icon"
            className={`group/heart rounded-xl bg-white/5 hover:bg-white/10 text-white border-white/10 ${isPending ? 'opacity-50' : ''}`}
            onClick={handleClick}
            disabled={isPending}
            aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
        >
            <Heart
                className={`w-6 h-6 transition-colors ${isFavorite
                    ? "text-red-500 fill-red-500"
                    : "group-hover/heart:text-red-500 group-hover/heart:fill-red-500"
                    }`}
            />
        </Button>
    );
}
