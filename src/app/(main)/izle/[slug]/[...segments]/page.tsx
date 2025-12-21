import { Suspense } from "react";
import VideoPlayerServer from "./VideoPlayerServer";
import Loading from "./loading";

interface PageProps {
    params: Promise<{ slug: string; segments: string[] }>;
}

export default async function WatchPage({ params }: PageProps) {
    const { slug, segments } = await params;

    return (
        <Suspense fallback={<Loading />}>
            <VideoPlayerServer slug={slug} segments={segments} />
        </Suspense>
    );
}
