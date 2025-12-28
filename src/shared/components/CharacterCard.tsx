import Image from "next/image";
import { getImageUrl } from "@/shared/lib/tmdb";
import { cn } from "@/shared/lib/utils";

interface CharacterCardProps {
    name: string;
    character: string;
    image: string | null;
    className?: string;
    priority?: boolean;
}

export default function CharacterCard({ name, character, image, className, priority = false }: CharacterCardProps) {
    return (
        <div className={cn("group relative w-full aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer border border-white/5 bg-bg-secondary", className)}>


            <Image
                src={
                    image
                        ? image.startsWith("http")
                            ? image
                            : getImageUrl(image, "w500")
                        : "/placeholder-avatar.png"
                }
                alt={name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                priority={priority}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-2xl transition-colors duration-500 pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                <h4 className="text-white font-bold text-sm leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {name}
                </h4>
                <p className="text-white/70 text-xs font-medium truncate">
                    {character}
                </p>
            </div>
        </div>
    );
}
