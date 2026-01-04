"use client";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Eye,MoreHorizontal, ShieldCheck, Trash2 } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu";

import type { UserItem } from "./types";

interface UserTableRowProps {
    item: UserItem;
    onDelete: (id: string) => void;
}

export function UserTableRow({ item, onDelete }: UserTableRowProps) {
    return (
        <tr className="border-b border-white/5 hover:bg-white/5 group transition-colors">
            <td className="p-4 align-middle">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 relative">
                        {item.avatar_url ? (
                            <Image
                                src={item.avatar_url}
                                alt={item.username || "User"}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white/50">
                                {item.username?.[0]?.toUpperCase() || "?"}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white flex items-center gap-1.5">
                            {item.username || "Anonim"}
                        </p>
                        {item.full_name && (
                            <p className="text-xs text-white/50">{item.full_name}</p>
                        )}
                    </div>
                </div>
            </td>
            <td className="p-4 align-middle">
                {item.role === "admin" ? (
                    <Badge variant="default" className="flex w-fit items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Yönetici
                    </Badge>
                ) : (
                    <Badge variant="default">
                        Kullanıcı
                    </Badge>
                )}
            </td>
            <td className="p-4 align-middle">
                <span className="text-xs text-white/50 whitespace-nowrap">
                    {format(new Date(item.created_at), "d MMMM yyyy", { locale: tr })}
                </span>
            </td>
            <td className="p-4 align-middle">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-bg-dropdown border-white/10 text-white">
                        <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" /> Profili Gör
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="focus:bg-white/10 cursor-pointer text-red-400 focus:text-red-400"
                            onClick={() => onDelete(item.id)}
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Sil
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    );
}

