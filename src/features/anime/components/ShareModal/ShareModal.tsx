"use client";

import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { useModalMount } from "@/shared/hooks/useModalMount";

import ShareModalButtons from "./ShareModalButtons";
import ShareModalCopyLink from "./ShareModalCopyLink";
import ShareModalPreview from "./ShareModalPreview";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    animeTitle: string;
    episodeTitle: string;
    ogImage: string;
    shareUrl: string;
    contentType?: "anime" | "movie";
}

export default function ShareModal({
    isOpen,
    onClose,
    animeTitle,
    episodeTitle,
    ogImage,
    shareUrl,
    contentType = "anime"
}: ShareModalProps) {
    const mounted = useModalMount();

    if (!isOpen || !mounted) return null;

    const shareText = `${animeTitle} - ${episodeTitle} izle!`;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
            onClick={onClose}
        >
            <div
                className="bg-bg-dark w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-300 cursor-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button - ReportModal style */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center transition-colors border border-white/5"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    {/* Header - ReportModal style */}
                    <div className="mb-6 text-left">
                        <h2 className="text-xl font-bold font-rubik text-white mb-1">Paylaş</h2>
                        <p className="text-white/60 text-sm">
                            {animeTitle} • {episodeTitle}
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="mb-6">
                        <ShareModalPreview
                            ogImage={ogImage}
                            animeTitle={animeTitle}
                            episodeTitle={episodeTitle}
                            contentType={contentType}
                        />
                    </div>

                    {/* Share Buttons */}
                    <div className="mb-4">
                        <ShareModalButtons shareUrl={shareUrl} shareText={shareText} />
                    </div>

                    {/* Copy Link */}
                    <ShareModalCopyLink shareUrl={shareUrl} />
                </div>
            </div>
        </div>,
        document.body
    );
}
