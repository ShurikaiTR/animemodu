"use client";

import { ImageIcon, Upload,User } from "lucide-react";

import { Button } from "@/shared/components/button";
import { Label } from "@/shared/components/label";
import { cn } from "@/shared/lib/utils";
import type { ProfileRow } from "@/shared/types/helpers";

interface ImagesTabProps {
    user: ProfileRow & { avatar?: string; banner?: string };
    avatarPreview: string;
    bannerPreview: string;
    onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImagesTab({ avatarPreview, bannerPreview, onAvatarChange, onBannerChange }: ImagesTabProps) {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <Label className="text-text-main/50">Avatar Görseli</Label>
                <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                        <div className={cn(
                            "w-24 h-24 rounded-full border-2 overflow-hidden bg-bg-input flex items-center justify-center transition-all shadow-xl",
                            avatarPreview ? "border-primary ring-4 ring-primary/10" : "border-dashed border-white/10 group-hover:border-primary group-hover:bg-bg-dark"
                        )}>
                            {avatarPreview ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-8 h-8 text-text-main/50" />
                            )}
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                <ImageIcon className="w-6 h-6 text-white mb-1" />
                                <span className="text-xs text-white/70 uppercase font-bold">Değiştir</span>
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={onAvatarChange}
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex flex-col gap-1">
                            <h4 className="text-text-heading font-medium">Profil Fotoğrafı</h4>
                            <p className="text-sm text-text-main/40">JPG, GIF veya PNG. Maksimum 5MB.</p>
                        </div>
                        <Button variant="outline" className="border-white/10 hover:bg-white/5 text-text-main bg-transparent h-9 text-xs relative overflow-hidden">
                            <Upload className="w-3 h-3 mr-2" />
                            Dosya Seç
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={onAvatarChange}
                            />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <Label className="text-text-main/50">Banner Görseli</Label>
                <div className="relative w-full h-40 rounded-xl border-2 border-dashed border-white/10 overflow-hidden bg-bg-input group transition-all hover:border-primary hover:bg-bg-dark cursor-pointer">
                    {bannerPreview ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-30" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-text-main/10" />
                        </div>
                    )}

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="bg-black/50 p-4 rounded-full mb-3 backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-white font-medium mb-1">Banner Yükle</h4>
                        <p className="text-xs text-white/40">1920x1080 önerilir</p>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={onBannerChange}
                    />
                </div>
            </div>
        </div>
    );
}





















