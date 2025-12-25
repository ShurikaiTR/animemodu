"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-bg-main font-rubik text-text-main">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_800px_at_50%_200px,#1a1f2e,transparent)]" />

            {/* Content */}
            <div className="relative z-10 flex max-w-lg flex-col items-center justify-center px-4 text-center">


                <div className="relative mb-2">
                    <h1 className="text-[150px] sm:text-[220px] font-extrabold text-text-heading tracking-tighter font-manrope leading-none">
                        404
                    </h1>
                    {/* SVG overlay positioned over the 0 */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 sm:h-52 sm:w-52 z-10">
                        <Image
                            src="/img/Adsız tasarım.svg"
                            alt="Luffy"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                <h2 className="mb-6 text-2xl font-bold text-text-heading sm:text-3xl">
                    Ups, sanırım kaybolduk...
                </h2>

                <p className="mb-8 max-w-md text-base text-gray-400 font-inter leading-relaxed">
                    Aradığın sayfayı bulamadık. Belki de yayından kaldırıldı veya hiç var olmadı.
                    Hadi seni tanıdık bir yere geri götürelim.
                </p>

                <Button asChild size="lg" className="group h-12 rounded-xl text-sm hover:-translate-y-0.5 hover:shadow-[0_0_20px_-5px_rgba(47,128,237,0.5)] active:translate-y-0 active:shadow-none">
                    <Link href="/">
                        <ArrowLeft className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                        Eve Dön
                    </Link>
                </Button>
            </div>
        </div>
    );
}
