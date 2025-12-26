import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/components/ui/container";

export function HeroSkeleton() {
  return (
    <section className="section section--head section--head-fixed section--gradient section--details-bg relative overflow-hidden pb-16 pt-32 -mt-36 bg-bg-main">
      <div className="absolute top-0 left-0 right-0 h-96 w-full z-0">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-main/30 via-bg-main/80 to-bg-main z-10" />
      </div>

      <Container className="z-20 relative">
        <div className="flex flex-col xl:flex-row xl:items-start gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="h-5 w-28" />
            </div>

            <div className="mb-10">
              <Skeleton className="h-10 w-2/3 mb-6" />

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>

              <div className="space-y-2 max-w-3xl">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function EpisodesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-video w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function CastSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-24" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="shrink-0 w-20 space-y-2">
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-2/3 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CommentsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex gap-3">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <section className="section section--head section--head-fixed section--gradient section--details-bg relative overflow-hidden pb-16 bg-bg-main">
        <Container>
          <div className="flex flex-col xl:flex-row xl:items-start gap-8">
            <div className="flex-1 min-w-0 space-y-12">
              <EpisodesSkeleton />
              <CastSkeleton />
              <CommentsSkeleton />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
