
import type { Database } from "@/types/supabase/database";

export type ReportsTable = Database["public"]["Tables"]["reports"];
export type ReportRow = ReportsTable["Row"];
export type ReportInsert = ReportsTable["Insert"];
export type ReportUpdate = ReportsTable["Update"];
