"use client";

interface SpoilerContentProps {
    content: string;
    onReveal: () => void;
}

export default function SpoilerContent({ content, onReveal }: SpoilerContentProps) {
    return (
        <div className="relative rounded-xl bg-bg-main/60 backdrop-blur-sm border border-primary/10 min-h-[100px] overflow-hidden">
            <p className="text-sm leading-relaxed text-white/70 blur-lg opacity-30 select-none p-4">{content}</p>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[var(--shadow-primary-glow-sm)]" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">Spoiler İçerik</span>
                </div>
                <button onClick={onReveal} className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 text-xs font-medium text-white/60 hover:text-white transition-all">
                    Göster
                </button>
            </div>
        </div>
    );
}
