import { Captions, Flag, type LucideIcon,MonitorPlay, VolumeX } from "lucide-react";

export type ReportReasonId = "playback" | "audio" | "subtitle" | "wrong";

export interface ReportReason {
    id: ReportReasonId;
    label: string;
    icon: LucideIcon;
}

export const REPORT_REASONS: ReportReason[] = [
    { id: "playback", label: "Video Açılmıyor", icon: MonitorPlay },
    { id: "audio", label: "Ses Sorunu", icon: VolumeX },
    { id: "subtitle", label: "Altyazı Hatalı", icon: Captions },
    { id: "wrong", label: "Yanlış Bölüm", icon: Flag },
];
