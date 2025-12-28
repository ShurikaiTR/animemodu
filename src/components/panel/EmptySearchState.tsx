import { Search } from "lucide-react";

interface EmptySearchStateProps {
    message?: string;
    searchQuery?: string;
}

export default function EmptySearchState({
    message = "Kayıt bulunamadı.",
    searchQuery,
}: EmptySearchStateProps) {
    return (
        <div className="col-span-full py-24 flex flex-col items-center justify-center text-text-main/20 border border-dashed border-white/5 rounded-2xl bg-bg-secondary/10">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-base font-medium">{message}</p>
            {searchQuery && (
                <p className="text-sm mt-1">Arama kriterlerini değiştirmeyi deneyin.</p>
            )}
        </div>
    );
}
