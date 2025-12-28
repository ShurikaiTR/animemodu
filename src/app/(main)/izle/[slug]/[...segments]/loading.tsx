import { Skeleton } from "@/shared/components/skeleton";
import Container from "@/shared/components/container";

export function VideoSkeleton() {
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-32" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-main relative -mt-36 pt-36">
      <Skeleton className="absolute inset-0 w-full h-96" />
      <Container className="relative z-20 pt-28 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_22rem] gap-8 items-start">
          <div className="flex flex-col gap-8 min-w-0">
            <VideoSkeleton />
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
          <SidebarSkeleton />
        </div>
      </Container>
    </div>
  );
}

