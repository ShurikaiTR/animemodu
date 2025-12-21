"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import DaySelector from "./DaySelector";
import CalendarEpisodeCard from "./CalendarEpisodeCard";

const DAYS = [
    { id: "mon", label: "Pazartesi", short: "Pzt", dayIdx: 1 },
    { id: "tue", label: "Salı", short: "Sal", dayIdx: 2 },
    { id: "wed", label: "Çarşamba", short: "Çar", dayIdx: 3 },
    { id: "thu", label: "Perşembe", short: "Per", dayIdx: 4 },
    { id: "fri", label: "Cuma", short: "Cum", dayIdx: 5 },
    { id: "sat", label: "Cumartesi", short: "Cmt", dayIdx: 6 },
    { id: "sun", label: "Pazar", short: "Paz", dayIdx: 0 },
];

interface CalendarEpisode {
    id: number;
    title: string | null;
    episode_number: number;
    air_date: string | null;
    anime: {
        id: number;
        title: string;
        poster_path: string | null;
        backdrop_path: string | null;
        genres: string[] | null | undefined;
        slug: string;
    } | null;
}

interface CalendarClientProps {
    episodes: CalendarEpisode[];
}

export default function CalendarClient({ episodes }: CalendarClientProps) {
    const today = new Date();
    const todayIdx = today.getDay();
    const initialDay = DAYS.find(d => d.dayIdx === todayIdx)?.id || "mon";

    const [selectedDay, setSelectedDay] = useState(initialDay);

    const filteredEpisodes = episodes.filter(ep => {
        if (!ep.air_date) return false;
        const date = new Date(ep.air_date);
        const dayIdx = date.getDay();
        const dayId = DAYS.find(d => d.dayIdx === dayIdx)?.id;
        return dayId === selectedDay;
    });

    return (
        <>
            <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />

            <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                {filteredEpisodes.length > 0 ? (
                    filteredEpisodes.map((episode) => (
                        <CalendarEpisodeCard key={episode.id} episode={episode} />
                    ))
                ) : (
                    <div className="py-20 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Sparkles className="w-8 h-8 text-white/20" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Bölüm Yok</h3>
                        <p className="text-white/40">Bu gün için henüz planlanmış bir anime bölümü bulunmuyor.</p>
                    </div>
                )}
            </div>
        </>
    );
}
