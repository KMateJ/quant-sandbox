export type KyleParams = { p0: number; sigmaV: number; s: number; n: number };

export type KyleDraw = { v: number; u: number[] };

export type AuctionRow = { n: number; x: number; u: number; flow: number; pBefore: number; pAfter: number; profit: number };

/// A fixed plan of orders; `null` entries (or "optimal") use the optimal order for the realised gap.
export type KyleOrders = readonly (number | null)[] | "optimal";

export const DEFAULT_KYLE_PARAMS: KyleParams = { p0: 100, sigmaV: 4, s: 1000, n: 10 };
