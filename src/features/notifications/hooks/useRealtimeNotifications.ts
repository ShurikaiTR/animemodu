"use client";

import { useEffect, useRef, useState } from "react";

import { createClient } from "@/shared/lib/supabase/client";
import type { NotificationRow } from "@/shared/types/domain/notification";

interface UseRealtimeNotificationsOptions {
    userId: string | undefined;
    onNewNotification?: (notification: NotificationRow) => void;
}

interface UseRealtimeNotificationsReturn {
    /** Yeni gelen bildirimlerin sayısı (realtime ile artan) */
    realtimeCount: number;
    /** Son gelen bildirim */
    lastNotification: NotificationRow | null;
    /** Sayacı sıfırla (dropdown açıldığında kullanılır) */
    resetCount: () => void;
}

/**
 * Supabase Realtime ile notifications tablosundaki INSERT olaylarını dinler.
 * Yeni bildirim geldiğinde sayacı artırır ve callback çağırır.
 */
export function useRealtimeNotifications({
    userId,
    onNewNotification,
}: UseRealtimeNotificationsOptions): UseRealtimeNotificationsReturn {
    const [realtimeCount, setRealtimeCount] = useState(0);
    const [lastNotification, setLastNotification] = useState<NotificationRow | null>(null);
    const supabaseRef = useRef(createClient());

    useEffect(() => {
        if (!userId) return;

        const supabase = supabaseRef.current;

        // notifications tablosunda INSERT olaylarını dinle
        const channel = supabase
            .channel(`notifications:${userId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    const newNotification = payload.new as NotificationRow;
                    setRealtimeCount((prev) => prev + 1);
                    setLastNotification(newNotification);
                    onNewNotification?.(newNotification);
                }
            )
            .subscribe();

        // Cleanup: component unmount olduğunda subscription'ı kapat
        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, onNewNotification]);

    const resetCount = () => {
        setRealtimeCount(0);
    };

    return {
        realtimeCount,
        lastNotification,
        resetCount,
    };
}
