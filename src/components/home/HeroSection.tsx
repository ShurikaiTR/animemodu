import Container from "@/components/ui/container";
import FeaturedCard from "./FeaturedCard";
import type { AnimeRow } from "@/types/helpers";

interface HeroSectionProps {
    featuredAnime?: AnimeRow | null;
}

export default function HeroSection({ featuredAnime }: HeroSectionProps) {
    return (
        <section className="pt-32 pb-10">
            <Container>
                <div className="w-full lg:h-[34rem]">
                    {featuredAnime ? (
                        <FeaturedCard anime={featuredAnime} />
                    ) : (
                        <div className="w-full h-96 lg:h-full relative rounded-3xl overflow-hidden bg-bg-secondary/30 border border-white/5 flex items-center justify-center">
                            <p className="text-white/60 text-sm">Öne çıkarılmış anime bulunmuyor</p>
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
}
