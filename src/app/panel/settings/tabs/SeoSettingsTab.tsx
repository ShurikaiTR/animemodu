"use client";

import { Input } from "@/shared/components/input";
import { Textarea } from "@/shared/components/textarea";
import { Label } from "@/shared/components/label";
import { ImageUpload } from "@/shared/components/ImageUpload";
import { Search, Globe, Image, Tag, Compass } from "lucide-react";

interface SeoSettingsTabProps {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
    onOgImageChange: (file: File | null) => void;
}

export default function SeoSettingsTab({ settings, onChange, onOgImageChange }: SeoSettingsTabProps) {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold text-white mb-1">SEO Ayarları</h3>
                <p className="text-sm text-text-main/50">Arama motoru ve site meta bilgilerini düzenleyin.</p>
            </div>

            <div className="space-y-8 w-full">
                {/* Site Meta Bilgileri */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-text-main/60 border-b border-white/5 pb-2">Genel Site Meta Bilgileri</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-main/80 flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Site Başlığı
                            </label>
                            <Input
                                id="seo_meta_title"
                                value={settings.seo_meta_title || ""}
                                onChange={(e) => onChange("seo_meta_title", e.target.value)}
                                placeholder="AnimeModu - Türkçe Anime İzle"
                                className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus:border-primary focus-visible:ring-0"
                            />
                            <p className="text-xs text-text-main/40">Tarayıcı sekmesinde ve arama sonuçlarında görünen ana başlık.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-main/80 flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                Site Açıklaması
                            </label>
                            <Input
                                id="seo_meta_description"
                                value={settings.seo_meta_description || ""}
                                onChange={(e) => onChange("seo_meta_description", e.target.value)}
                                placeholder="En yeni animeleri Türkçe altyazılı izleyin..."
                                className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus:border-primary focus-visible:ring-0"
                            />
                            <p className="text-xs text-text-main/40">Sitenizin arama motorlarındaki kısa açıklaması.</p>
                        </div>
                    </div>
                </div>

                {/* Keşfet Sayfası Meta */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-text-main/60 border-b border-white/5 pb-2">Keşfet Sayfası Ayarları</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-main/80 flex items-center gap-2">
                                <Compass className="w-4 h-4" />
                                Keşfet Başlığı
                            </label>
                            <Input
                                id="seo_discover_title"
                                value={settings.seo_discover_title || ""}
                                onChange={(e) => onChange("seo_discover_title", e.target.value)}
                                placeholder="Keşfet - En İyi Animeler"
                                className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus:border-primary focus-visible:ring-0"
                            />
                            <p className="text-xs text-text-main/40">Keşfet sayfasının meta başlığı.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-main/80 flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                Keşfet Açıklaması
                            </label>
                            <Input
                                id="seo_discover_description"
                                value={settings.seo_discover_description || ""}
                                onChange={(e) => onChange("seo_discover_description", e.target.value)}
                                placeholder="Binlerce anime arasından sana en uygun olanı bul..."
                                className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus:border-primary focus-visible:ring-0"
                            />
                            <p className="text-xs text-text-main/40">Keşfet sayfasının meta açıklaması.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

