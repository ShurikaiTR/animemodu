"use client";

import { Button } from "@/shared/components/button";
import { CheckCircle, Trash2 } from "lucide-react";

interface ExistingReviewMessageProps {
    onDelete: () => void;
}

export default function ExistingReviewMessage({ onDelete }: ExistingReviewMessageProps) {
    return (
        <div className="mb-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <div>
                        <p className="text-sm font-medium text-white">Bu anime için zaten bir inceleme yazdınız</p>
                        <p className="text-xs text-white/50 mt-0.5">Her anime için yalnızca bir inceleme yazabilirsiniz</p>
                    </div>
                </div>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDelete}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Sil ve Yeniden Yaz
                </Button>
            </div>
        </div>
    );
}
