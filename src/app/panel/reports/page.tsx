
import { Suspense } from "react";
import { getReports } from "@/actions/interactions/report";
import { ReportsTable } from "@/components/panel/tables/ReportsTable";
import { Loader2 } from "lucide-react";

export default async function ReportsPage() {
    const { data: reports, success, error } = await getReports(1, "all");

    if (!success) {
        return (
            <div className="p-6">
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl">
                    Hata: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-screen-2xl mx-auto w-full">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-rubik text-white tracking-tight">Bildirimler</h1>
                <p className="text-text-main">
                    Kullanıcılardan gelen hatalı bölüm bildirimlerini yönetin.
                </p>
            </div>

            <Suspense fallback={
                <div className="bg-bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-2xl h-96 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            }>
                <ReportsTable items={reports || []} />
            </Suspense>
        </div>
    );
}
