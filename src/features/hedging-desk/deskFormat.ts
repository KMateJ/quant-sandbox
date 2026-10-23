/// Number formatting for the desk: true minus signs, grouped thousands, tabular-friendly output.
/// Pure; no React.

const MINUS = "−";
const DASH = "—";
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

/// Colour class for a signed quantity inside `.hdesk`: up is blue, down is red, zero is plain.
export function toneClass(x: number): "hdesk-up" | "hdesk-down" | "" {
  return x > 0 ? "hdesk-up" : x < 0 ? "hdesk-down" : "";
}
