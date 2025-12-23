"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

import type { ReportWithDetails } from "@/types/helpers";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/tmdb";
import { getStatusBadge, getReasonLabel, getAnimeTitle } from "./ReportsTableHelpers";

interface ReportTableRowProps {
    item: ReportWithDetails;
    onUpdateStatus: (id: string, status: 'resolved' | 'dismissed') => void;
    onDelete: (id: string) => void;
}

export function ReportTableRow({ item, onUpdateStatus, onDelete }: ReportTableRowProps) {
    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
            <td className="p-4 align-middle">{getStatusBadge(item.status)}</td>
            <td className="p-4 align-middle">
                <div className="flex items-center gap-3">
                    {item.anime?.poster_path && (
                        <div className="w-8 h-12 relative rounded overflow-hidden shrink-0">
                            <Image
                                src={getImageUrl(item.anime.poster_path, "w200")}
                                alt={getAnimeTitle(item)}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-white truncate max-w-52" title={item.anime?.title || ""}>
                            {getAnimeTitle(item)}
                        </span>
                        {(item.season_number || item.episode_number) && (
                            <span className="text-xs text-white/50">
                                {item.season_number ? `${item.season_number}. Sezon ` : ''}
                                {item.episode_number ? `${item.episode_number}. Bölüm` : ''}
                            </span>
                        )}
                    </div>
                </div>
            </td>
            <td className="p-4 align-middle">
                <span className="text-sm text-white/90">{getReasonLabel(item.reason)}</span>
            </td>
            <td className="p-4 align-middle">
                <p className="text-sm text-white/70 max-w-64 truncate" title={item.description || ""}>
                    {item.description || "-"}
                </p>
            </td>
            <td className="p-4 align-middle">
                {item.user ? (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 relative">
                            {item.user.avatar_url ? (
                                <Image src={item.user.avatar_url} alt={item.user.username} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-white/50">
                                    {item.user.username[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span className="text-sm text-white/80">{item.user.username}</span>
                    </div>
                ) : (
                    <span className="text-xs text-white/40 italic">Anonim</span>
                )}
            </td>
            <td className="p-4 align-middle">
                <span className="text-xs text-white/50 whitespace-nowrap" title={new Date(item.created_at).toLocaleString('tr-TR')}>
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: tr })}
                </span>
            </td>
            <td className="p-4 align-middle">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.status === 'pending' && (
                        <>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                onClick={() => onUpdateStatus(String(item.id), 'resolved')}
                                title="Çözüldü işaretle"
                            >
                                <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                onClick={() => onUpdateStatus(String(item.id), 'dismissed')}
                                title="Reddet"
                            >
                                <XCircle className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white/40 hover:text-red-500 hover:bg-white/5"
                        onClick={() => onDelete(String(item.id))}
                        title="Sil"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}
