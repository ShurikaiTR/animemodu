"use client";

import { createPortal } from "react-dom";
import { X, MessageSquare, Star, ThumbsUp } from "lucide-react";
import { useModalMount } from "@/hooks/useModalMount";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Image from "next/image";
import type { InteractionItem } from "./types";

interface ViewContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: InteractionItem | null;
}

export function ViewContentModal({ isOpen, onClose, item }: ViewContentModalProps) {
    const mounted = useModalMount();

    if (!isOpen || !mounted || !item) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
            onClick={onClose}
        >
            <div
                className="bg-bg-dark w-full max-w-lg rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-300 cursor-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center transition-colors border border-white/5"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border ${item.type === "review" ? "bg-purple-500/10 border-purple-500/20" : "bg-primary/10 border-primary/20"}`}>
                            {item.type === "review" ? (
                                <Star className="w-8 h-8 text-purple-400 fill-current" />
                            ) : (
                                <MessageSquare className="w-8 h-8 text-primary" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white font-rubik mb-1">
                                {item.type === "review" ? "İnceleme" : "Yorum"}
                            </h2>
                            <div className="flex items-center gap-2 flex-wrap">
                                {item.rating && (
                                    <Badge variant="gray" className="text-xs">
                                        {item.rating}/10
                                    </Badge>
                                )}
                                {item.is_spoiler && (
                                    <span className="text-xs text-red-400 font-bold uppercase tracking-wider bg-red-400/10 px-2 py-0.5 rounded">
                                        Spoiler
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/20 relative shrink-0">
                            {item.user?.avatar_url ? (
                                <Image
                                    src={item.user.avatar_url}
                                    alt={item.user.username || "User"}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary">
                                    {item.user?.username?.[0]?.toUpperCase() || "?"}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{item.user?.username || "Anonim"}</p>
                            <p className="text-xs text-white/50">{format(new Date(item.created_at), "d MMMM yyyy, HH:mm", { locale: tr })}</p>
                        </div>
                        {typeof item.likes_count === "number" && (
                            <div className="flex items-center gap-1.5 text-sm text-primary">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{item.likes_count}</span>
                            </div>
                        )}
                    </div>

                    {/* Anime */}
                    {item.anime && (
                        <p className="text-sm text-white/60 mb-4">
                            <span className="text-primary font-medium">{item.anime.title}</span> için yazıldı
                        </p>
                    )}

                    {/* Content */}
                    <div className="text-white/90 leading-relaxed break-words">
                        {item.content}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
