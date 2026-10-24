/// Number formatting for desk games: true minus signs, grouped thousands, tabular-friendly output.
/// Pure; no React.

const MINUS = "−";
const DASH = "—";
const HEAT_MIN = 0.08;
const HEAT_MAX = 0.48;
const formatters = new Map<number, Intl.NumberFormat>();

const fixed = (x: number, digits: number): string => {
  let f = formatters.get(digits);
  if (!f) {
    f = new Intl.NumberFormat("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
    formatters.set(digits, f);
  }
  return f.format(Math.abs(x));
};

const roundsToZero = (x: number, digits: number) => Math.abs(x) < 0.5 * 10 ** -digits;

/// Grouped number; negatives use a true minus sign and values that round to zero print as `0`.
export function num(x: number, digits = 2): string {
  if (!Number.isFinite(x)) return DASH;
  return (x < 0 && !roundsToZero(x, digits) ? MINUS : "") + fixed(x, digits);
}

/// Always-signed number: `+1,234`, `−1,234`, or `0` when it rounds to zero.
export function signed(x: number, digits = 0): string {
  if (!Number.isFinite(x)) return DASH;
  if (roundsToZero(x, digits)) return fixed(0, digits);
  return (x < 0 ? MINUS : "+") + fixed(x, digits);
}

/// Dollar amount with grouped thousands and no decimals: `$1,234` / `−$1,234`.
export function money(x: number): string {
  if (!Number.isFinite(x)) return DASH;
  return (x < 0 && !roundsToZero(x, 0) ? MINUS : "") + "$" + fixed(x, 0);
}

/// Signed dollar amount: `+$1,234` / `−$1,234` / `$0`.
export function signedMoney(x: number): string {
  if (!Number.isFinite(x)) return DASH;
  if (roundsToZero(x, 0)) return "$0";
  return (x < 0 ? MINUS : "+") + "$" + fixed(x, 0);
}

/// Fraction as a percentage: `0.22` → `22.0%`.
export function pct(x: number, digits = 1): string {
  if (!Number.isFinite(x)) return DASH;
  return num(x * 100, digits) + "%";
}

/// Colour class for a signed quantity inside `.gdesk`: up is blue, down is red, zero is plain.
export function toneClass(x: number): "gdesk-up" | "gdesk-down" | "" {
  return x > 0 ? "gdesk-up" : x < 0 ? "gdesk-down" : "";
}

export type HeatCell = { alpha: number; tone: "up" | "down" | "flat" };

/// Tint for a heat-grid cell: alpha grows with |value| / max (0.08–0.48); flat under 1% of `max`.
export function heatCell(value: number, max: number): HeatCell {
  if (!(max > 0) || !Number.isFinite(value) || Math.abs(value) < 0.01 * max) return { alpha: 0, tone: "flat" };
  const alpha = HEAT_MIN + (HEAT_MAX - HEAT_MIN) * Math.min(Math.abs(value) / max, 1);
  return { alpha, tone: value > 0 ? "up" : "down" };
}
