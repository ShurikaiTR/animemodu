"use client";

import { Switch } from "@/shared/components/switch";
import { Label } from "@/shared/components/label";
import { Construction, Users } from "lucide-react";

interface FeatureTogglesProps {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

export default function FeatureToggles({ settings, onChange }: FeatureTogglesProps) {
    const isMaintenanceMode = settings.maintenance_mode === "true";
    const isWatchTogether = settings.watch_together === "true";

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Özellik Ayarları</h3>

            <div className="flex items-center justify-between p-4 rounded-xl bg-bg-secondary/30 border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                        <Construction className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-white">Bakım Modu</Label>
                        <p className="text-xs text-text-main/50">Aktifken ziyaretçilere bakım sayfası gösterilir</p>
                    </div>
                </div>
                <Switch
                    checked={isMaintenanceMode}
                    onCheckedChange={(checked) => onChange("maintenance_mode", checked ? "true" : "false")}
                />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-bg-secondary/30 border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-white">Birlikte İzle</Label>
                        <p className="text-xs text-text-main/50">Kullanıcıların birlikte izleme özelliği</p>
                    </div>
                </div>
                <Switch
                    checked={isWatchTogether}
                    onCheckedChange={(checked) => onChange("watch_together", checked ? "true" : "false")}
                />
            </div>
        </div>
    );
}
