import { Heart } from "lucide-react";

/**
 * Favoriler boş olduğunda gösterilen state component'ı
 */
export default function FavoritesEmptyState() {
    return (
        <div className="py-20 text-center flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Henüz Favori Yok</h3>
            <p className="text-white/40">Favorilerine henüz bir anime eklenmemiş.</p>
        </div>
    );
}
