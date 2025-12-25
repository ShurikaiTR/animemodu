"use client";

import { createPortal } from "react-dom";
import { useModalMount } from "@/hooks/useModalMount";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { REPORT_REASONS } from "./ReportReasons";
import { useReportModal } from "./useReportModal";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    animeTitle: string;
    episodeTitle: string;
    animeId: number;
    seasonNumber?: number;
    episodeNumber?: number;
}

export default function ReportModal({ isOpen, onClose, animeTitle, episodeTitle, animeId, seasonNumber, episodeNumber }: ReportModalProps) {
    const mounted = useModalMount();
    const {
        selectedReason,
        setSelectedReason,
        description,
        setDescription,
        isSubmitting,
        handleSubmit
    } = useReportModal({ isOpen, animeId, seasonNumber, episodeNumber, onClose });

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
            onClick={onClose}
        >
            <div
                className="bg-bg-dark w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-300 cursor-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center transition-colors border border-white/5"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <div className="mb-6 text-left">
                        <h2 className="text-xl font-bold font-rubik text-white mb-1">Hata Bildir</h2>
                        <p className="text-white/60 text-sm">
                            {animeTitle} • {episodeTitle}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            {REPORT_REASONS.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedReason(item.id)}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200",
                                        selectedReason === item.id
                                            ? "bg-primary/20 border-primary text-primary"
                                            : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10 hover:text-white"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-xs font-semibold">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/40 uppercase">Açıklama</label>
                            <Textarea
                                placeholder="Detaylar..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-24 resize-none"
                            />
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !selectedReason}
                            className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl h-11 font-bold mt-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Gönderiliyor
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Gönder
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
