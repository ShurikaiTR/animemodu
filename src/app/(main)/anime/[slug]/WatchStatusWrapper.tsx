"use client";

import WatchStatusDropdown from "@/shared/components/WatchStatusDropdown";

import type { WatchStatus } from "@/shared/components/WatchStatusDropdown/config";

interface WatchStatusWrapperProps {
  animeId?: string;
  initialStatus?: WatchStatus | null;
}

export default function WatchStatusWrapper({ animeId, initialStatus }: WatchStatusWrapperProps) {
  return <WatchStatusDropdown animeId={animeId} initialStatus={initialStatus} variant="hero" />;
}




















