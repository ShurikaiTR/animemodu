import { describe, it, expect, vi, beforeEach } from "vitest";
import { isAuthError, type AuthResult, type AuthError } from "./guards";

// Mock the module
vi.mock("@/lib/supabase/server", () => ({
    createClient: vi.fn(),
}));

describe("isAuthError", () => {
    it("should return true for auth error", () => {
        const authError: AuthError = {
            success: false,
            error: "Unauthorized",
        };

        expect(isAuthError(authError)).toBe(true);
    });

    it("should return false for auth result", () => {
        const authResult: AuthResult = {
            userId: "123",
            role: "admin",
        };

        expect(isAuthError(authResult)).toBe(false);
    });
});

describe("Auth Guard Types", () => {
    it("should have correct AuthResult structure", () => {
        const result: AuthResult = {
            userId: "test-user-id",
            role: "admin",
        };

        expect(result.userId).toBe("test-user-id");
        expect(result.role).toBe("admin");
    });

    it("should have correct AuthError structure", () => {
        const error: AuthError = {
            success: false,
            error: "Test error message",
        };

        expect(error.success).toBe(false);
        expect(error.error).toBe("Test error message");
    });

    it("should support user role", () => {
        const result: AuthResult = {
            userId: "test-user-id",
            role: "user",
        };

        expect(result.role).toBe("user");
    });
});

