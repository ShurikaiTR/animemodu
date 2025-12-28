import { Calendar, MapPin, Heart } from "lucide-react";

interface ProfileInfoPillsProps {
    age?: string | null;
    location?: string | null;
    joinDate?: string;
}

export default function ProfileInfoPills({ age, location, joinDate }: ProfileInfoPillsProps) {
    return (
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 pt-2">
            {age && (
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/[0.03] border border-white/[0.05] rounded-full text-xs sm:text-xs font-semibold text-text-main/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]" />
                    {age} Yaşında
                </div>
            )}
            {location && (
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/[0.03] border border-white/[0.05] rounded-full text-xs sm:text-xs font-semibold text-text-main/40">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary/60" />
                    {location}
                </div>
            )}
            {joinDate && (
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/[0.03] border border-white/[0.05] rounded-full text-xs sm:text-xs font-semibold text-text-main/40">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary/60" />
                    {joinDate} tarihinde katıldı
                </div>
            )}
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/[0.03] border border-white/[0.05] rounded-full text-xs sm:text-xs font-semibold text-text-main/40">
                <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-500/60" />
                Waifu: Makima
            </div>
        </div>
    );
}
