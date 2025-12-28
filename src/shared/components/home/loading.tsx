import { Skeleton } from "@/shared/components/skeleton";
import Container from "@/shared/components/container";

export function HeroSkeleton() {
  return (
    <section className="pt-32 pb-10">
      <Container>
        <div className="w-full lg:h-[34rem]">
          <Skeleton className="w-full h-96 lg:h-full rounded-3xl" />
        </div>
      </Container>
    </section>
  );
}

export function EpisodesSkeleton() {
  return (
    <section className="pb-10 pt-4">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function AnimesSkeleton() {
  return (
    <section className="pb-20 pt-16">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-12">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MoviesSkeleton() {
  return (
    <section className="pb-20 pt-8">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-12">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

