/// Plain-vanilla interest rate swap on a single curve (the same curve projects forwards and discounts).
/// Sign convention, defined only here: MTM to the fixed payer = PV(floating) − PV(fixed); a receiver flips it.

export type SwapSpec = {
  notional: number;
  /// Years to maturity.
  tenor: number;
  /// Payments per year on both legs (1, 2 or 4).
  freq: number;
  /// Fixed rate as a fraction.
  fixedRate: number;
  /// True for the fixed payer (receives floating).
  payer: boolean;
};

/// A discount curve: P(0, t).
export type Curve = { df: (t: number) => number };

/// One payment date: both legs' amounts, the discount factor, the simple forward for the period, present values.
export type SwapPayment = {
  t: number;
  df: number;
  forward: number;
  fixed: number;
  floating: number;
  pvFixed: number;
  pvFloating: number;
};

export type SwapLegs = { payments: SwapPayment[]; pvFixed: number; pvFloating: number; annuity: number };

/// Payment times `1/freq, 2/freq, …, tenor` (the last one exactly at `tenor`).
export function paymentTimes(tenor: number, freq: number): number[] {
  const n = Math.max(1, Math.round(tenor * freq));
  return Array.from({ length: n }, (_, i) => (i + 1 === n ? tenor : (i + 1) / freq));
}

/// Every payment of both legs, unsigned. Floating amounts are the expected values N·f·Δt with the simple
/// forward f = (P(t₋)/P(t) − 1)/Δt; `annuity` = Σ Δt·P(t).
export function swapLegs(spec: SwapSpec, curve: Curve): SwapLegs {
  const payments: SwapPayment[] = [];
  let prevT = 0;
  let prevDf = 1;
  let pvFixed = 0;
  let pvFloating = 0;
  let annuity = 0;
  for (const t of paymentTimes(spec.tenor, spec.freq)) {
    const dt = t - prevT;
    const df = curve.df(t);
    const forward = (prevDf / df - 1) / dt;
    const fixed = spec.notional * spec.fixedRate * dt;
    const floating = spec.notional * forward * dt;
    payments.push({ t, df, forward, fixed, floating, pvFixed: fixed * df, pvFloating: floating * df });
    pvFixed += fixed * df;
    pvFloating += floating * df;
    annuity += dt * df;
    prevT = t;
    prevDf = df;
  }
  return { payments, pvFixed, pvFloating, annuity };
}

/// Fixed rate that makes the swap worth zero today: (1 − P(T)) / annuity.
export function parSwapRate(spec: Omit<SwapSpec, "fixedRate">, curve: Curve): number {
  const { annuity } = swapLegs({ ...spec, fixedRate: 0 }, curve);
  return (1 - curve.df(spec.tenor)) / annuity;
}

/// Mark-to-market of the swap to its holder: PV float − PV fixed for a payer, the negative for a receiver.
export function swapMtm(spec: SwapSpec, curve: Curve): number {
  const { pvFixed, pvFloating } = swapLegs(spec, curve);
  return (spec.payer ? 1 : -1) * (pvFloating - pvFixed);
}

/// MTM change for a +1 bp move: per node (key-rate DV01) and for all nodes together (parallel).
/// `nodes` are par quotes; `build` turns quotes into a curve. Node shape is the caller's.
export function keyRateDv01<N extends { t: number; rate: number }>(
  spec: SwapSpec,
  nodes: N[],
  build: (n: N[]) => Curve,
): { tenor: number; dv01: number }[] {
  const base = swapMtm(spec, build(nodes));
  return nodes.map((node, i) => ({
    tenor: node.t,
    dv01: swapMtm(spec, build(nodes.map((n, j) => (j === i ? { ...n, rate: n.rate + 1e-4 } : n)))) - base,
  }));
}

/// MTM change for every node quote moved up 1 bp together.
export function parallelDv01<N extends { t: number; rate: number }>(spec: SwapSpec, nodes: N[], build: (n: N[]) => Curve): number {
  return swapMtm(spec, build(nodes.map((n) => ({ ...n, rate: n.rate + 1e-4 })))) - swapMtm(spec, build(nodes));
}

/// Splits the MTM change from curve `from` to curve `to` by node: quotes are moved to their new value one at a
/// time, shortest first, so the parts add up exactly to the total change.
export function mtmAttribution<N extends { t: number; rate: number }>(
  spec: SwapSpec,
  from: N[],
  to: N[],
  build: (n: N[]) => Curve,
): { tenor: number; change: number }[] {
  let current = from.map((n) => ({ ...n }));
  let prev = swapMtm(spec, build(current));
  return from.map((_, i) => {
    current = current.map((n, j) => (j === i ? { ...n, rate: to[i].rate } : n));
    const next = swapMtm(spec, build(current));
    const change = next - prev;
    prev = next;
    return { tenor: from[i].t, change };
  });
}
