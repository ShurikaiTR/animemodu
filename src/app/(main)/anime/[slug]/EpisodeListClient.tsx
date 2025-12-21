"use client";

import { useState, useEffect } from "react";
import EpisodeListSection from "./EpisodeListSection";
import type { Episode, AnimeDetailData } from "./types";

interface EpisodeListClientProps {
  episodes: Episode[];
  structureType: "seasonal" | "absolute";
  anime: AnimeDetailData;
}

export default function EpisodeListClient({
  episodes,
  structureType,
  anime,
}: EpisodeListClientProps) {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);

  const episodesBySeason = episodes.reduce(
    (acc, ep) => {
      const season = ep.season_number || 1;
      if (!acc[season]) acc[season] = [];
      acc[season].push(ep);
      return acc;
    },
    {} as Record<number, Episode[]>
  );

  const seasons = Object.keys(episodesBySeason)
    .map(Number)
    .sort((a, b) => a - b);

  useEffect(() => {
    if (seasons.length > 0 && !seasons.includes(selectedSeason)) {
      setSelectedSeason(seasons[0]);
    }
  }, [seasons, selectedSeason]);

  const currentEpisodes =
    structureType === "seasonal"
      ? episodesBySeason[selectedSeason] || []
      : episodes;

  return (
    <EpisodeListSection
      episodes={currentEpisodes}
      selectedSeason={selectedSeason}
      seasons={seasons}
      structureType={structureType}
      anime={anime}
      onSeasonChange={setSelectedSeason}
    />
  );
}












