
"use client";

import Link from "next/link";
import { Button } from "@/shared/components/button";
import { ChevronLeft, ChevronRight, Share2, Flag } from "lucide-react";

interface WatchControlsProps {
    prevEpisodeUrl: string | null;
    nextEpisodeUrl: string | null;
    onShare: () => void;
    onReport: () => void;
}

export default function WatchControls({
    prevEpisodeUrl,
    nextEpisodeUrl,
    onShare,
    onReport
}: WatchControlsProps) {
    return (
        <div className="flex items-center justify-between p-2 sm:p-3 rounded-2xl bg-bg-secondary/80 backdrop-blur-xl border border-white/5 shadow-xl relative z-[20]">
            {/* Navigation Group */}
            <div className="flex items-center gap-2">
                {prevEpisodeUrl ? (
                    <Link href={prevEpisodeUrl}>
                        <Button
                            variant="ghost"
                            aria-label="Önceki bölüme git"
                            className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white hover:text-primary rounded-xl h-10 px-4 sm:px-5 transition-all duration-300 group"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden sm:inline font-medium">Önceki Bölüm</span>
                        </Button>
                    </Link>
                ) : (
                    <Button variant="ghost" disabled className="bg-white/5 border border-white/5 text-white/10 rounded-xl h-10 px-4 sm:px-5">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline font-medium">Önceki Bölüm</span>
                    </Button>
                )}

                {nextEpisodeUrl ? (
                    <Link href={nextEpisodeUrl}>
                        <Button
                            aria-label="Sonraki bölüme git"
                            className="bg-primary hover:bg-primary-hover text-white hover:scale-[1.02] border-none rounded-xl h-10 px-4 sm:px-6 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(47,128,237,0.4)] group"
                        >
                            <span className="hidden sm:inline font-bold">Sonraki Bölüm</span>
                            <span className="sm:hidden font-bold">İleri</span>
                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                ) : (
                    <Button variant="ghost" disabled className="bg-white/5 border border-white/5 text-white/10 rounded-xl h-10 px-4 sm:px-6">
                        <span className="hidden sm:inline font-medium">Sonraki Bölüm</span>
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>

            {/* Tools Group */}
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    onClick={onShare}
                    aria-label="Bu bölümü paylaş"
                    className="gap-2 text-text-main/80 hover:text-primary hover:bg-primary/10 rounded-xl h-10 px-4 transition-all duration-300"
                >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline font-medium">Paylaş</span>
                </Button>

                <Button
                    variant="ghost"
                    onClick={onReport}
                    aria-label="Hata bildir"
                    className="gap-2 text-text-main/80 hover:text-red-500 hover:bg-red-500/10 rounded-xl h-10 px-4 transition-all duration-300"
                >
                    <Flag className="w-4 h-4" />
                    <span className="hidden sm:inline font-medium">Bildir</span>
                </Button>
            </div>
        </div>
    );
}
