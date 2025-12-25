import { MonitorPlay, MessageSquare, AlertTriangle, Flag, type LucideIcon } from "lucide-react";

export interface ReportReason {
    id: string;
    label: string;
    icon: LucideIcon;
}

export const REPORT_REASONS: ReportReason[] = [
    { id: "playback", label: "Video Açılmıyor", icon: MonitorPlay },
    { id: "audio", label: "Ses Sorunu", icon: MessageSquare },
    { id: "subtitle", label: "Altyazı Hatalı", icon: AlertTriangle },
    { id: "wrong", label: "Yanlış Bölüm", icon: Flag },
];
