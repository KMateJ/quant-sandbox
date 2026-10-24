import { convexityOf, macaulay, matchWeights, pricePerFace } from "../../lib/finance/immunization";
import { makeRng } from "../../lib/math/random";
import type { Attribution, Curve, GameConfig, GameState, Position, RoundResult, Shock } from "./immunization.types";

/// Tenors (years) of the three bonds on offer; weights are over these and cash, in this order.
export const TENORS = [2, 5, 12];
export const SLOTS = TENORS.length + 1;

export const DEFAULT_CONFIG: GameConfig = { liability: 1_000_000, years: 8, level0: 0.05, costBp: 5, maxParallelBp: 100, maxTwistBp: 50 };

const clampYield = (y: number) => Math.min(0.2, Math.max(0.001, y));

/// Yield at `tau` years on `curve`.
export const yieldAt = (curve: Curve, tau: number) => clampYield(curve.level + (curve.slope * (tau - 7)) / 10);

const positionValue = (p: Position, curve: Curve) => p.face * pricePerFace(p.coupon, p.maturity, yieldAt(curve, p.maturity));

/// Market value of the bonds plus cash.
export const assetsValue = (s: GameState) => s.cash + s.positions.reduce((sum, p) => sum + positionValue(p, s.curve), 0);

/// Years left until the liability is due.
export const yearsLeft = (s: GameState, c: GameConfig) => c.years - s.round;

/// Liability payments still owed: the main one at `years`, plus extra ones announced and not yet paid.
export function liabilityFlows(s: GameState, c: GameConfig): { amount: number; n: number }[] {
  const extra = (c.extraLiabilities ?? []).filter((e) => s.round >= e.from && s.round < e.year);
  return [{ amount: c.liability, n: yearsLeft(s, c) }, ...extra.map((e) => ({ amount: e.amount, n: e.year - s.round }))];
}

const flowPv = (curve: Curve, f: { amount: number; n: number }) => f.amount / (1 + yieldAt(curve, f.n)) ** f.n;

/// PV of the liability on the state's curve.
export const liabilityPv = (s: GameState, c: GameConfig) => liabilityFlows(s, c).reduce((sum, f) => sum + flowPv(s.curve, f), 0);

/// Assets minus the PV of the liability.
export const surplusOf = (s: GameState, c: GameConfig) => assetsValue(s) - liabilityPv(s, c);

/// Share of assets in each slot (the three bonds, then cash).
export function weightsOf(s: GameState): number[] {
  const total = assetsValue(s);
  const w = [...TENORS.map(() => 0), s.cash / total];
  for (const p of s.positions) w[p.slot] += positionValue(p, s.curve) / total;
  return w;
}

/// Value-weighted modified duration and convexity of the bonds (cash counts as zero).
export function exposure(s: GameState): { dMod: number; convexity: number } {
  const total = assetsValue(s);
  let dur = 0;
  let cvx = 0;
  for (const p of s.positions) {
    const y = yieldAt(s.curve, p.maturity);
    const v = positionValue(p, s.curve);
    dur += (v * macaulay(p.coupon, p.maturity, y)) / (1 + y);
    cvx += v * convexityOf(p.coupon, p.maturity, y);
  }
  return { dMod: dur / total, convexity: cvx / total };
}

/// Modified duration of the liability.
export function liabilityDuration(s: GameState, c: GameConfig): number {
  return pvWeighted(s, c, (n, y) => n / (1 + y));
}

/// Convexity of the liability.
export function liabilityConvexity(s: GameState, c: GameConfig): number {
  return pvWeighted(s, c, (n, y) => (n * (n + 1)) / (1 + y) ** 2);
}

/// PV-weighted average of a per-payment measure over the liability's payments.
function pvWeighted(s: GameState, c: GameConfig, measure: (n: number, y: number) => number): number {
  const flows = liabilityFlows(s, c);
  if (flows.length === 1) return measure(flows[0].n, yieldAt(s.curve, flows[0].n));
  const pvs = flows.map((f) => flowPv(s.curve, f));
  const total = pvs.reduce((a, b) => a + b, 0);
  return flows.reduce((sum, f, i) => sum + (pvs[i] / total) * measure(f.n, yieldAt(s.curve, f.n)), 0);
}

