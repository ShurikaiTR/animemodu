"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { CloudUpload, FileUp, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ImageUploadProps {
    value?: string;
    onChange: (file: File | null) => void;
    label: string;
    description?: string;
    aspectRatio?: "square" | "video" | "favicon";
}

export function ImageUpload({
    value,
    onChange,
    label,
    description,
    aspectRatio = "square",
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const isFavicon = aspectRatio === "favicon";

    return (
        <div className="space-y-4">
            <div className="flex items-baseline justify-between gap-2">
                <label className="block text-sm font-medium text-text-main/80">
                    {label}
                </label>
                {description && <span className="text-xs text-text-main/40">{description}</span>}
            </div>

            <div className={cn("flex items-start gap-6", !isFavicon && "flex-col")}>
                {/* Upload Area - Logo/OG için görsel yoksa veya Favicon ise göster */}
                {(!preview || isFavicon) && (
                    <div
                        className={cn(
                            "flex flex-col items-center justify-center relative p-6 bg-white/[0.03] border-2 border-dashed border-white/5 rounded-2xl cursor-pointer group transition-all duration-200 hover:bg-primary/5 hover:border-primary/50",
                            isFavicon ? "flex-1 min-h-35" : "w-full min-h-40"
                        )}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />

                        <div className="flex flex-col items-center justify-center gap-4 transition-transform duration-200 group-hover:scale-105">
                            <div className="flex items-center justify-center w-12 h-12 bg-bg-main border border-white/5 rounded-full shadow-sm transition-colors group-hover:border-primary/50">
                                {isFavicon ? (
                                    <FileUp className="w-6 h-6 text-text-main/40 transition-colors group-hover:text-primary" />
                                ) : (
                                    <CloudUpload className="w-6 h-6 text-primary" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-text-heading">
                                    <span className="text-primary hover:underline">
                                        Yüklemek için tıkla
                                    </span>
                                    <span className="hidden sm:inline"> veya sürükle</span>
                                </p>
                                <p className="text-xs text-text-main/20">
                                    {isFavicon ? "PNG, ICO (32x32px)" : "SVG, PNG, JPG veya WEBP"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview Area / Info Card - Görsel varsa göster */}
                {preview && (
                    <div className={cn("flex flex-col gap-3", isFavicon ? "w-32" : "w-full max-w-sm")}>
                        {isFavicon ? (
                            <p className="text-xs font-medium text-text-main/40 mb-1">Mevcut</p>
                        ) : (
                            <p className="text-xs font-medium text-text-main/40">Görsel Önizleme</p>
                        )}

                        <div
                            className={cn(
                                "flex items-center justify-center relative overflow-hidden bg-white/[0.03] border border-white/5 rounded-xl group",
                                isFavicon ? "aspect-square" : "aspect-video"
                            )}
                        >
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-contain p-2"
                                unoptimized
                            />
                            <div className="flex items-center justify-center absolute inset-0 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove();
                                    }}
                                    className="p-2 text-white bg-white/10 rounded-full transition-colors hover:bg-white/20 hover:text-danger"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {!isFavicon && (
                            <div className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-12 h-8 bg-white/5 border border-white/10 rounded overflow-hidden">
                                        <span className="text-xs font-bold tracking-wider text-text-main/20">
                                            IMAGE
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-text-main/60">
                                        Görsel yüklendi / Aktif
                                    </p>
                                </div>
                                <div className="flex h-2 w-2 rounded-full bg-primary/50 shadow-[0_0_8px_rgba(47,128,237,0.5)]" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
