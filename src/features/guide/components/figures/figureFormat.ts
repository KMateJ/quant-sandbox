/// Fixed-decimal number, or "–" when it is not finite.
export const fmt = (v: number, digits = 2) => (Number.isFinite(v) ? v.toFixed(digits) : "–");

/// Rate as a percentage with one decimal.
export const pct = (v: number, digits = 1) => `${(v * 100).toFixed(digits)}%`;
