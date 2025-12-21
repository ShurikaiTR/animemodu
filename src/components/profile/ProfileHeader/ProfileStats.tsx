interface ProfileStatsProps {
    followers: string;
    following: string;
}

export default function ProfileStats({ followers, following }: ProfileStatsProps) {
    return (
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 py-1">
            <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-bold text-white leading-none">{followers || "0"}</span>
                <span className="text-xs uppercase tracking-widest text-text-main/40 font-bold">Followers</span>
            </div>
            <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-bold text-white leading-none">{following || "0"}</span>
                <span className="text-xs uppercase tracking-widest text-text-main/40 font-bold">Following</span>
            </div>
            <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-bold text-white leading-none">0</span>
                <span className="text-xs uppercase tracking-widest text-text-main/40 font-bold">Reviews</span>
            </div>
        </div>
    );
}
