/**
 * Watch list boş olduğunda gösterilen state component'ı
 */
export default function WatchListEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Henüz içerik yok</h3>
            <p className="text-white/50">Bu listeye henüz bir anime eklenmemiş.</p>
        </div>
    );
}
