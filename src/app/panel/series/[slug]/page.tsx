import { Suspense } from "react";
import { EditAnimeForm } from "./EditAnimeForm";
import Loading from "./loading";

// Provide at least one static param for cache validation
// Actual data will be fetched client-side
export async function generateStaticParams() {
    return [{ slug: "placeholder" }];
}

export default async function EditAnimePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    return (
        <Suspense fallback={<Loading />}>
            <EditAnimeForm slug={slug} />
        </Suspense>
    );
}
