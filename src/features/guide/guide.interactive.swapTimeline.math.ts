import { swapLegs, type SwapPayment } from "../../lib/finance/swap";
import { parSwap, swapZero } from "./guide.markets.math";

export type { SwapPayment };

/// The lesson's worked example: a 3-year annual payer swap on the default curve (level 4%, slope +1 pp).
export const SWAP_TIMELINE = { notional: 10_000_000, years: 3, level: 0.04, slope: 0.01 } as const;

/// The contracted fixed rate: the par swap rate on today's curve.
export const contractedRate = () => parSwap(SWAP_TIMELINE.level, SWAP_TIMELINE.slope, SWAP_TIMELINE.years).rate;

/// Discount factor with every zero rate moved by `shift`, annual compounding: (1 + r(t) + shift)^(−t).
export function shiftedDf(t: number, shift: number) {
  const { zero } = swapZero(SWAP_TIMELINE.level, SWAP_TIMELINE.slope, t);
  return (1 + zero + shift) ** -t;
}

/// Payments of the payer swap after a parallel `shift` of the zero curve, the fixed rate held at today's par rate.
/// The floating amounts are the expected values N·f_i, with forwards f_i = P(0,t_{i−1})/P(0,t_i) − 1.
export function swapTimeline(shift: number) {
  const { notional: N, years } = SWAP_TIMELINE;
  const rate = contractedRate();
  const legs = swapLegs({ notional: N, tenor: years, freq: 1, fixedRate: rate, payer: true }, { df: (t) => shiftedDf(t, shift) });
  const { payments, pvFixed, pvFloating, annuity } = legs;
  return { rate, payments, pvFixed, pvFloating, value: pvFloating - pvFixed, dv01: N * annuity * 1e-4 };
}
