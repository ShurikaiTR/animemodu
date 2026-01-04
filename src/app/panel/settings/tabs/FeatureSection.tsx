"use client";

import { AlertTriangle, Settings2, Users } from "lucide-react";

import { Switch } from "@/shared/components/switch";

interface FeatureSectionProps {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

export function FeatureSection({ settings, onChange }: FeatureSectionProps) {
    return (
        <div className="p-6 lg:p-8 space-y-6">
            <h4 className="flex items-center gap-3 font-rubik text-lg font-bold text-text-heading">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary border border-primary/20 rounded-lg">
                    <Settings2 className="w-4 h-4" />
                </div>
                Özellikler
            </h4>

            <div className="space-y-4">
                {/* Bakım Modu */}
                <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-maintenance/10 border border-maintenance/20 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-maintenance" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-heading">Bakım Modu</label>
                            <p className="text-xs text-text-main/50">Aktif olduğunda ziyaretçiler bakım sayfasını görür.</p>
                        </div>
                    </div>
                    <Switch
                        checked={settings.maintenance_mode === "true"}
                        onCheckedChange={(checked) => onChange("maintenance_mode", checked ? "true" : "false")}
                    />
                </div>

                {/* Birlikte İzle */}
                <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-heading">Birlikte İzle</label>
                            <p className="text-xs text-text-main/50">Kullanıcıların birlikte izleme özelliğini aktifleştirir.</p>
                        </div>
                    </div>
                    <Switch
                        checked={settings.watch_together === "true"}
                        onCheckedChange={(checked) => onChange("watch_together", checked ? "true" : "false")}
                    />
                </div>
            </div>
        </div>
    );
}
