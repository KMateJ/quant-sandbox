/// λ in $ per share shown as ¢ per 100 shares.
export const fmtLambda = (lambda: number) => (lambda * 1e4).toFixed(1);
export const fmtPrice = (v: number) => v.toFixed(2);
export const fmtShares = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(Math.round(v)).toLocaleString("en-US")}`;
export const fmtMoney = (v: number) => `${v >= 0 ? "+" : "−"}$${Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
export const fmtIndex = (v: number) => String(Math.round(v));
