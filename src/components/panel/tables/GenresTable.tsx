"use client";

import { useState, useTransition } from "react";
import { Tags } from "lucide-react";
import { toast } from "sonner";
import { renameGenre, deleteGenre } from "@/features/anime/actions/genres";
import { DeleteConfirmationModal } from "@/shared/components/DeleteConfirmationModal";
import { GenreInlineEdit } from "./GenreInlineEdit";
import { GenreActions } from "./GenreActions";

export interface GenreItem {
    name: string;
    count: number;
}

interface GenresTableProps {
    items: GenreItem[];
}

export function GenresTable({ items }: GenresTableProps) {
    const [editingGenre, setEditingGenre] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [deleteGenreName, setDeleteGenreName] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleStartEdit = (name: string) => {
        setEditingGenre(name);
        setEditValue(name);
    };

    const handleCancelEdit = () => {
        setEditingGenre(null);
        setEditValue("");
    };

    const handleSaveEdit = () => {
        if (!editingGenre || !editValue.trim()) return;
        if (editValue.trim() === editingGenre) {
            handleCancelEdit();
            return;
        }

        startTransition(async () => {
            const result = await renameGenre(editingGenre, editValue.trim());
            if (result.success) {
                toast.success(`"${editingGenre}" türü "${editValue.trim()}" olarak değiştirildi.`);
                handleCancelEdit();
            } else {
                toast.error(result.error || "Tür adı değiştirilemedi.");
            }
        });
    };

    const handleDelete = () => {
        if (!deleteGenreName) return;

        startTransition(async () => {
            const result = await deleteGenre(deleteGenreName);
            if (result.success && result.data) {
                toast.success(`"${deleteGenreName}" türü ${result.data.updatedCount} animeden kaldırıldı.`);
                setDeleteGenreName(null);
            } else if (!result.success) {
                toast.error(result.error || "Tür silinemedi.");
            }
        });
    };

    return (
        <>
            <div className="bg-bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="flex items-center gap-3 text-white text-lg font-bold font-rubik">
                        <Tags className="w-5 h-5 text-primary" /> Türler
                    </h3>
                    <span className="text-xs text-white/40">{items.length} tür</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Tür Adı</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Anime Sayısı</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-white/50 w-24">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr className="border-b border-white/5 hover:bg-transparent">
                                    <td colSpan={3} className="p-4 align-middle h-24 text-center text-white/50">
                                        Henüz hiç tür yok.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.name} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="p-4 align-middle">
                                            {editingGenre === item.name ? (
                                                <GenreInlineEdit
                                                    value={editValue}
                                                    onChange={setEditValue}
                                                    onSave={handleSaveEdit}
                                                    onCancel={handleCancelEdit}
                                                    isPending={isPending}
                                                />
                                            ) : (
                                                <span className="text-white font-medium">{item.name}</span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                                                {item.count} anime
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <GenreActions
                                                genreName={item.name}
                                                isEditing={editingGenre === item.name}
                                                onEdit={handleStartEdit}
                                                onDelete={setDeleteGenreName}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={!!deleteGenreName}
                onClose={() => setDeleteGenreName(null)}
                onConfirm={handleDelete}
                isPending={isPending}
                entityType="genre"
                entityName={deleteGenreName}
            />
        </>
    );
}
