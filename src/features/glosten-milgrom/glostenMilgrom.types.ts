export type Trade = "B" | "S";

export type GmParams = { pi: number; prior: number; trueV: 0 | 1; n: number };

export type GmStep = { trade: Trade; mu: number; ask: number; bid: number; next: number };

export const DEFAULT_GM_PARAMS: GmParams = { pi: 0.2, prior: 0.5, trueV: 1, n: 50 };

export type YourQuote = { bid: number; ask: number };

/// One revealed you-quote trade: who got it, at what price, and how far your quote sat from Bayes.
export type QuoteOutcome = { trade: Trade; won: boolean; price: number; error: number };
