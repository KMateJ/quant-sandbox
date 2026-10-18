import { blackScholesCall, blackScholesPut } from "../../black-scholes/blackScholes.math";
import type { PositionGroup, StrategyLeg } from "../payoff.types";
import type {
  DensityPoint,
  MarketParams,
  PayoffNode,
  PayoffShape,
  PiecewiseLinear,
  ReplicationLeg,
  ReplicationMethod,
  ReplicationPortfolio,
} from "./replication.types";

const EPS = 1e-9;

// #region Payoff shape

/// Sorts nodes by x and drops duplicates closer than `EPS` (later node wins).
export function sortNodes(shape: PayoffShape) {
  const sorted = [...shape.nodes].sort((a, b) => a.x - b.x);
  return sorted.filter((n, i) => i === sorted.length - 1 || sorted[i + 1].x - n.x > EPS);
}

/// Turns the drawn nodes into a piecewise-linear payoff on [0, ∞).
/// Each edge between two nodes stays flat, then ramps over a width that shrinks with steepness
/// (the node's own edge override, else the shape-wide value).
export function buildPiecewise(shape: PayoffShape): PiecewiseLinear {
  const nodes = sortNodes(shape);
  if (!nodes.length) return { xs: [0], ys: [0], rightSlope: shape.rightSlope };

  const xs: number[] = [];
  const ys: number[] = [];
  const push = (x: number, y: number) => {
    if (xs.length && x - xs[xs.length - 1] < EPS) return;
    xs.push(x);
    ys.push(y);
  };

  const first = nodes[0];
  if (first.x > EPS) push(0, first.y - shape.leftSlope * first.x);

  nodes.forEach((node, i) => {
    push(node.x, node.y);
    const next = nodes[i + 1];
    const width = 1 - 0.98 * Math.min(1, Math.max(0, node.steepness ?? shape.steepness));
    if (!next || width >= 1) return;
    const mid = (node.x + next.x) / 2;
    const half = ((next.x - node.x) * width) / 2;
    push(mid - half, node.y);
    push(mid + half, next.y);
  });

  return { xs, ys, rightSlope: shape.rightSlope };
}

/// Evaluates the piecewise-linear payoff at terminal price `S`.
export function evalPiecewise(pw: PiecewiseLinear, S: number): number {
  const { xs, ys } = pw;
  const last = xs.length - 1;
  if (S >= xs[last]) return ys[last] + pw.rightSlope * (S - xs[last]);
  if (S <= xs[0]) return ys[0];
  let i = 1;
  while (xs[i] < S) i += 1;
  const t = (S - xs[i - 1]) / (xs[i] - xs[i - 1]);
  return ys[i - 1] + t * (ys[i] - ys[i - 1]);
}

function segmentSlopes(pw: PiecewiseLinear): number[] {
  const slopes = pw.xs.slice(1).map((x, i) => (pw.ys[i + 1] - pw.ys[i]) / (x - pw.xs[i]));
  return [...slopes, pw.rightSlope];
}

/// Kinks of the payoff: strike and slope change f'(K+) − f'(K−), i.e. the weight f''(K) dK.
export function kinks(pw: PiecewiseLinear): { strike: number; weight: number }[] {
  const slopes = segmentSlopes(pw);
  return pw.xs
    .slice(1)
    .map((strike, i) => ({ strike, weight: slopes[i + 1] - slopes[i] }))
    .filter((k) => Math.abs(k.weight) > 1e-10);
}

/// Right derivative f'(S+).
export function slopeAt(pw: PiecewiseLinear, S: number): number {
  const slopes = segmentSlopes(pw);
  let i = 0;
  while (i < pw.xs.length - 1 && pw.xs[i + 1] <= S) i += 1;
  return slopes[i];
}

/// Y-range covering the payoff on [0, xMax], its nodes and zero, padded and rounded to steps of 5.
export function payoffYDomain(pw: PiecewiseLinear, nodes: PayoffNode[], xMax: number): [number, number] {
  const values = [0, ...nodes.map((n) => n.y), ...[...pw.xs.filter((x) => x < xMax), xMax].map((x) => evalPiecewise(pw, x))];
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = Math.max(5, 0.15 * (hi - lo));
  return [Math.floor((lo - pad) / 5) * 5, Math.ceil((hi + pad) / 5) * 5];
}

// #endregion

// #region Market

export function forwardPrice(m: MarketParams): number {
  return m.spot * Math.exp(m.rate * m.maturity);
}

