"use client";

import { useEffect,useState } from "react";
import { toast } from "sonner";

import { createReport } from "@/features/reports/actions";

import type { ReportReasonId } from "./ReportReasons";

interface UseReportModalProps {
    isOpen: boolean;
    animeId: string;
    seasonNumber?: number;
    episodeNumber?: number;
    onClose: () => void;
}

export function useReportModal({ isOpen, animeId, seasonNumber, episodeNumber, onClose }: UseReportModalProps) {
    const [selectedReason, setSelectedReason] = useState<ReportReasonId | null>(null);
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSelectedReason(null);
            setDescription("");
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!selectedReason) {
            toast.error("Lütfen bir hata nedeni seçin.");
            return;
        }

        setIsSubmitting(true);

        const result = await createReport({
            animeId,
            seasonNumber,
            episodeNumber,
            reason: selectedReason,
            description
        });

        if (!result.success) {
            toast.error(result.error || "Bir hata oluştu.");
            setIsSubmitting(false);
            return;
        }

        toast.success("Hata bildirimi alındı. Teşekkürler!");
        setIsSubmitting(false);
        onClose();
    };

    return {
        selectedReason,
        setSelectedReason,
        description,
        setDescription,
        isSubmitting,
        handleSubmit
    };
}
