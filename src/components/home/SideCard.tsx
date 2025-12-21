import Link from "next/link";
import Image from "next/image";
import { Play, TrendingUp } from "lucide-react";

interface SideCardProps {
    title: string;
    image: string;
    episode: string;
    tag: string;
    priority?: boolean;
}

export default function SideCard({ title, image, episode, tag, priority = false }: SideCardProps) {
    return (
        <Link href="#" className="relative group rounded-3xl overflow-hidden cursor-pointer shadow-xl shadow-black/30 ring-1 ring-white/5 h-64 lg:h-[16rem] min-h-[16rem]">
            <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority={priority}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-transparent to-transparent" />

            <div className="absolute top-4 left-4 z-10">
                <span className="bg-white/10 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-primary" /> {tag}
                </span>
            </div>

            <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-xl font-bold text-white font-rubik mb-1 drop-shadow-md">{title}</h3>
                        <p className="text-primary text-sm font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            {episode}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                        <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}










