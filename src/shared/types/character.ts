/**
 * Character types and parsing utilities
 */

import type { Json } from "./database.generated";

export interface Character {
    id: number;
    name: string;
    native_name?: string;
    image: string;
    role: "MAIN" | "SUPPORTING" | "BACKGROUND";
}

export type CharacterJson = Character[];

/**
 * Safely extracts characters from database JSON column
 * Returns empty array if null or invalid
 */
export function parseCharacters(characters: Json | null | undefined): Character[] {
    if (!characters || !Array.isArray(characters)) return [];

    return characters.map((c): Character => {
        const char = c as Record<string, Json | undefined>;
        return {
            id: typeof char.id === 'number' ? char.id : 0,
            name: typeof char.name === 'string' ? char.name : '',
            native_name: typeof char.native_name === 'string' ? char.native_name : undefined,
            image: typeof char.image === 'string' ? char.image : '',
            role: (char.role === 'MAIN' || char.role === 'SUPPORTING' || char.role === 'BACKGROUND')
                ? char.role
                : 'SUPPORTING',
        };
    });
}
