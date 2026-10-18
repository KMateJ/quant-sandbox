/// Whole money amount with thin-space thousands separators.
export const money = (v: number) => Math.round(v).toLocaleString("en-US").replace(/,/g, "\u202f");

/// The same with an explicit sign, for the surplus.
export const signedMoney = (v: number) => `${v >= 0 ? "+" : "−"}${money(Math.abs(v))}`;
