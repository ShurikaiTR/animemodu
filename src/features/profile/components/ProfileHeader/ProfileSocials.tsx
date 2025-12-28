import { Twitter, Instagram, MessageSquare, Star } from "lucide-react";

export default function ProfileSocials() {
    return (
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.05] p-1 rounded-xl">
            <button className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-white/20 hover:text-white">
                <Twitter className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-white/20 hover:text-white">
                <Instagram className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-white/20 hover:text-white">
                <MessageSquare className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-white/20 hover:text-white">
                <Star className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
        </div>
    );
}
