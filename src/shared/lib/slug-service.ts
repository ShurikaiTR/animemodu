
export const SlugService = {
    /**
     * Generates a URL-friendly slug from a text string.
     * Handles special replacements like '&' -> 've', '×' -> 'x'.
     */
    generate(text: string): string {
        return text.toLowerCase()
            .replace(/×/g, "x")
            .replace(/&/g, "ve")
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
    }
};
