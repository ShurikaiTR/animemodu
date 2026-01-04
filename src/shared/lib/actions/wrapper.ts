import { logError } from "@/shared/lib/errors";

export type ActionResult<T = void> =
    | { success: true; data?: T }
    | { success: false; error: string };

/**
 * Wraps a server action promise to handle errors centrally.
 * @param fn The async function to execute
 * @param context Optional context string for error logging
 */
export async function safeAction<T = void>(
    fn: () => Promise<T>,
    context: string = "ServerAction"
): Promise<ActionResult<T>> {
    try {
        const data = await fn();
        return { success: true, data };
    } catch (error: unknown) {
        logError(context, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "İşlem sırasında beklenmedik bir hata oluştu."
        };
    }
}
