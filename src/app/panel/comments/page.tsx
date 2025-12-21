import { Suspense } from "react";
import { CommentsContent } from "./CommentsContent";
import CommentsLoading from "./loading";

export const metadata = {
    title: "Yorumlar ve İncelemeler - Admin Panel",
    description: "Kullanıcı yorumlarını ve incelemelerini yönetin.",
};

export default function CommentsPage() {
    return (
        <Suspense fallback={<CommentsLoading />}>
            <CommentsContent />
        </Suspense>
    );
}
