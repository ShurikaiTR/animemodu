"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { MoreHorizontal, MessageSquare, Star, Trash2, Eye, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { InteractionItem, InteractionType } from "./types";

interface InteractionTableRowProps {
    item: InteractionItem;
    onDelete: (id: number, type: InteractionType) => void;
}

export function InteractionTableRow({ item, onDelete }: InteractionTableRowProps) {
    return (
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
            <td className="p-4 align-middle max-w-[400px]">
                <div className="space-y-1">
                    <p className={cn("text-sm text-white/90 line-clamp-2", item.is_spoiler && "blur-sm hover:blur-none transition-all duration-300 cursor-pointer")}>
                        {item.content}
                    </p>
                    {item.is_spoiler && (
                        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Spoiler</span>
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-[#1a1c2e] border-white/10 text-white">
                        <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" /> Görüntüle
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-red-400 focus:text-red-400" onClick={() => onDelete(item.id, item.type)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Sil
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    );
}


