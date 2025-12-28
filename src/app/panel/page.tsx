import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/button";
import StatsCardsServer from "./_components/StatsCardsServer";
import TopAnimesServer from "./_components/TopAnimesServer";
import RecentAnimesServer from "./_components/RecentAnimesServer";
import { StatsSkeleton, TableSkeleton } from "./loading";

export const metadata: Metadata = {
  title: "Admin Panel - AnimeModu",
  description: "İçerik yönetim paneli",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between pb-6 border-b border-white/5">
        <div>
          <h2 className="text-3xl font-rubik font-bold text-white mb-1">Gösterge Paneli</h2>
          <p className="text-text-main/60 text-sm">Hoş geldin, içerik durumunu buradan yönetebilirsin.</p>
        </div>
        <Button asChild className="h-12 px-6 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
          <Link href="/panel/add">
            <Plus className="w-4 h-4 mr-2" /> Yeni Ekle
          </Link>
        </Button>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsCardsServer />
      </Suspense>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Suspense fallback={<TableSkeleton />}>
          <TopAnimesServer />
        </Suspense>

        <Suspense fallback={<TableSkeleton />}>
          <RecentAnimesServer />
        </Suspense>
      </div>
    </div>
  );
}

