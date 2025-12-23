"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GenreInlineEditProps {
    value: string;
    onChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
    isPending: boolean;
}

export function GenreInlineEdit({ value, onChange, onSave, onCancel, isPending }: GenreInlineEditProps) {
    return (
        <div className="flex items-center gap-2">
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-9 bg-bg-main border-white/10 w-48"
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSave();
                    if (e.key === "Escape") onCancel();
                }}
            />
            <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                onClick={onSave}
                disabled={isPending}
            >
                <Check className="w-4 h-4" />
            </Button>
            <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/5"
                onClick={onCancel}
            >
                <X className="w-4 h-4" />
            </Button>
        </div>
    );
}
