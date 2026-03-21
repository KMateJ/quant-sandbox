export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function parseNumber(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
  decimals?: number
) {
  if (value == null || value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const clamped = clamp(parsed, min, max);
  if (decimals == null) return clamped;
  return Number(clamped.toFixed(decimals));
}

export function formatNumber(value: number, decimals?: number) {
  if (decimals == null) return String(value);
  return String(Number(value.toFixed(decimals)));
}

export function smooth(values: number[], window = 2): number[] {
  return values.map((_, i) => {
    const start = Math.max(0, i - window);
    const end = Math.min(values.length - 1, i + window);
    const slice = values.slice(start, end + 1);
    return slice.reduce((sum, x) => sum + x, 0) / slice.length;
  });
}