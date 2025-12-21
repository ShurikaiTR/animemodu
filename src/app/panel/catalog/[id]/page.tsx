import { Suspense } from "react";
import { EditAnimeForm } from "./EditAnimeForm";
import Loading from "./loading";

// Provide at least one static param for cache validation
// Actual data will be fetched client-side
export async function generateStaticParams() {
    return [{ id: "0" }];
}

export default async function EditAnimePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    return (
        <Suspense fallback={<Loading />}>
            <EditAnimeForm id={id} />
        </Suspense>
    );
}
