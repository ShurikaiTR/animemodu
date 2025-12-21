
interface RatingBadgeProps {
    rating: number;
}

export function RatingBadge({ rating }: RatingBadgeProps) {
    return (
        <div className="absolute top-3 right-3">
            <div className="relative w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-xl">
                <svg viewBox="0 0 36 36" className="w-full h-full text-primary -rotate-90">
                    <path
                        className="text-primary/20"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        className="text-current drop-shadow-[0_0_6px_rgba(var(--primary),0.5)]"
                        strokeDasharray={`${rating * 10}, 100`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {rating.toFixed(1)}
                </div>
            </div>
        </div>
    );
}
