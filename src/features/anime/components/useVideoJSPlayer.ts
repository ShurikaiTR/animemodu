import { useEffect, useRef, useState } from "react";

import type { VideoJSPlayer } from "@/shared/types/helpers";

import { videoPlayerConfig } from "./playerConfig";

interface UseVideoJSPlayerProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isReady: boolean;
    src?: string | null;
    poster?: string | null;
}

export function useVideoJSPlayer({ videoRef, isReady, src, poster }: UseVideoJSPlayerProps) {
    const playerRef = useRef<VideoJSPlayer | null>(null);
    const [showOverlay, setShowOverlay] = useState(true);

    const initPlayer = () => {
        if (!videoRef.current) return;
        if (playerRef.current) return;
        if (!isReady) return;

        const videojs = window.videojs;
        if (!videojs) return;

        playerRef.current = videojs(videoRef.current, {
            controls: true,
            autoplay: false,
            preload: 'auto',
            fluid: true,
            poster: poster || undefined,
            sources: [{
                src: src || "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
                type: "application/x-mpegURL"
            }],
            language: 'tr'
        });

        playerRef.current.ready(() => {
            const player = playerRef.current;
            if (!player) return;

            if (player.nuevo) {
                player.nuevo(videoPlayerConfig);
            }

            player.on('play', () => setShowOverlay(false));
            player.on('pause', () => setShowOverlay(true));
            player.on('ended', () => setShowOverlay(true));
        });
    };

    useEffect(() => {
        if (isReady && videoRef.current && !playerRef.current) {
            const langScript = document.createElement("script");
            langScript.src = "/player/lang/tr.js";
            langScript.onload = initPlayer;
            if (!document.querySelector('script[src="/player/lang/tr.js"]')) {
                document.body.appendChild(langScript);
            } else {
                initPlayer();
            }
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [isReady]);

    return { showOverlay };
}

