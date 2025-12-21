import { Suspense } from "react";
import { EpisodesContent } from "./EpisodesContent";
import EpisodesLoading from "./loading";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function AnimeEpisodesPage({ params }: PageProps) {
    return (
        <Suspense fallback={<EpisodesLoading />}>
            <EpisodesContent params={params} />
        </Suspense>
    );
}
