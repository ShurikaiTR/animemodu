"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/button";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-bg-main font-rubik text-text-main">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--color-grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-grid-line)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_800px_at_50%_200px,var(--color-grid-radial),transparent)]" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
                {/* Zoro Image with Glow Effect */}
                <div className="relative mb-4">
                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-b from-primary/50 to-transparent scale-110" />

                    {/* Ground Glow - Blue */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-6 bg-primary/30 blur-2xl rounded-full" />

                    {/* Ground Shadow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-4 bg-black/50 blur-xl rounded-full" />

                    <div className="relative h-80 w-80 sm:h-[440px] sm:w-[440px] drop-shadow-2xl">
                        <Image
                            src="/img/404/zoro.webp"
                            alt="Zoro - 404"
                            fill
                            sizes="(max-width: 640px) 320px, 440px"
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                <h2 className="mb-4 text-2xl font-bold text-text-heading sm:text-4xl font-manrope">
                    Yine Yanlış Tarafa Saptık...
                </h2>

                <p className="mb-10 max-w-md text-base sm:text-lg text-gray-400 font-inter leading-relaxed">
                    Zoro&apos;nun eline teknolojik harita bile versek sonuç değişmiyor.
                    Aradığın sayfa Grand Line&apos;ın bilinmeyen bir köşesinde kayboldu.
                </p>

                <Button asChild size="lg" className="group h-14 px-8 rounded-2xl text-base font-semibold hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(47,128,237,0.6)] active:translate-y-0 active:shadow-none transition-all duration-300">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                        Rotayı Düzelt
                    </Link>
                </Button>
            </div>
        </div>
    );
}