/// Weights that match the liability's PV and duration now: the new-issue bonds and cash (duration 0) bracketing it.
export function immunisedWeights(s: GameState, c: GameConfig): number[] {
  const durations = [
    ...TENORS.map((m) => {
      const y = yieldAt(s.curve, m);
      return macaulay(y, m, y) / (1 + y);
    }),
    0,
  ];
  return matchWeights(durations, liabilityDuration(s, c));
}

/// A new-issue par bond of `slot` on `curve`, bought with `value`.
const issue = (slot: number, value: number, curve: Curve): Position => {
  const y = yieldAt(curve, TENORS[slot]);
  return { slot, coupon: y, maturity: TENORS[slot], face: value };
};

/// Splits `value` over the slots by `weights` (the last is cash) as new-issue par bonds.
function invest(weights: number[], value: number, curve: Curve): Pick<GameState, "cash" | "positions"> {
  const positions = TENORS.flatMap((_, slot) => (weights[slot] > 1e-12 ? [issue(slot, weights[slot] * value, curve)] : []));
  return { cash: weights[TENORS.length] * value, positions };
}

/// A new game: the liability's PV invested in the immunised mix, so the surplus starts at zero.
export function newGame(seed: number, config: GameConfig = DEFAULT_CONFIG): GameState {
  const base: GameState = { seed, round: 0, curve: { level: config.level0, slope: 0 }, cash: 0, positions: [], pendingCost: 0, history: [] };
  return { ...base, ...invest(immunisedWeights(base, config), liabilityPv(base, config), base.curve) };
}

/// The seeded shock of round `round` (1-based): parallel and twist in multiples of 10 bp.
export function drawShock(seed: number, round: number, config: GameConfig = DEFAULT_CONFIG): Shock {
  const rng = makeRng(seed * 7919 + round * 104729);
  const draw = (max: number) => Math.round(((rng() * 2 - 1) * max) / 10) * 10;
  return { parallelBp: draw(config.maxParallelBp), twistBp: draw(config.maxTwistBp) };
}

/// Time moves on one year with the curve unchanged: coupons and redemptions go to cash, cash earns the 1-year yield,
/// and extra liabilities falling due are paid from cash.
function age(s: GameState, config?: GameConfig): GameState {
  let cash = s.cash * (1 + yieldAt(s.curve, 1));
  const positions: Position[] = [];
  for (const p of s.positions) {
    cash += p.face * p.coupon;
    if (p.maturity > 1) positions.push({ ...p, maturity: p.maturity - 1 });
    else cash += p.face;
  }
  const round = s.round + 1;
  for (const e of config?.extraLiabilities ?? []) if (e.year === round && s.round >= e.from) cash -= e.amount;
  return { ...s, round, cash, positions };
}

/// Splits the surplus change of one round (from before the last rebalance to after the shock) into carry (a year at
/// the old curve), rate (first order in the yield moves), convexity (the rest of the curve move) and trading cost.
export function surplusAttribution(prev: GameState, next: GameState, config: GameConfig): Attribution {
  const aged = age(prev, config);
  const carry = surplusOf(aged, config) - surplusOf(prev, config);
  let rate = 0;
  for (const p of aged.positions) {
    const y = yieldAt(aged.curve, p.maturity);
    const dy = yieldAt(next.curve, p.maturity) - y;
    rate -= ((positionValue(p, aged.curve) * macaulay(p.coupon, p.maturity, y)) / (1 + y)) * dy;
  }
  for (const f of liabilityFlows(aged, config)) {
    if (f.n <= 0) continue;
    const y = yieldAt(aged.curve, f.n);
    rate += ((flowPv(aged.curve, f) * f.n) / (1 + y)) * (yieldAt(next.curve, f.n) - y);
  }
  const cost = -prev.pendingCost;
  const total = surplusOf(next, config) - (surplusOf(prev, config) + prev.pendingCost);
  return { carry, rate, convexity: total - cost - carry - rate, cost };
}

/// `curve` after a yearly shock (level kept in 0.5–12%, slope within ±5%).
export function shiftCurve(curve: Curve, shock: Shock): Curve {
  const level = Math.min(0.12, Math.max(0.005, curve.level + shock.parallelBp / 10000));
  const slope = Math.max(-0.05, Math.min(0.05, curve.slope + shock.twistBp / 10000));
  return { level, slope };
}

