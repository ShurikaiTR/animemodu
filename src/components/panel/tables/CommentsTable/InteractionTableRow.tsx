"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageSquare, Star, Trash2, Eye, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/button";
import { Badge } from "@/shared/components/badge";
import { cn } from "@/shared/lib/utils";
import type { InteractionItem, InteractionType } from "./types";
import { ViewContentModal } from "./ViewContentModal";

interface InteractionTableRowProps {
    item: InteractionItem;
    onDelete: (id: string, type: InteractionType) => void;
}

export function InteractionTableRow({ item, onDelete }: InteractionTableRowProps) {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    return (
        <>
            <tr key={`${item.type}-${item.id}`} className="border-b border-white/5 hover:bg-white/5 group transition-colors">
                <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                        {item.type === "review" ? (
                            <Badge variant="purple">
                                <Star className="w-3 h-3 mr-1 fill-current" /> İnceleme
                            </Badge>
                        ) : (
                            <Badge variant="default">
                                <MessageSquare className="w-3 h-3 mr-1" /> Yorum
                            </Badge>
                        )}
                        {item.rating && (
                            <Badge variant="gray">
                                {item.rating}/10
                            </Badge>
                        )}
                    </div>
                </td>
                <td className="p-4 align-middle">
                    <div className="space-y-1">
                        <p className={cn("text-sm text-white/90", item.is_spoiler && "blur-sm hover:blur-none transition-all duration-300 cursor-pointer")}>
                            {item.content.length > 30 ? `${item.content.slice(0, 30)}...` : item.content}
                        </p>
                        {item.is_spoiler && (
                            <span className="text-xs text-red-400 font-bold uppercase tracking-wider">Spoiler</span>
                        )}
                    </div>
                </td>
                <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 relative">
                            {item.user?.avatar_url ? (
                                <Image
                                    src={item.user.avatar_url}
                                    alt={item.user.username || "User"}
                                    fill
                                    sizes="36px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white/50">
                                    {item.user?.username?.[0]?.toUpperCase() || "?"}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white flex items-center gap-1">
                                {item.user?.username || "Anonim"}
                                {item.user?.role === "admin" && <ShieldCheck className="w-3 h-3 text-primary" />}
                            </p>
                        </div>
                    </div>
                </td>
                <td className="p-4 align-middle">
                    {item.anime ? (
                        <Link href={`/anime/${item.anime.slug}`} target="_blank" className="text-sm font-medium text-primary hover:underline">
                            {item.anime.title}
                        </Link>
                    ) : (
                        <span className="text-sm text-white/30">Silinmiş İçerik</span>
                    )}
                </td>
                <td className="p-4 align-middle">
                    <span className="text-xs text-white/50 whitespace-nowrap">
                        {format(new Date(item.created_at), "d MMM yyyy", { locale: tr })}
                    </span>
                </td>
                <td className="p-4 align-middle">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/5"
                            title="Görüntüle"
                            onClick={() => setIsViewModalOpen(true)}
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-400/10"
                            title="Sil"
                            onClick={() => onDelete(item.id, item.type)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </td>
            </tr>

            <ViewContentModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                item={item}
            />
        </>
    );
}
