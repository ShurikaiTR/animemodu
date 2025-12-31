"use client";

import { useState, useRef } from "react";
import type { EpisodeManagement } from "@/shared/types/domain/anime";
import { BasicInfoFields } from "./_components/BasicInfoFields";
import { MediaFields } from "./_components/MediaFields";

interface EpisodeFieldsProps {
    episode: EpisodeManagement;
}

export function EpisodeFields({ episode }: EpisodeFieldsProps) {
    const [overview, setOverview] = useState(episode.overview || "");
    const [stillPath, setStillPath] = useState(episode.still_path || "");
    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleDateIconClick = () => {
        if (dateInputRef.current) {
            try {
                if ('showPicker' in HTMLInputElement.prototype) {
                    dateInputRef.current.showPicker();
                } else {
                    dateInputRef.current.focus();
                }
            } catch {
                dateInputRef.current.focus();
            }
        }
    };

    return (
        <div className="divide-y divide-white/5">
            <BasicInfoFields
                episode={episode}
                overview={overview}
                setOverview={setOverview}
                dateInputRef={dateInputRef}
                handleDateIconClick={handleDateIconClick}
            />

            <MediaFields
                episode={episode}
                stillPath={stillPath}
                setStillPath={setStillPath}
            />
        </div>
    );
}
