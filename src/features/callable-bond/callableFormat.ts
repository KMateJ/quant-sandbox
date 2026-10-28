const MINUS = "−";

/// Price per 100 with two decimals.
export const price = (x: number) => (Number.isFinite(x) ? x.toFixed(2) : "—");

/// Rate as a percentage: `5.25%`.
export const pct = (x: number, d = 2) => (Number.isFinite(x) ? `${(x * 100).toFixed(d)}%` : "—");

/// Signed price change in points: `+3.21`, `−1.05`.
export const signed = (x: number) => (Number.isFinite(x) ? (x < 0 ? MINUS : "+") + Math.abs(x).toFixed(2) : "—");

/// Signed percentage change: `+3.2%`.
export const signedPct = (x: number) => (Number.isFinite(x) ? (x < 0 ? MINUS : "+") + (Math.abs(x) * 100).toFixed(1) + "%" : "—");

/// A date in years: `3y`, `3.5y`.
export const years = (t: number) => `${Number(t.toFixed(2))}y`;

/// Plain number with `d` decimals and a true minus.
export const num = (x: number, d = 1) => (Number.isFinite(x) ? (x < 0 ? MINUS : "") + Math.abs(x).toFixed(d) : "—");
