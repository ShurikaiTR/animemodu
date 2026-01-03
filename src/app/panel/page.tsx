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
  title: "Admin Panel · AnimeModu",
  description: "İçerik yönetim paneli",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-rubik font-bold text-white tracking-tight mb-2">
            Gösterge Paneli
          </h1>
          <p className="flex items-center gap-2 font-inter text-sm font-semibold text-primary">
            Hoş geldin, <span className="text-text-main/40 font-medium">içerik durumunu buradan yönetebilirsin.</span>
          </p>
        </div>
        <Button asChild className="h-11 px-6 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
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

