import { describe, expect,it } from "vitest";

import { addAnimeSchema, formatZodError,updateAnimeSchema, updateEpisodeSchema } from "./anime";

describe("addAnimeSchema", () => {
    it("should validate valid input", () => {
        const validInput = {
            tmdbItem: JSON.stringify({
                id: 123,
                title: "Test Anime",
                media_type: "tv",
            }),
            customTitle: "Test Anime Türkçe",
            structureType: "seasonal",
        };

        const result = addAnimeSchema.safeParse(validInput);
        expect(result.success).toBe(true);
    });

    it("should reject empty customTitle", () => {
        const invalidInput = {
            tmdbItem: JSON.stringify({ id: 123 }),
            customTitle: "",
            structureType: "seasonal",
        };

        const result = addAnimeSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
    });

    it("should reject invalid structureType", () => {
        const invalidInput = {
            tmdbItem: JSON.stringify({ id: 123 }),
            customTitle: "Test",
            structureType: "invalid",
        };

        const result = addAnimeSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
    });

    it("should reject invalid JSON in tmdbItem", () => {
        const invalidInput = {
            tmdbItem: "not-json",
            customTitle: "Test",
            structureType: "seasonal",
        };

        const result = addAnimeSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
    });
});

describe("updateAnimeSchema", () => {
    it("should validate with only id", () => {
        const input = { id: "123" };
        const result = updateAnimeSchema.safeParse(input);
        expect(result.success).toBe(true);
        expect(result.data?.id).toBe(123);
    });

    it("should coerce string id to number", () => {
        const input = { id: "456" };
        const result = updateAnimeSchema.safeParse(input);
        expect(result.success).toBe(true);
        expect(result.data?.id).toBe(456);
    });

    it("should reject invalid id", () => {
        const input = { id: "not-a-number" };
        const result = updateAnimeSchema.safeParse(input);
        expect(result.success).toBe(false);
    });
});

describe("updateEpisodeSchema", () => {
    it("should validate with valid video_url", () => {
        const input = {
            id: "1",
            video_url: "https://example.com/video.mp4",
        };

        const result = updateEpisodeSchema.safeParse(input);
        expect(result.success).toBe(true);
    });

    it("should allow empty video_url", () => {
        const input = {
            id: "1",
            video_url: "",
        };

        const result = updateEpisodeSchema.safeParse(input);
        expect(result.success).toBe(true);
        expect(result.data?.video_url).toBe(null);
    });
});

describe("formatZodError", () => {
    it("should format single error", () => {
        const result = addAnimeSchema.safeParse({
            tmdbItem: "{}",
            customTitle: "",
            structureType: "seasonal",
        });

        if (!result.success) {
            const message = formatZodError(result.error);
            expect(message).toContain("customTitle");
        }
    });
});

