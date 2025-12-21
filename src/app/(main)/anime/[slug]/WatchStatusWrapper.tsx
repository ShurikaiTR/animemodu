"use client";

import WatchStatusDropdown from "@/components/ui/WatchStatusDropdown";

import type { WatchStatus } from "@/components/ui/WatchStatusDropdown/config";

interface WatchStatusWrapperProps {
  animeId?: number;
  initialStatus?: WatchStatus | null;
}

export default function WatchStatusWrapper({ animeId, initialStatus }: WatchStatusWrapperProps) {
  return <WatchStatusDropdown animeId={animeId} initialStatus={initialStatus} variant="hero" />;
}


















