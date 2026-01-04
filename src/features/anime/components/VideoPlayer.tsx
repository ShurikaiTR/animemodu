"use client";

import Script from "next/script";
import { useRef } from "react";

import PlayerHeader from "@/features/anime/components/PlayerHeader";

import { useVideoJSLoader } from "./useVideoJSLoader";
import { useVideoJSPlayer } from "./useVideoJSPlayer";

interface VideoPlayerProps {
    src?: string | null;
    poster?: string | null;
    animeTitle?: string;
    episodeTitle?: string;
    logo?: string;
}

export default function VideoPlayer({ src, poster, animeTitle, episodeTitle, logo }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const isDirectVideo = !src || src.includes('.m3u8') || src.includes('.mp4');
    const isReady = useVideoJSLoader(isDirectVideo);
    const { showOverlay } = useVideoJSPlayer({ videoRef, isReady, src, poster });

    if (!isDirectVideo && src) {
        return (
            <div className="w-full h-full rounded-xl overflow-hidden bg-black relative z-10">
                <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${showOverlay ? 'opacity-100' : 'opacity-0'}`}>
                    <PlayerHeader 
                        animeTitle={animeTitle}
                        episodeTitle={episodeTitle}
                        logo={logo}
                    />
                </div>
                <iframe 
                    src={src} 
                    className="w-full h-full border-0" 
                    allowFullScreen 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
            </div>
        );
    }

    return (
        <div className="w-full h-full rounded-xl overflow-hidden bg-black relative z-10">
            <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${showOverlay ? 'opacity-100' : 'opacity-0'}`}>
                <PlayerHeader 
                    animeTitle={animeTitle}
                    episodeTitle={episodeTitle}
                    logo={logo}
                />
            </div>
            <Script
                src="/player/nsvideo.min.js"
                strategy="lazyOnload"
            />

            {isReady ? (
                <video
                    ref={videoRef}
                    className="video-js vjs-big-play-centered"
                    style={{ width: '100%', height: '100%' }}
                    playsInline
                    poster={poster || undefined}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-black">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}
