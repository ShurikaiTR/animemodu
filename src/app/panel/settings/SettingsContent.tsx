import { createClient } from "@/lib/supabase/server";
import SiteInfoForm from "./SiteInfoForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SettingsContent() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("category", "general")
        .order("id", { ascending: true });

    // Settings'i key-value map'e çevir
    type SettingData = { key: string; value: string | null };
    const settingsMap: Record<string, string> = {};
    if (!error && data) {
        (data as SettingData[]).forEach((setting) => {
            settingsMap[setting.key] = setting.value || "";
        });
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/panel">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-text-main hover:text-white hover:bg-white/5">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h2 className="text-3xl font-rubik font-bold text-white mb-2 flex items-center gap-3">
                                Site Ayarları
                            </h2>
                            <p className="text-text-main/60 text-sm">
                                Sitenin genel bilgilerini buradan düzenleyebilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <SiteInfoForm initialSettings={settingsMap} />
        </div>
    );
}
