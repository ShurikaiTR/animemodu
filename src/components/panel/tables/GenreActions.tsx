"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/button";

interface GenreActionsProps {
    genreName: string;
    isEditing: boolean;
    onEdit: (name: string) => void;
    onDelete: (name: string) => void;
}

export function GenreActions({ genreName, isEditing, onEdit, onDelete }: GenreActionsProps) {
    if (isEditing) return null;

    return (
        <div className="flex items-center gap-1">
            <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white/40 hover:text-primary hover:bg-white/5"
                onClick={() => onEdit(genreName)}
                title="Düzenle"
            >
                <Pencil className="w-4 h-4" />
            </Button>
            <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white/40 hover:text-red-500 hover:bg-white/5"
                onClick={() => onDelete(genreName)}
                title="Sil"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    );
}
