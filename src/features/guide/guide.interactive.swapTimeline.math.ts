import { parSwap, swapZero } from "./guide.markets.math";

/// The lesson's worked example: a 3-year annual payer swap on the default curve (level 4%, slope +1 pp).
export const SWAP_TIMELINE = { notional: 10_000_000, years: 3, level: 0.04, slope: 0.01 } as const;

/// One payment date of the swap: both legs' amounts, the discount factor and present values.
export type SwapPayment = {
  t: number;
  df: number;
  forward: number;
  fixed: number;
  floating: number;
  pvFixed: number;
  pvFloating: number;
};

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
  const payments: SwapPayment[] = [];
  let prevDf = 1;
  for (let t = 1; t <= years; t++) {
    const df = shiftedDf(t, shift);
    const forward = prevDf / df - 1;
    const fixed = N * rate;
    const floating = N * forward;
    payments.push({ t, df, forward, fixed, floating, pvFixed: fixed * df, pvFloating: floating * df });
    prevDf = df;
  }
  const pvFixed = payments.reduce((sum, p) => sum + p.pvFixed, 0);
  const pvFloating = payments.reduce((sum, p) => sum + p.pvFloating, 0);
  const annuity = payments.reduce((sum, p) => sum + p.df, 0);
  return { rate, payments, pvFixed, pvFloating, value: pvFloating - pvFixed, dv01: N * annuity * 1e-4 };
}
