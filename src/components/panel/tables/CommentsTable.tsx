"use client";

import { MessageSquare } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteCommentAction } from "@/features/comments/actions/comment-actions";
import { deleteReviewAction } from "@/features/reviews/actions/review-actions";

import { InteractionTableRow } from "./CommentsTable/InteractionTableRow";
import type { InteractionItem, InteractionType } from "./CommentsTable/types";

interface CommentsTableProps {
    items: InteractionItem[];
}

export function CommentsTable({ items }: CommentsTableProps) {
    const [_isPending, startTransition] = useTransition();

    const handleDelete = async (id: string, type: InteractionType) => {
        if (!confirm("Bu içeriği silmek istediğinize emin misiniz?")) return;

        startTransition(async () => {
            const action = type === "comment" ? deleteCommentAction : deleteReviewAction;
            const result = await action(id);

            if (result.success) {
                toast.success("İçerik başarıyla silindi");
            } else {
                toast.error(result.error || "Silme işlemi başarısız");
            }
        });
    };

    return (
        <div className="bg-bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="flex items-center gap-3 text-white text-lg font-bold font-rubik">
                    <MessageSquare className="w-5 h-5 text-primary" /> Yorumlar ve İncelemeler
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50 w-24">Tip</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50">İçerik</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Kullanıcı</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50">İçerik (Anime)</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Tarih</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr className="border-b border-white/5 hover:bg-transparent">
                                <td colSpan={6} className="p-4 align-middle h-24 text-center text-white/50">
                                    Henüz hiç yorum veya inceleme yok.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <InteractionTableRow key={`${item.type}-${item.id}`} item={item} onDelete={handleDelete} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export type { InteractionItem, InteractionType } from "./CommentsTable/types";
