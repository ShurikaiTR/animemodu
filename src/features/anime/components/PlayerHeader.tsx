import Image from "next/image";

interface PlayerHeaderProps {
    animeTitle?: string;
    episodeTitle?: string;
    logo?: string;
}

export default function PlayerHeader({ animeTitle, episodeTitle, logo }: PlayerHeaderProps) {
    return (
        <div className="absolute top-6 left-6 z-40 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700 pointer-events-none select-none">
            {logo && (
                <div className="relative">
                    {/* Pulse/Heartbeat Effect */}
                    <div className="absolute inset-0 rounded-full bg-primary/40 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50" />
                    
                    {/* Logo Container */}
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 shadow-xl bg-black/50 backdrop-blur-md z-10">
                        <Image src={logo} alt={animeTitle || "Anime"} fill className="object-cover" sizes="56px" />
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-1 drop-shadow-md">
                {animeTitle && (
                    <h3 className="text-white font-bold text-xl leading-none tracking-wide font-rubik text-shadow-lg">
                        {animeTitle}
                    </h3>
                )}
                {episodeTitle && (
                    <p className="text-white/90 text-sm font-medium tracking-wide text-shadow-md">
                        {episodeTitle}
                    </p>
                )}
            </div>
        </div>
    );
}

