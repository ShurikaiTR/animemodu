import Image from "next/image";

export default function MaintenancePage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-bg-main font-rubik text-text-main">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--color-grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-grid-line)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_800px_at_50%_200px,var(--color-maintenance-glow),transparent)]" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
                {/* Usopp Image with Amber Glow Effect */}
                <div className="relative mb-4">
                    {/* Background Glow Effect - Amber */}
                    <div className="absolute inset-0 scale-110 bg-gradient-to-b from-maintenance/50 to-transparent opacity-30 blur-3xl" />

                    {/* Ground Glow - Amber */}
                    <div className="absolute -bottom-2 left-1/2 h-6 w-48 -translate-x-1/2 rounded-full bg-maintenance/30 blur-2xl sm:w-64" />

                    {/* Ground Shadow */}
                    <div className="absolute -bottom-1 left-1/2 h-4 w-40 -translate-x-1/2 rounded-full bg-black/50 blur-xl sm:w-56" />

                    <div className="relative h-80 w-80 drop-shadow-2xl sm:h-[28rem] sm:w-[28rem]">
                        <Image
                            src="/img/maintenance/usopp.webp"
                            alt="Usopp - Bakım Modu"
                            fill
                            sizes="(max-width: 640px) 320px, 440px"
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                <h1 className="mb-4 text-2xl font-bold text-text-heading font-manrope sm:text-4xl">
                    Taktiksel Geliştirme Molası
                </h1>

                <p className="mb-8 max-w-md text-base text-text-main/60 font-inter leading-relaxed sm:text-lg">
                    Daha iyi bir deneyim için kısa bir süreliğine bakımdayız.
                    Keskin nişancı hassasiyetiyle ince ayar yapıyoruz.
                </p>

                {/* Progress Bar */}
                <div className="w-full max-w-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-main/50 font-inter">İlerleme</span>
                        <span className="text-sm font-semibold text-maintenance">%85 Tamamlandı</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full border border-white/5 bg-white/10 backdrop-blur-sm">
                        <div
                            className="relative h-full rounded-full bg-gradient-to-r from-maintenance to-maintenance-light"
                            style={{ width: "85%" }}
                        >
                            {/* Shine effect */}
                            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
