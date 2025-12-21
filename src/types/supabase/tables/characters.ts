/**
 * Character type definition for anime characters
 * Used across AniList API responses and database storage
 */
export interface Character {
    id: number;
    name: {
        full: string;
        native: string;
    };
    image: {
        large: string;
        medium?: string;
    };
    role: "MAIN" | "SUPPORTING" | "BACKGROUND";
}

/**
 * Type alias for character array stored in database JSON column
 */
export type CharacterJson = Character[];

