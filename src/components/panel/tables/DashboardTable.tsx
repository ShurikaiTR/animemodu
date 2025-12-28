import Link from "next/link";
import { Star, RefreshCw } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface TopItem {
  id: number;
  title: string;
  category: string;
  rating: number;
}

interface DashboardTableProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: TopItem[];
  showRating?: boolean;
}

export function DashboardTable({ title, icon: Icon, items, showRating = false }: DashboardTableProps) {
  return (
    <div className="bg-bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <h3 className="flex items-center gap-3 text-white text-lg font-bold font-rubik">
          <Icon className="w-5 h-5 text-primary" /> {title}
        </h3>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/panel/series"
            className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-widest border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
          >
            Tümünü Gör
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-wider">ID</th>
              <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-wider">Başlık</th>
              <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-wider">Kategori</th>
              <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                {showRating ? "Puan" : "Durum"}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="py-4 px-6">
                  <span className="font-mono text-sm text-white/30 group-hover:text-white/50 transition-colors">
                    #{item.id}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="text-white font-medium text-sm group-hover:text-primary transition-colors cursor-pointer max-w-48 truncate">
                    {item.title}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-md font-medium border",
                      item.category === "Film"
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    )}
                  >
                    {item.category}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  {showRating ? (
                    <div className="inline-flex items-center gap-1.5 font-bold text-sm text-white">
                      <Star className="w-3.5 h-3.5 fill-current text-yellow-500" /> {item.rating.toFixed(1)}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Yayında
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
