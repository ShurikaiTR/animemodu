import { isErrorWithMessage } from "@/shared/types/helpers";

/**
 * Logs an error with context information
 * In development: outputs to console
 * In production: could be extended to send to error tracking service (Sentry, etc.)
 */
export function logError(context: string, error: unknown): void {
    if (process.env.NODE_ENV === "development") {
        console.error(`[${context}]`, error);
    }
    // TODO: In production, send to error tracking service like Sentry
    // if (process.env.NODE_ENV === "production") {
    //     Sentry.captureException(error, { extra: { context } });
    // }
}

/**
 * Extracts a user-friendly error message from an unknown error
 */
export function getErrorMessage(error: unknown, fallback = "Bilinmeyen hata oluştu"): string {
    if (isErrorWithMessage(error)) {
        return error.message;
    }
    return fallback;
}

/**
 * Combined helper: logs error and returns message
 */
export function handleError(context: string, error: unknown, fallback?: string): string {
    logError(context, error);
    return getErrorMessage(error, fallback);
}







