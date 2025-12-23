"use client";

import { useEffect } from "react";
import { RotateCcw, ShieldAlert, ZapOff, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";
import { logError } from "@/lib/errors";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        logError("GlobalErrorBoundary", error);
    }, [error]);

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden p-4">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-black to-black opacity-80" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,white/5_1px,transparent_1px),linear-gradient(to_bottom,white/5_1px,transparent_1px)]                 bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_70%,transparent_100%)]" />

                <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    <div className="relative order-1 lg:order-2 flex justify-center lg:justify-start">
                        <div className="relative w-72 h-72 sm:w-96 sm:h-96 animate-in fade-in zoom-in duration-1000 slide-in-from-right-10">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/20 rounded-full blur-3xl animate-pulse" />
                            <div className="relative w-full h-full flex items-center justify-center">
                                <ZapOff className="w-32 h-32 sm:w-40 sm:h-40 text-primary drop-shadow-[var(--shadow-primary-glow)] animate-pulse" />
                            </div>
                            <div className="absolute -left-4 top-20 bg-black/40 backdrop-blur-md border border-primary/30 p-4 rounded-xl animate-bounce shadow-lg hidden sm:block">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                    <span className="text-xs text-primary font-mono">SYSTEM_CRITICAL</span>
                                </div>
                                <p className="text-white font-bold text-sm">VERİ AKIŞI KESİLDİ</p>
                            </div>
                        </div>
                    </div>

                    <div className="order-2 lg:order-1 text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000 delay-200">
                        <div className="relative inline-block">
                            <h1 className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 font-rubik leading-none select-none">
                                HATA
                            </h1>
                            <div className="absolute -top-1 -left-1 w-full h-full text-8xl sm:text-9xl font-black text-white/10 font-rubik leading-none select-none animate-pulse blur-sm">
                                HATA
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-5xl font-bold text-white font-rubik leading-tight">
                                Sistem Aşırı Yüklendi!
                            </h2>
                            <p className="text-text-main text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Anime evreninde beklenmedik bir yırtılma tespit edildi. Çekirdek sistemler yanıt vermiyor.
                            </p>

                            <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20 text-left backdrop-blur-sm">
                                <p className="text-xs text-primary font-mono mb-1 uppercase tracking-widest opacity-70">Hata Raporu</p>
                                <p className="text-sm text-text-main font-mono break-words overflow-wrap-anywhere">
                                    {error.message || "Bilinmeyen bir hata oluştu."}
                                </p>
                                {error.digest && (
                                    <p className="text-xs text-primary/60 font-mono mt-2 pt-2 border-t border-primary/10">
                                        ID: {error.digest}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 pt-4">
                            <Button
                                onClick={reset}
                                className="w-full sm:w-auto"
                            >
                                <RotateCcw className="mr-2 h-5 w-5" />
                                Sistemi Yeniden Başlat
                            </Button>

                            <BackButton />
                        </div>

                        <div className="pt-8 border-t border-white/5 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-xs font-mono text-text-main/60">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <ShieldAlert className="w-4 h-4 text-primary animate-pulse shrink-0" />
                                <span>GÜVENLİK: İHLAL</span>
                            </div>
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <Activity className="w-4 h-4 text-primary shrink-0" />
                                <span>ÇEKİRDEK: DENGESİZ</span>
                            </div>
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <div className="w-2 h-2 rounded-full bg-primary animate-ping shrink-0" />
                                <span>BAĞLANTI: KOPTU</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

