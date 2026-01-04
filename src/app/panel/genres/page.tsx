import { Suspense } from "react";

import { GenresContent } from "./GenresContent";
import GenresLoading from "./loading";

export const metadata = {
    title: "Türler - Admin Panel",
    description: "Anime türlerini görüntüleyin ve yönetin.",
};

export default function GenresPage() {
    return (
        <Suspense fallback={<GenresLoading />}>
            <GenresContent />
        </Suspense>
    );
}
