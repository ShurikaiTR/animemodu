import Container from "@/shared/components/container";
import type { AnimeRow } from "@/shared/types/helpers";

import FeaturedCard from "./FeaturedCard";

interface HeroSectionProps {
    featuredAnime?: AnimeRow | null;
}

export default function HeroSection({ featuredAnime }: HeroSectionProps) {
    if (!featuredAnime) return null;

    return (
        <section className="pt-0 pb-8">
            <Container>
                <div className="w-full lg:h-[34rem]">
                    <FeaturedCard anime={featuredAnime} />
                </div>
            </Container>
        </section>
    );
}
