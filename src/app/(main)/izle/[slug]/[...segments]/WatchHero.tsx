import Image from "next/image";
import { getImageUrl } from "@/shared/lib/tmdb";

interface WatchHeroProps {
    backdrop: string;
    animeTitle: string;
}

export default function WatchHero({ backdrop, animeTitle }: WatchHeroProps) {
    if (!backdrop) return null;

    const imageUrl = getImageUrl(backdrop, "w780");

    return (
        <div className="absolute top-0 left-0 right-0 h-[60vh] max-h-[37.5rem] w-full z-0 pointer-events-none">
            <Image
                src={imageUrl}
                alt={`${animeTitle} arkaplan görseli`}
                fill
                sizes="100vw"
                className="object-cover opacity-20 select-none"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-main/10 via-bg-main/80 to-bg-main z-10" />
        </div>
    );
}
