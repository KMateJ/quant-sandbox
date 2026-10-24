const MINUS = "−";
const grouped = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/// Whole currency units, grouped, with a true minus: `−12,345`.
export const money = (x: number) => (Number.isFinite(x) ? (x < -0.5 ? MINUS : "") + grouped.format(Math.abs(Math.round(x))) : "—");

/// Signed whole units: `+12,345`, `−12,345`, `0`.
export const signedMoney = (x: number) => (Math.abs(x) < 0.5 ? "0" : (x > 0 ? "+" : "") + money(x));

/// Rate as a percentage with `d` decimals: `3.4512%`.
export const rate = (x: number, d = 3) => (Number.isFinite(x) ? `${(x * 100).toFixed(d)}%` : "—");

/// Short axis amount: `1.2m`, `350k`, `900`.
export function compact(x: number): string {
  const a = Math.abs(x);
  const s = x < 0 ? MINUS : "";
  if (a >= 1e6) return `${s}${(a / 1e6).toFixed(a >= 1e7 ? 0 : 1)}m`;
  if (a >= 1e3) return `${s}${(a / 1e3).toFixed(0)}k`;
  return `${s}${a.toFixed(0)}`;
}

/// Payment time as years: `0.25y`, `5y`.
export const years = (t: number) => `${Number(t.toFixed(2))}y`;
