import type { InstrumentType, StrategyLeg } from "./payoff.types";

/// Fresh leg with every type-specific field pre-filled, so switching type never shows blanks.
export function createEmptyLeg(index: number): StrategyLeg {
  return {
    id: `leg-${Date.now()}-${index}`,
    type: "call",
    direction: "long",
    quantity: 1,
    strike: 100,
    premium: 0,
    entryPrice: 100,
    forwardPrice: 100,
    cashAmount: 100,
    rate: 0.05,
    payout: 10,
    lowerStrike: 90,
    upperStrike: 110,
    triggerStrike: 100,
    settlementStrike: 110,
  };
}

/// Patch applied when a leg switches to `type`: keeps compatible values, fills the rest.
export function ensureDefaults(type: InstrumentType, leg: StrategyLeg): Partial<StrategyLeg> {
  switch (type) {
    case "call":
    case "put":
    case "asset-call":
    case "asset-put":
      return { type, strike: leg.strike ?? 100, premium: leg.premium ?? 0 };
    case "digital-call":
    case "digital-put":
      return { type, strike: leg.strike ?? 100, premium: leg.premium ?? 0, payout: leg.payout ?? 10 };
    case "gap-call":
    case "gap-put":
      return {
        type,
        triggerStrike: leg.triggerStrike ?? leg.strike ?? 100,
        settlementStrike: leg.settlementStrike ?? 110,
        premium: leg.premium ?? 0,
      };
    case "double-digital":
      return {
        type,
        lowerStrike: leg.lowerStrike ?? 90,
        upperStrike: leg.upperStrike ?? 110,
        premium: leg.premium ?? 0,
        payout: leg.payout ?? 10,
      };
    case "supershare":
      return { type, lowerStrike: leg.lowerStrike ?? 90, upperStrike: leg.upperStrike ?? 110, premium: leg.premium ?? 0 };
    case "forward":
      return { type, strike: leg.strike ?? 100, forwardPrice: leg.forwardPrice ?? leg.strike ?? 100 };
    case "stock":
      return { type, entryPrice: leg.entryPrice ?? 100 };
    case "cash":
      return { type, cashAmount: leg.cashAmount ?? 100, rate: leg.rate ?? 0.05 };
  }
}
