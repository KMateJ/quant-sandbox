/// Shared display formatters so every panel renders numbers identically.

/// Whole-currency figure with thousands separators (e.g. 1 156).
export function money(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return Math.round(value).toLocaleString("en-US");
}

/// Signed currency figure, keeping the leading sign for deltas.
export function signedMoney(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(Math.round(value)).toLocaleString("en-US")}`;
}

/// Percentage with one decimal (fraction in, e.g. 0.08 → "8.0%").
export function pct(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "—";
  return `${(value * 100).toFixed(digits)}%`;
}

/// Ratio such as the profitability index (e.g. 1.16).
export function ratio(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(2);
}

/// Colour token for a value judged against a threshold (NPV>0, IRR>rate, PI>1).
export function toneColor(favorable: boolean): string {
  return favorable ? "var(--positive)" : "var(--negative)";
}
