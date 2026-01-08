import type { Metadata } from "next";

import { getNotifications } from "@/features/notifications/actions";
import NotificationPageContent from "@/features/notifications/components/NotificationPageContent";
import type { Notification } from "@/shared/types/domain/notification";

export const metadata: Metadata = {
    title: "Bildirimler | AnimeModu",
    description: "Güncel aktiviteleriniz ve haberler.",
};

export default async function NotificationsPage() {
    // Tüm bildirimleri çek, filtreleme client-side yapılacak
    const result = await getNotifications(50);
    const notifications = result.success && "data" in result ? (result.data as Notification[]) : [];

    return <NotificationPageContent initialNotifications={notifications} />;
}
