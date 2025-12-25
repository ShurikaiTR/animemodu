"use client";

import { useEffect } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-bg-main font-rubik text-text-main">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--color-grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-grid-line)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_800px_at_50%_200px,var(--color-grid-radial),transparent)]" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
                {/* Franky Image with Glow Effect */}
                <div className="relative mb-0">
                    {/* Background Glow Effect - Orange/Yellow for Franky */}
                    <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-b from-error-glow/50 to-transparent scale-110" />

                    {/* Ground Glow - Orange */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-6 bg-error-glow/30 blur-2xl rounded-full" />

                    {/* Ground Shadow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-4 bg-black/50 blur-xl rounded-full" />

                    <div className="relative h-[420px] w-[420px] sm:h-[575px] sm:w-[575px] drop-shadow-2xl">
                        <Image
                            src="/img/500/franky.webp"
                            alt="Franky - 500"
                            fill
                            sizes="(max-width: 640px) 420px, 575px"
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                <h1 className="mb-4 text-2xl font-bold text-text-heading sm:text-4xl font-manrope">
                    SÜPEEERRR Bir Hata Oluştu!
                </h1>

                <p className="mb-10 max-w-md text-base sm:text-lg text-gray-400 font-inter leading-relaxed">
                    Sunucu motorları biraz hararet yaptı. Franky şu an ana dişlileri ve kabloları kontrol ediyor.
                    Merak etme, gemiyi batırmayız!
                </p>

                <Button
                    onClick={reset}
                    size="lg"
                    className="group h-14 px-8 rounded-2xl text-base font-semibold bg-danger hover:bg-danger/90 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.6)] active:translate-y-0 active:shadow-none transition-all duration-300"
                >
                    <RotateCcw className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-rotate-45" />
                    Sistemi Yenile
                </Button>
            </div>
        </div>
    );
}