/// Implied volatility per strike: σ(K) = σ + skew · ln(K / F), floored to keep prices sane.
export function smileVol(m: MarketParams, K: number): number {
  const v = m.sigma + m.skew * Math.log(K / forwardPrice(m));
  return Math.min(3, Math.max(0.02, v));
}

export function callPrice(m: MarketParams, K: number): number {
  return blackScholesCall(m.spot, K, m.maturity, m.rate, smileVol(m, K));
}

export function putPrice(m: MarketParams, K: number): number {
  return blackScholesPut(m.spot, K, m.maturity, m.rate, smileVol(m, K));
}

function unitPrice(m: MarketParams, leg: Omit<ReplicationLeg, "unitPrice">): number {
  switch (leg.kind) {
    case "bond": return (leg.strike ?? 0) * Math.exp(-m.rate * m.maturity);
    case "stock": return m.spot;
    case "forward": return 0;
    case "call": return callPrice(m, leg.strike ?? 0);
    case "put": return putPrice(m, leg.strike ?? 0);
  }
}

// #endregion

// #region Replication

/// Static replication of a piecewise-linear payoff (Carr–Madan spanning formula):
/// f(S) = f(a) + f'(a)(S − a) + ∫_{K<a} f''(K)(K − S)⁺ dK + ∫_{K>a} f''(K)(S − K)⁺ dK.
/// `calls`: a = 0, `puts`: a = last kink, `carr-madan`: a = forward F (linear part via a forward).
export function replicate(pw: PiecewiseLinear, m: MarketParams, method: ReplicationMethod): ReplicationPortfolio {
  const ks = kinks(pw);
  const F = forwardPrice(m);
  const raw: Omit<ReplicationLeg, "unitPrice">[] = [];

  if (method === "calls") {
    raw.push({ kind: "bond", strike: 1, quantity: evalPiecewise(pw, 0) });
    raw.push({ kind: "stock", quantity: slopeAt(pw, 0) });
    ks.forEach((k) => raw.push({ kind: "call", strike: k.strike, quantity: k.weight }));
  } else if (method === "puts") {
    const anchor = pw.xs[pw.xs.length - 1];
    raw.push({ kind: "bond", strike: 1, quantity: evalPiecewise(pw, anchor) - pw.rightSlope * anchor });
    raw.push({ kind: "stock", quantity: pw.rightSlope });
    ks.forEach((k) => raw.push({ kind: "put", strike: k.strike, quantity: k.weight }));
  } else {
    raw.push({ kind: "bond", strike: 1, quantity: evalPiecewise(pw, F) });
    raw.push({ kind: "forward", strike: F, quantity: slopeAt(pw, F) });
    ks.forEach((k) => raw.push({ kind: k.strike <= F ? "put" : "call", strike: k.strike, quantity: k.weight }));
  }

  const legs = raw
    .filter((l) => Math.abs(l.quantity) > 1e-10)
    .map((l) => ({ ...l, unitPrice: unitPrice(m, l) }));
  return { method, legs, total: legs.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0) };
}

/// Terminal payoff of a single replication leg at `S`.
export function legPayoff(leg: ReplicationLeg, S: number): number {
  const K = leg.strike ?? 0;
  switch (leg.kind) {
    case "bond": return leg.quantity * K;
    case "stock": return leg.quantity * S;
    case "forward": return leg.quantity * (S - K);
    case "call": return leg.quantity * Math.max(S - K, 0);
    case "put": return leg.quantity * Math.max(K - S, 0);
  }
}

export function portfolioPayoff(p: ReplicationPortfolio, S: number): number {
  return p.legs.reduce((sum, leg) => sum + legPayoff(leg, S), 0);
}

// #endregion

// #region Breeden–Litzenberger

/// Risk-neutral density from call prices: q(K) = e^{rT} ∂²C/∂K², via central differences.
export function blDensity(m: MarketParams, K: number, h: number): number {
  if (K - h <= 0) return 0;
  const c2 = (callPrice(m, K + h) - 2 * callPrice(m, K) + callPrice(m, K - h)) / (h * h);
  return Math.exp(m.rate * m.maturity) * c2;
}

function densityUpper(m: MarketParams, xMax: number): number {
  const sd = Math.max(m.sigma, smileVol(m, forwardPrice(m) * 3)) * Math.sqrt(m.maturity);
  return Math.max(xMax, forwardPrice(m) * Math.exp(7 * sd));
}

