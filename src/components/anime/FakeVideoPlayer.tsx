import Image from "next/image";
import { Play } from "lucide-react";
import PlayerHeader from "@/components/anime/PlayerHeader";

interface FakeVideoPlayerProps {
    poster?: string;
    onClick?: () => void;
    animeTitle?: string;
    episodeTitle?: string;
    logo?: string;
}

export default function FakeVideoPlayer({ poster, onClick, animeTitle, episodeTitle, logo }: FakeVideoPlayerProps) {
    return (
        <div
            onClick={onClick}
            className="w-full h-full relative bg-bg-video flex items-center justify-center group cursor-pointer overflow-hidden select-none"
        >
            <div className="absolute inset-0 z-20 pointer-events-none">
                <PlayerHeader
                    animeTitle={animeTitle}
                    episodeTitle={episodeTitle}
                    logo={logo}
                />
            </div>

            {poster && (
                <>
                    <Image
                        src={poster}
                        alt="Video Cover"
                        fill
                        sizes="100vw"
                        loading="eager"
                        className="object-cover opacity-30 group-hover:opacity-40 transition-all duration-700 scale-105 group-hover:scale-100 blur-sm group-hover:blur-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-video via-bg-video/20 to-bg-video/40" />
                </>
            )}

            {/* Play Button Container */}
            <div className="relative z-20">
                {/* Pulse Rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] delay-300 opacity-50" />

                {/* Main Button with Heartbeat */}
                <div className="relative w-24 h-24 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_40px_-10px_rgba(var(--primary-rgb),0.5)] animate-[pulse_3s_ease-in-out_infinite]">
                    <Play className="w-10 h-10 text-white fill-white ml-1.5 transition-colors duration-300" />
                </div>
            </div>

            {/* Bottom Text */}
            <div className="absolute bottom-12 left-0 right-0 text-center z-20 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                <span className="text-white font-medium text-lg tracking-wide drop-shadow-lg">
                    Bölümü Başlat
                </span>
            </div>
        </div>
    );
}

