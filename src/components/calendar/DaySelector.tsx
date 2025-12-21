"use client";

import { cn } from "@/lib/utils";

const DAYS = [
    { id: "mon", label: "Pazartesi", short: "Pzt", dayIdx: 1 },
    { id: "tue", label: "Salı", short: "Sal", dayIdx: 2 },
    { id: "wed", label: "Çarşamba", short: "Çar", dayIdx: 3 },
    { id: "thu", label: "Perşembe", short: "Per", dayIdx: 4 },
    { id: "fri", label: "Cuma", short: "Cum", dayIdx: 5 },
    { id: "sat", label: "Cumartesi", short: "Cmt", dayIdx: 6 },
    { id: "sun", label: "Pazar", short: "Paz", dayIdx: 0 },
];

interface DaySelectorProps {
    selectedDay: string;
    onDayChange: (day: string) => void;
}

export default function DaySelector({ selectedDay, onDayChange }: DaySelectorProps) {
    return (
        <div className="sticky top-20 z-40 bg-bg-main/95 backdrop-blur-xl border-y border-white/5 py-4 mb-10 -mx-4 md:mx-0 px-4 md:px-0 custom-scrollbar">
            <div className="flex items-center gap-2 md:grid md:grid-cols-7 overflow-x-auto md:overflow-visible">
                {DAYS.map((day) => {
                    const isSelected = selectedDay === day.id;
                    return (
                        <button
                            key={day.id}
                            onClick={() => onDayChange(day.id)}
                            className={cn(
                                "flex flex-col items-center justify-center py-3 px-6 md:px-0 rounded-xl transition-all duration-300 min-w-[100px] md:min-w-0 md:w-full relative overflow-hidden group",
                                isSelected
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <span className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                                {day.short}
                            </span>
                            <span className={cn("text-lg font-bold", isSelected ? "scale-110" : "")}>
                                {day.label}
                            </span>

                            {isSelected && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}















