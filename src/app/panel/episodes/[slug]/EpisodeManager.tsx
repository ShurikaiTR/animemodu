"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EditEpisodeModal } from "./EditEpisodeModal";
import { Button } from "@/components/ui/button";
import { Pencil, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EpisodeManagement } from "@/types/domain/anime";


export function EpisodeManager({ animeId }: { animeId: number }) {
    const [episodes, setEpisodes] = useState<EpisodeManagement[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEpisode, setSelectedEpisode] = useState<EpisodeManagement | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const supabase = createClient();

    const fetchEpisodes = async () => {
        const { data, error: _error } = await supabase
            .from("episodes")
            .select("*")
            .eq("anime_id", animeId)
            .order("season_number", { ascending: true })
            .order("episode_number", { ascending: true });

        if (data) {
            setEpisodes(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEpisodes();
    }, [animeId]);

    const handleEdit = (episode: EpisodeManagement) => {
        setSelectedEpisode(episode);
        setIsEditModalOpen(true);
    };

    // Group episodes by season
    const seasons = episodes.reduce((acc, episode) => {
        const season = episode.season_number;
        if (!acc[season]) acc[season] = [];
        acc[season].push(episode);
        return acc;
    }, {} as Record<number, EpisodeManagement[]>);

    if (loading) return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <div className="h-7 w-24 rounded-md bg-white/5 animate-pulse" />
                <div className="h-5 w-16 rounded-md bg-white/5 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-bg-secondary/20 border border-white/5 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-8 rounded bg-white/5 animate-pulse" />
                                    <div className="h-5 w-32 rounded bg-white/5 animate-pulse" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-16 rounded bg-white/5 animate-pulse" />
                                    <div className="h-4 w-12 rounded bg-white/5 animate-pulse" />
                                </div>
                            </div>
                            <div className="h-8 w-8 rounded bg-white/5 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">

            {Object.keys(seasons).length === 0 ? (
                <div className="text-white/50 italic">Bu içerik için henüz bölüm eklenmemiş.</div>
            ) : (
                Object.entries(seasons).map(([seasonNum, seasonEpisodes]) => (
                    <div key={seasonNum} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10 px-3 py-1 text-sm">
                                {Number(seasonNum) === 0 ? "Özel Bölümler" : `${seasonNum}. Sezon`}
                            </Badge>
                            <span className="text-white/40 text-sm">({seasonEpisodes.length} bölüm)</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {seasonEpisodes.map((ep) => (
                                <div key={ep.id} className="group relative bg-bg-secondary/20 hover:bg-bg-secondary/40 border border-white/5 rounded-xl p-4 transition-all duration-200">
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-primary font-mono text-sm font-bold">#{ep.episode_number}</span>
                                                <h4 className="text-white font-medium truncate text-sm">
                                                    Bölüm {ep.episode_number}
                                                </h4>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-white/40">
                                                <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" /> {ep.duration ? `${ep.duration} dk` : "-"}</span>
                                                <span>★ {ep.vote_average?.toFixed(1) || "-"}</span>
                                            </div>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleEdit(ep)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}

            <EditEpisodeModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                episode={selectedEpisode}
                onUpdate={fetchEpisodes}
            />
        </div>
    );
}
