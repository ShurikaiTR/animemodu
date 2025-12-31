import Link from "next/link";
import Image from "next/image";
import { Star, RefreshCw } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface TopItem {
  id: number;
  title: string;
  category: string;
  rating: number;
  poster_path?: string | null;
}

interface DashboardTableProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: TopItem[];
  showRating?: boolean;
}

export function DashboardTable({ title, icon: Icon, items, showRating = false }: DashboardTableProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-bg-secondary/40 border border-white/5 rounded-2xl shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between p-6 bg-white/5 border-b border-white/5">
        <h3 className="flex items-center gap-3 font-rubik text-lg font-bold text-white">
          <Icon className="w-5 h-5 text-primary" /> {title}
        </h3>
        <div className="flex items-center gap-3">
          <button className="p-2 text-white/40 rounded-lg transition-colors hover:bg-white/5 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/panel/series"
            className="px-3 py-1.5 font-rubik text-xs font-bold text-text-main/60 uppercase tracking-widest bg-white/5 border border-white/5 rounded-lg transition-all hover:text-white hover:bg-white/10"
          >
            Tümünü Gör
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="py-4 px-6 text-xs font-bold text-white/40 uppercase tracking-widest">Başlık</th>
              <th className="py-4 px-6 text-xs font-bold text-white/40 uppercase tracking-widest">Kategori</th>
              <th className="py-4 px-6 text-xs font-bold text-white/40 uppercase tracking-widest text-right">
                {showRating ? "Puan" : "Durum"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id} className="transition-colors group hover:bg-white/5">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0 w-11 h-16 overflow-hidden border border-white/5 rounded bg-bg-main">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-[10px] text-white/20">Modu</div>
                      )}
                      <div className="absolute inset-0 transition-opacity bg-black/20 opacity-0 group-hover:opacity-100" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="max-w-48 text-sm font-semibold text-white transition-colors group-hover:text-primary truncate">
                        {item.title}
                      </span>
                      <span className="font-mono text-xs text-white/30">#{item.id}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={cn(
                      "px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-md border",
                      item.category === "Film"
                        ? "bg-accent-orange/10 text-accent-orange border-accent-orange/20"
                        : "bg-primary/10 text-primary border-primary/20"
                    )}
                  >
                    {item.category}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  {showRating ? (
                    <div className="inline-flex items-center justify-end gap-1.5 text-sm font-bold text-accent-orange">
                      <Star className="w-3.5 h-3.5 fill-current" /> {item.rating.toFixed(1)}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                      YAYINDA
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
