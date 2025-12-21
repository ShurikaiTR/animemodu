export function formatNumber(num: number | null): string {
  if (num === null) return "0";
  return num.toLocaleString("tr-TR");
}

export function calculateChange(
  current: number | null,
  previous: number | null
): { change: string; trend: "up" | "down" } {
  if (!current || !previous || previous === 0) {
    return { change: "0%", trend: "up" };
  }
  
  const percent = ((current - previous) / previous) * 100;
  return {
    change: `${percent >= 0 ? "+" : ""}${Math.round(percent)}%`,
    trend: percent >= 0 ? "up" : "down",
  };
}

export function getDaysAgo(days: number): Date {
  const now = new Date();
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

export function handleSupabaseError<T>(
  result: { data: T | null; error: { message: string } | null },
  errorMessage: string
): T {
  if (result.error) {
    throw new Error(`${errorMessage}: ${result.error.message}`);
  }
  if (!result.data) {
    throw new Error(`${errorMessage}: Veri bulunamadı`);
  }
  return result.data;
}

