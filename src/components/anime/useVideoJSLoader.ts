import { useEffect, useState } from "react";

export function useVideoJSLoader(isDirectVideo: boolean) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!isDirectVideo) {
            setIsReady(true);
            return;
        }

        const loadCSS = () => {
            const existingLink = document.querySelector('link[href="/player/skins/flow/videojs.min.css"]');
            if (existingLink) {
                checkReady();
                return;
            }

            const link = document.createElement("link");
            link.href = "/player/skins/flow/videojs.min.css";
            link.rel = "stylesheet";
            document.head.appendChild(link);
            
            const checkCSS = setInterval(() => {
                const stylesheets = Array.from(document.styleSheets);
                const cssLoaded = stylesheets.some(sheet => {
                    try {
                        return sheet.href?.includes('videojs.min.css');
                    } catch {
                        return false;
                    }
                });
                
                if (cssLoaded) {
                    clearInterval(checkCSS);
                    checkReady();
                }
            }, 50);

            setTimeout(() => {
                clearInterval(checkCSS);
                checkReady();
            }, 2000);
        };

        const checkReady = () => {
            if (window.videojs) {
                setIsReady(true);
            } else {
                const checkVideoJS = setInterval(() => {
                    if (window.videojs) {
                        clearInterval(checkVideoJS);
                        setIsReady(true);
                    }
                }, 50);
                
                setTimeout(() => {
                    clearInterval(checkVideoJS);
                    setIsReady(true);
                }, 3000);
            }
        };

        loadCSS();
    }, [isDirectVideo]);

    return isReady;
}

