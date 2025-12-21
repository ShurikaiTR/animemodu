
"use client";

import { Flag, CheckCircle, XCircle, Trash2, Clock } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import type { ReportWithDetails } from "@/types/helpers";
import { updateReportStatus, deleteReport } from "@/actions/interactions/report";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/tmdb";

interface ReportsTableProps {
    items: ReportWithDetails[];
}

export function ReportsTable({ items }: ReportsTableProps) {
    const [isPending, startTransition] = useTransition();

    const handleUpdateStatus = (id: string, status: 'resolved' | 'dismissed') => {
        startTransition(async () => {
            const result = await updateReportStatus(id, status);
            if (result.success) {
                toast.success(`Bildirim durumu güncellendi: ${status === 'resolved' ? 'Çözüldü' : 'Reddedildi'}`);
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Bu bildirimi silmek istediğinize emin misiniz?")) return;

        startTransition(async () => {
            const result = await deleteReport(id);
            if (result.success) {
                toast.success("Bildirim silindi.");
            } else {
                toast.error(result.error);
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'resolved':
                return <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">Çözüldü</span>;
            case 'dismissed':
                return <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-500 text-xs font-medium border border-red-500/20">Reddedildi</span>;
            default:
                return <span className="px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-xs font-medium border border-yellow-500/20">Beklemede</span>;
        }
    };

    const getReasonLabel = (reason: string) => {
        const reasons: Record<string, string> = {
            'playback': 'Video Açılmıyor',
            'audio': 'Ses Sorunu',
            'subtitle': 'Altyazı Hatalı',
            'wrong': 'Yanlış Bölüm'
        };
        return reasons[reason] || reason;
    };

    return (
        <div className="bg-bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="flex items-center gap-3 text-white text-lg font-bold font-rubik">
                    <Flag className="w-5 h-5 text-primary" /> Bildirimler
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Durum</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Anime/Bölüm</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Sorun</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Açıklama</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Kullanıcı</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Tarih</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50 w-[120px]">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr className="border-b border-white/5 hover:bg-transparent">
                                <td colSpan={7} className="p-4 align-middle h-24 text-center text-white/50">
                                    Henüz hiç bildirim yok.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="p-4 align-middle">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            {item.anime?.poster ? (
                                                <div className="w-8 h-12 relative rounded overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={getImageUrl(item.anime.poster, "w92")}
                                                        alt={item.anime_title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : null}
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-medium text-white truncate max-w-[200px]" title={item.anime_title}>
                                                    {item.anime_title}
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
                                        <p className="text-sm text-white/70 max-w-[250px] truncate" title={item.description || ""}>
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
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-white/50">
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
                                                        onClick={() => handleUpdateStatus(item.id, 'resolved')}
                                                        title="Çözüldü işaretle"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                        onClick={() => handleUpdateStatus(item.id, 'dismissed')}
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
                                                onClick={() => handleDelete(item.id)}
                                                title="Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
