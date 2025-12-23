import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarLoading() {
  return (
    <div className="min-h-screen bg-bg-main pb-20 pt-24 md:pt-32">
      <Container>
        <div className="mb-12">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>

        <div className="sticky top-20 z-40 bg-bg-main/95 backdrop-blur-xl border-y border-white/5 py-4 mb-10 -mx-4 md:mx-0 px-4 md:px-0">
          <div className="flex items-center gap-2 md:grid md:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center gap-6 bg-bg-secondary/30 border border-white/5 rounded-2xl p-4 md:p-6"
            >
              <Skeleton className="w-full md:w-24 h-16 md:h-24 rounded-xl shrink-0" />
              <Skeleton className="w-full md:w-40 aspect-video md:aspect-[16/9] rounded-xl shrink-0" />
              <div className="flex-1 w-full md:w-auto space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="shrink-0 w-full md:w-auto flex gap-3 mt-4 md:mt-0">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-12 w-full md:w-40 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}


