/// Plays one round: a year passes and `shock` moves the curve; the result is appended to the history.
export function advance(s: GameState, shock: Shock, config: GameConfig = DEFAULT_CONFIG): GameState {
  if (s.round >= config.years) return s;
  const aged = age(s, config);
  const next: GameState = { ...aged, curve: shiftCurve(s.curve, shock), pendingCost: 0 };
  const result: RoundResult = {
    round: next.round,
    shock,
    surplus: surplusOf(next, config),
    assets: assetsValue(next),
    liability: liabilityPv(next, config),
    attribution: surplusAttribution(s, next, config),
  };
  return { ...next, history: [...s.history, result] };
}

/// Moves the portfolio to `weights` (bonds then cash, summing to 1): slots whose weight changes are sold and bought
/// again as new-issue par bonds, and the trading cost (`costBp` of the value moved) is paid from the assets.
export function rebalance(s: GameState, weights: number[], config: GameConfig = DEFAULT_CONFIG): GameState {
  const total = assetsValue(s);
  const current = weightsOf(s);
  const moved = (total * weights.reduce((sum, w, i) => sum + Math.abs(w - current[i]), 0)) / 2;
  if (moved < 1e-6) return s;
  const cost = (moved * config.costBp) / 10000;
  const same = (i: number) => Math.abs(weights[i] - current[i]) < 1e-9;
  const kept = s.positions.filter((p) => same(p.slot));
  const keptValue = kept.reduce((sum, p) => sum + positionValue(p, s.curve), 0);
  const cashKept = same(TENORS.length);
  // The money freed by the changed slots (less the cost) is spread over their new weights.
  const free = weights.map((w, i) => (same(i) ? 0 : w));
  const freeWeight = free.reduce((a, b) => a + b, 0);
  const freeValue = total - cost - keptValue - (cashKept ? s.cash : 0);
  const bought = invest(free.map((w) => (freeWeight > 0 ? w / freeWeight : 0)), freeValue, s.curve);
  return { ...s, positions: [...kept, ...bought.positions], cash: (cashKept ? s.cash : 0) + bought.cash, pendingCost: s.pendingCost + cost };
}

/// Surplus after each round (index 0 = the start) for the same seed with no rebalancing, and with a free
/// rebalance to the immunised mix every year.
export function benchmarks(seed: number, config: GameConfig = DEFAULT_CONFIG): { buyHold: number[]; autoImmunised: number[] } {
  const run = (auto: boolean) => {
    let s = newGame(seed, config);
    const out = [surplusOf(s, config)];
    for (let r = 1; r <= config.years; r++) {
      if (auto) s = rebalance(s, immunisedWeights(s, config), { ...config, costBp: 0 });
      s = advance(s, drawShock(seed, r, config), config);
      out.push(surplusOf(s, config));
    }
    return out;
  };
  return { buyHold: run(false), autoImmunised: run(true) };
}

/// Sets weight `i` to `value` (0–1) and rescales the others proportionally so the total stays 1.
export function setWeight(weights: number[], i: number, value: number): number[] {
  const v = Math.min(1, Math.max(0, value));
  const others = weights.reduce((sum, w, j) => (j === i ? sum : sum + w), 0);
  return weights.map((w, j) => (j === i ? v : others > 0 ? (w / others) * (1 - v) : (1 - v) / (weights.length - 1)));
}

/// Currency amount with thousands separators and a minus sign for negatives.
export const money = (v: number) => `${v < 0 ? "−" : ""}${Math.round(Math.abs(v)).toLocaleString("en-US")}`;

/// Compact currency amount for axis ticks: 12,000 → "12k".
export const moneyShort = (v: number) => (Math.abs(v) >= 1000 ? `${v < 0 ? "−" : ""}${Math.round(Math.abs(v) / 100) / 10}k`.replace(".0k", "k") : money(v));

/// Basis points of the liability, signed.
export const bpOf = (v: number, config: GameConfig = DEFAULT_CONFIG) => Math.round((v / config.liability) * 10000);

/// Signed basis points for display: "+30 bp".
export const signedBp = (bp: number) => `${bp > 0 ? "+" : bp < 0 ? "−" : ""}${Math.abs(bp)} bp`;