/// Price as a discounted expectation under the Breeden–Litzenberger density (trapezoid rule).
export function blPrice(pw: PiecewiseLinear, m: MarketParams, xMax: number, n = 4000) {
  const upper = densityUpper(m, xMax);
  const h = upper / n;
  let integral = 0;
  let mass = 0;
  for (let i = 1; i < n; i += 1) {
    const K = i * h;
    const q = blDensity(m, K, h);
    integral += evalPiecewise(pw, K) * q * h;
    mass += q * h;
  }
  return { price: Math.exp(-m.rate * m.maturity) * integral, mass };
}

/// Density curve for plotting; `flat` is the lognormal (skew = 0) reference when a skew is set.
export function densityCurve(m: MarketParams, xMax: number, n = 160): DensityPoint[] {
  const h = xMax / 400;
  const flat = { ...m, skew: 0 };
  return Array.from({ length: n }, (_, i) => {
    const S = (xMax * (i + 1)) / n;
    const point: DensityPoint = { S, density: Math.max(0, blDensity(m, S, h)) };
    if (m.skew !== 0) point.flat = blDensity(flat, S, h);
    return point;
  });
}

// #endregion

// #region Discrete strike grid

/// What can actually be replicated when options trade only every `step`:
/// the payoff interpolated linearly between grid strikes (exact when `step` is 0).
export function onStrikeGrid(pw: PiecewiseLinear, step: number): PiecewiseLinear {
  if (step <= 0) return pw;
  const top = Math.max(step, Math.ceil(pw.xs[pw.xs.length - 1] / step - EPS) * step);
  const xs = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  return { xs, ys: xs.map((x) => evalPiecewise(pw, x)), rightSlope: pw.rightSlope };
}

/// All replication methods on the tradable strike grid.
export function replicateAll(pw: PiecewiseLinear, m: MarketParams, methods: ReplicationMethod[]) {
  const tradable = onStrikeGrid(pw, m.strikeStep);
  return { tradable, portfolios: methods.map((method) => replicate(tradable, m, method)) };
}

/// Replication price minus the exact density price, for a range of strike spacings.
export function gridConvergence(pw: PiecewiseLinear, m: MarketParams, exact: number, steps: number[]) {
  return steps.map((step) => {
    const price = replicate(onStrikeGrid(pw, step), m, "calls").total;
    return { step, price, error: price - exact };
  });
}

/// Largest single option position and total option count Σ|q| (cost of steep edges).
export function optionSizing(p: ReplicationPortfolio) {
  const qs = p.legs.filter((l) => l.kind === "call" || l.kind === "put").map((l) => Math.abs(l.quantity));
  return { max: qs.length ? Math.max(...qs) : 0, gross: qs.reduce((a, b) => a + b, 0) };
}

// #endregion

// #region Strategy builder export

const round6 = (v: number) => Math.round(v * 1e6) / 1e6;

/// Maps a replicating portfolio onto Strategy Builder legs (bond → cash growing at the risk-free rate).
export function toStrategyLegs(p: ReplicationPortfolio, m: MarketParams): StrategyLeg[] {
  const growth = Math.exp(m.rate * m.maturity);
  return p.legs.map((leg, i) => {
    const base = {
      id: `repl-${i + 1}`,
      direction: leg.quantity >= 0 ? "long" : "short",
      quantity: round6(Math.abs(leg.quantity)),
    } as const;
    switch (leg.kind) {
      case "bond": return { ...base, type: "cash", cashAmount: round6(1 / growth), rate: round6(growth - 1) };
      case "stock": return { ...base, type: "stock", entryPrice: round6(m.spot) };
      case "forward": return { ...base, type: "forward", forwardPrice: round6(leg.strike ?? 0), strike: round6(leg.strike ?? 0) };
      default: return { ...base, type: leg.kind, strike: round6(leg.strike ?? 0), premium: round6(leg.unitPrice) };
    }
  });
}

/// Each portfolio becomes one named builder position (long ×1) holding its legs.
export function toBuilderPositions(
  portfolios: ReplicationPortfolio[],
  m: MarketParams,
  name: (p: ReplicationPortfolio) => string
): { legs: StrategyLeg[]; groups: PositionGroup[] } {
  const groups = portfolios.map((p, i) => ({ id: `repl-pos-${i + 1}`, name: name(p), direction: "long" as const, quantity: 1 }));
  const legs = portfolios.flatMap((p, i) =>
    toStrategyLegs(p, m).map((leg, j) => ({ ...leg, id: `repl-${i + 1}-${j + 1}`, groupId: groups[i].id }))
  );
  return { legs, groups };
}

// #endregion
