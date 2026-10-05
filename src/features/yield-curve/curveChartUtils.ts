/// Shared representation colours for the Yield Curve Lab (same hues across every view).
export const YC_COLORS = {
  par: "#38bdf8",
  zero: "#f59e0b",
  forward: "#a78bfa",
  df: "#22c55e",
  baseline: "#64748b",
  highlight: "#f97316",
} as const;

export type RepKey = "par" | "zero" | "forward";

/// Format a (possibly fractional) node index into its maturity label, e.g. 5 → "10Y".
export function makeIndexFormat(labels: string[]) {
  return (v: number) => labels[Math.round(v)] ?? "";
}

export const pct2 = (v: number) => `${(v * 100).toFixed(2)}%`;
export const pct1 = (v: number) => `${(v * 100).toFixed(1)}%`;
export const df4 = (v: number) => v.toFixed(4);
