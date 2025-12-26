import Container from "@/components/ui/container";

export default function ProfileSkeleton() {
    return (
        <div className="bg-bg-main min-h-screen">
            <Container className="pt-28 lg:pt-32">
                <div className="relative rounded-3xl overflow-hidden bg-bg-secondary border border-white/5 shadow-2xl animate-pulse">
                    {/* Banner Skeleton */}
                    <div className="relative h-48 md:h-64 lg:h-72 w-full bg-white/5" />

                    {/* Profile Info Skeleton */}
                    <div className="relative px-6 md:px-10 pb-8 pt-16 md:pt-4">
                        {/* Avatar Skeleton */}
                        <div className="absolute -top-16 md:-top-20 left-6 md:left-10">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl md:rounded-3xl bg-white/10 border-2 border-primary/20" />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="space-y-4 md:pl-44 lg:pl-48">
                                {/* Name & Badge Skeleton */}
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-48 bg-white/10 rounded-lg" />
                                    <div className="h-7 w-24 bg-blue-500/10 rounded-full" />
                                </div>
                                {/* Stats Skeleton */}
                                <div className="flex items-center gap-8">
                                    <div className="h-6 w-20 bg-white/5 rounded" />
                                    <div className="h-6 w-20 bg-white/5 rounded" />
                                    <div className="h-6 w-20 bg-white/5 rounded" />
                                </div>
                                {/* Bio Skeleton */}
                                <div className="h-4 w-96 bg-white/5 rounded" />
                                {/* Pills Skeleton */}
                                <div className="flex gap-3 pt-2">
                                    <div className="h-9 w-28 bg-white/[0.03] border border-white/5 rounded-full" />
                                    <div className="h-9 w-32 bg-white/[0.03] border border-white/5 rounded-full" />
                                    <div className="h-9 w-36 bg-white/[0.03] border border-white/5 rounded-full" />
                                </div>
                            </div>

                            {/* Right Side Actions Skeleton */}
                            <div className="flex flex-col items-end gap-5">
                                <div className="h-11 w-40 bg-primary/20 rounded-xl" />
                                <div className="h-11 w-44 bg-white/[0.03] border border-white/5 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Content Skeleton */}
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                    <div className="lg:col-span-8 xl:col-span-9 animate-pulse">
                        <div className="h-8 w-32 bg-white/10 rounded mb-6" />
                        <div className="h-12 w-80 bg-white/5 rounded-xl mb-8" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl" />
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-4 xl:col-span-3 animate-pulse">
                        <div className="h-80 bg-bg-secondary/30 rounded-3xl" />
                    </div>
                </div>
            </Container>
        </div>
    );
}
