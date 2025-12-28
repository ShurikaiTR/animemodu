// Auto-generated Database type from Supabase CLI
// Regenerate with: npx supabase gen types typescript --project-id mlzlkrsorfzreyzkpogr > src/shared/types/database.generated.ts
export { type Database } from "./database.generated";

// Re-export Json type
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];
