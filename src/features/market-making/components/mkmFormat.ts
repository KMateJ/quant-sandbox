/// Signed dollars, e.g. "+$4.10" / "−$1.25".
export const usd = (v: number) => `${v >= 0 ? "+" : "−"}$${Math.abs(v).toFixed(2)}`;

/// Cents with one decimal, e.g. "2.5¢".
export const cents = (v: number) => `${v.toFixed(1)}¢`;
