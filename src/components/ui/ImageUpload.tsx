"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    value?: string;
    onChange: (file: File | null) => void;
    label: string;
    description?: string;
    aspectRatio?: "square" | "video" | "favicon";
}

export function ImageUpload({ value, onChange, label, description, aspectRatio = "square" }: ImageUploadProps) {
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

    const aspectClasses = {
        square: "aspect-square max-w-52",
        video: "aspect-video w-full",
        favicon: "aspect-square w-16 h-16",
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-main/80">{label}</label>
                {description && <p className="text-xs text-text-main/40">{description}</p>}
            </div>

            <div className="flex items-start gap-4">
                {preview ? (
                    <div className={`relative group rounded-xl overflow-hidden border border-white/5 bg-bg-secondary/30 ${aspectClasses[aspectRatio]}`}>
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-contain p-2"
                            unoptimized
                        />
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl bg-bg-secondary/10 hover:bg-bg-secondary/20 hover:border-primary/20 transition-all group ${aspectClasses[aspectRatio]}`}
                    >
                        <div className="p-4 flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
                            <Upload className="w-6 h-6 text-text-main/40 group-hover:text-primary" />
                            <span className="text-xs text-text-main/40 font-medium">Yükle</span>
                        </div>
                    </button>
                )}

                {!preview && (
                    <div className="flex-1 py-2">
                        <p className="text-xs text-text-main/40 italic">
                            Henüz görsel seçilmedi. Desteklenen formatlar: PNG, JPG, WEBP, ICO
                        </p>
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
}
