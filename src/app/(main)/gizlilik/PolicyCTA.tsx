import { Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/components/button";

export default function PolicyCTA() {
    return (
        <div className="relative mt-12 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 shadow-2xl">
            {/* Background Decoration */}
            <div className="absolute -right-24 -top-24 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-8 py-14 md:px-16 md:py-16 relative z-10">
                <div className="flex flex-col gap-5 text-center md:text-left max-w-xl">
                    <h2 className="text-text-main text-3xl md:text-4xl font-black leading-tight tracking-tight">
                        Sorularınız mı var?
                    </h2>
                    <p className="text-text-main/50 text-base md:text-lg font-normal leading-relaxed">
                        Gizlilik politikamız hakkında daha fazla bilgi almak veya verilerinizle ilgili
                        bir talepte bulunmak için destek ekibimizle iletişime geçebilirsiniz.
                    </p>
                </div>

                <div className="flex-shrink-0">
                    <Button asChild size="lg" className="h-16 px-10 rounded-2xl text-lg">
                        <Link href="/iletisim">
                            <Mail className="w-6 h-6" />
                            İletişime Geç
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
