/**
 * Utility types and type guards
 */

export interface ErrorWithMessage {
    message: string;
}

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as Record<string, unknown>).message === "string"
    );
}

export interface VideoJSPlayer {
    play: () => Promise<void>;
    pause: () => void;
    dispose: () => void;
    ready: (callback: () => void) => void;
    on: (event: string, callback: () => void) => void;
    nuevo?: (options: unknown) => void;
}

declare global {
    interface Window {
        videojs?: {
            (element: HTMLElement | string, options?: unknown): VideoJSPlayer;
        };
    }
}
