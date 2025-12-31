"use client";

import { Info, Calendar, Clock, FileText } from "lucide-react";
import { FormField } from "./FormField";
import { cn } from "@/shared/lib/utils";
import type { EpisodeManagement } from "@/shared/types/domain/anime";

interface BasicInfoFieldsProps {
    episode: EpisodeManagement;
    overview: string;
    setOverview: (value: string) => void;
    dateInputRef: React.RefObject<HTMLInputElement | null>;
    handleDateIconClick: () => void;
}

export function BasicInfoFields({
    episode,
    overview,
    setOverview,
    dateInputRef,
    handleDateIconClick
}: BasicInfoFieldsProps) {
    return (
        <div className="p-6 lg:p-8 space-y-8">
            <h3 className="flex items-center gap-3 font-rubik text-lg font-bold text-white">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <Info className="w-4 h-4" />
                </div>
                Temel Bilgiler
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <FormField
                    id="air_date"
                    label="Yayın Tarihi"
                    icon={
                        <div
                            onClick={handleDateIconClick}
                            className="pointer-events-auto cursor-pointer z-10 hover:text-primary transition-all duration-300"
                        >
                            <Calendar className="w-5 h-5 transition-transform group-hover:scale-110 active:scale-95" />
                        </div>
                    }
                >
                    <input
                        id="air_date"
                        name="air_date"
                        type="date"
                        ref={dateInputRef}
                        defaultValue={episode.air_date || ""}
                        onFocus={(e) => {
                            try {
                                if ('showPicker' in HTMLInputElement.prototype) {
                                    e.target.showPicker();
                                }
                            } catch {
                                // Fallback if showPicker fails
                            }
                        }}
                        className="w-full h-12 pl-11 pr-4 py-2 font-inter text-sm font-medium rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-sm [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                </FormField>

                <FormField
                    id="duration"
                    label="Süre (Dakika)"
                    icon={<Clock className="w-5 h-5" />}
                >
                    <input
                        id="duration"
                        name="duration"
                        type="number"
                        defaultValue={episode.duration || 0}
                        className="w-full h-12 pl-11 pr-4 py-2 font-inter text-sm font-medium rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-sm"
                    />
                </FormField>
            </div>

            <FormField
                id="overview"
                label="Bölüm Özeti"
                icon={<FileText className="w-5 h-5" />}
                iconAlign="top"
                extraLabelContent={
                    <span className={cn(
                        "text-xs font-mono transition-colors",
                        overview.length > 450 ? "text-danger" : "text-text-main/30"
                    )}>
                        {overview.length}/500
                    </span>
                }
            >
                <textarea
                    id="overview"
                    name="overview"
                    rows={5}
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    maxLength={500}
                    placeholder="Bölüm hakkında kısa bir özet..."
                    className="w-full pl-11 pr-4 py-4 font-inter text-sm font-medium leading-relaxed rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-sm resize-none"
                />
            </FormField>

            <style jsx>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
                    background: transparent;
                    bottom: 0;
                    color: transparent;
                    cursor: pointer;
                    height: auto;
                    left: 0;
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: auto;
                    padding: 0;
                    margin: 0;
                }
            `}</style>
        </div>
    );
}
