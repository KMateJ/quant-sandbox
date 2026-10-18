export type OptionKind = "call" | "put";

/// Payoff at maturity of a European option: max(S − K, 0) for a call, max(K − S, 0) for a put.
export function optionPayoff(stockPrice: number, strike: number, kind: OptionKind): number {
  return kind === "call" ? Math.max(stockPrice - strike, 0) : Math.max(strike - stockPrice, 0);
}

/// Payoff at maturity of a long forward with delivery price K: S − K.
export function forwardPayoff(stockPrice: number, deliveryPrice: number): number {
  return stockPrice - deliveryPrice;
}
