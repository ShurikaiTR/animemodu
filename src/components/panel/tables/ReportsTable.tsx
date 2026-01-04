"use client";

import { Flag } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteReport,updateReportStatus } from "@/features/reports/actions";
import type { ReportWithDetails } from "@/shared/types/helpers";

import { ReportTableRow } from "./ReportTableRow";

interface ReportsTableProps {
    items: ReportWithDetails[];
}

export function ReportsTable({ items }: ReportsTableProps) {
    const [_isPending, startTransition] = useTransition();

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
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50 w-32">İşlemler</th>
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
                                <ReportTableRow
                                    key={item.id}
                                    item={item}
                                    onUpdateStatus={handleUpdateStatus}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
