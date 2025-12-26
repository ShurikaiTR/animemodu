"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavorite, checkFavorite } from "@/actions/profile/favorites";
import { toast } from "sonner";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

interface FavoriteButtonProps {
    animeId: string;
    initialFavorite?: boolean;
    variant?: "featured" | "card";
}

export default function FavoriteButton({ animeId, initialFavorite, variant = "featured" }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialFavorite ?? false);
    const [isPending, startTransition] = useTransition();
    const { user } = useAuth();
    const { openAuthModal } = useAuthModal();

    // Fetch user status on mount if not provided (undefined)
    useEffect(() => {
        if (!user || initialFavorite !== undefined) return;

        const syncStatus = async () => {
            const result = await checkFavorite(animeId);
            if (result.success) {
                setIsFavorite(result.isFavorite);
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
                // Sunucudan gelen gerçek durumu kullan
                setIsFavorite(result.isFavorite ?? newFavorite);
                toast.success(result.isFavorite ? "Favorilere eklendi" : "Favorilerden çıkarıldı");
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
