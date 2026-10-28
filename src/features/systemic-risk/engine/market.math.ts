import { makeRng, nextNormal, type Rng } from "../../../lib/math/random";
import { fail, sheet, statusOf, type Ctx } from "./simctx.math";
import type { AssetId, Institution, MarketParams, Shock } from "./systemic.types";

type RunShock = Extract<Shock, { kind: "run" }>;

const ASSETS: AssetId[] = ["gov", "corp", "mbs", "equity"];

/// Background market for the simulator: daily volatility, slow recovery and seeded aftershocks.
export const DEFAULT_MARKET: Omit<MarketParams, "seed"> = {
  vol: { gov: 0.003, corp: 0.007, mbs: 0.01, equity: 0.016 },
  recovery: 0.025,
  baseRate: 0.2,
  stressRate: 0.6,
};

export type Market = { rng: Rng; params: MarketParams };

export const makeMarket = (params: MarketParams): Market => ({ rng: makeRng(params.seed * 2654435761 + 17), params });

const pick = <T>(rng: Rng, xs: T[]): T => xs[Math.floor(rng() * xs.length)];
const between = (rng: Rng, lo: number, hi: number) => lo + (hi - lo) * rng();

/// Writes off `share` of the institution's current equity (above 1 can sink it) against loans, then cash.
function idiosyncraticLoss(inst: Institution, equity: number, share: number) {
  let loss = Math.max(0, equity) * share;
  for (const f of ["loans", "cash"] as const) {
    const take = Math.min(loss, Math.max(0, inst[f]));
    inst[f] -= take;
    loss -= take;
  }
}

/// One aftershock: an asset jolt, a rumour-driven run, or an idiosyncratic loss; weak institutions are the likelier
/// targets. Returns a run shock for the funding step when it is a run.
function aftershock(ctx: Ctx, rng: Rng, live: Institution[], weak: Institution[]): RunShock | null {
  const roll = rng();
  if (roll < 0.4 || !live.length) {
    const asset = pick(rng, ASSETS);
    const drop = between(rng, 0.03, asset === "gov" ? 0.04 : 0.12);
    ctx.prices[asset] = Math.max(ctx.params.priceFloor, ctx.prices[asset] * (1 - drop));
    ctx.events.push({ day: ctx.day, kind: "aftershock", cause: "jolt", asset, value: drop });
    return null;
  }
  const hitWeak = weak.length > 0 && rng() < 0.8;
  const inst = pick(rng, hitWeak ? weak : live);
  if (roll < 0.7) {
    const fraction = between(rng, 0.15, 0.35);
    ctx.events.push({ day: ctx.day, kind: "aftershock", cause: "rumour", id: inst.id, value: fraction });
    const source = inst.deposits > inst.shortFunding ? "deposits" : "shortFunding";
    return { kind: "run", target: inst.id, source, fraction, day: ctx.day };
  }
  const share = hitWeak ? between(rng, 0.5, 1.3) : between(rng, 0.2, 0.6);
  idiosyncraticLoss(inst, sheet(ctx, inst).equity, share);
  ctx.events.push({ day: ctx.day, kind: "aftershock", cause: "writedown", id: inst.id, value: share });
  if (sheet(ctx, inst).equity <= 1e-9) fail(ctx, inst);
  return null;
}

/// Day step of the background market (from day 1): prices drift back toward par with noise, and an aftershock
/// arrives with a probability that rises with the share of stressed institutions.
export function marketDay(ctx: Ctx, market: Market): RunShock[] {
  if (ctx.day === 0) return [];
  const { rng, params } = market;
  for (const a of ASSETS) {
    const p = ctx.prices[a] + params.recovery * (1 - ctx.prices[a]);
    ctx.prices[a] = Math.min(1.1, Math.max(ctx.params.priceFloor, p * Math.exp(params.vol[a] * nextNormal(rng))));
  }
  const live = ctx.insts.filter((i) => !ctx.failed.has(i.id) && i.kind !== "ccp");
  const weak = live.filter((i) => statusOf(ctx, i) !== "ok");
  const rate = params.baseRate + params.stressRate * (weak.length / Math.max(1, live.length));
  const run = rng() < rate ? aftershock(ctx, rng, live, weak) : null;
  return run ? [run] : [];
}
