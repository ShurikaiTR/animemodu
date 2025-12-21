import { MessageCircle, Star, Loader2 } from "lucide-react";

export const EmptyComments = () => (
    <div className="py-16 text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <MessageCircle className="w-8 h-8 text-white/20" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Henüz Yorum Yok</h3>
        <p className="text-white/40">İlk yorumu sen yap ve tartışmayı başlat!</p>
    </div>
);

export const EmptyReviews = () => (
    <div className="py-16 text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Star className="w-8 h-8 text-white/20" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Henüz İnceleme Yok</h3>
        <p className="text-white/40">Bu animeyi inceleyen ilk kişi sen ol!</p>
    </div>
);

export const LoadingState = () => (
    <div className="py-16 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-white/40 text-sm">Yükleniyor...</p>
    </div>
);

export const SkeletonCard = () => (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] animate-pulse">
        <div className="flex gap-4">
            <div className="w-11 h-11 rounded-full bg-white/10" />
            <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                    <div className="h-3 w-16 bg-white/5 rounded" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-full bg-white/5 rounded" />
                    <div className="h-3 w-3/4 bg-white/5 rounded" />
                </div>
                <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 bg-white/5 rounded-lg" />
                    <div className="h-6 w-20 bg-white/5 rounded-lg" />
                </div>
            </div>
        </div>
    </div>
);
