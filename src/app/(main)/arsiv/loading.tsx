import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArchiveLoading() {
  return (
    <div className="pt-36 pb-16 min-h-screen bg-bg-main">
      <Container>
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-10 items-start">
          <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24">
            <div className="space-y-6">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="mb-8">
              <Skeleton className="h-9 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}




















