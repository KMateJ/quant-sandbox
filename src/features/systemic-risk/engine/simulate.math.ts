import { UNIT_PRICES, indexBook } from "./accounting.math";
import { makeMarket, marketDay } from "./market.math";
import { directLosses, fireSales, fundingRuns } from "./contagion.math";
import {
  emptySales, fail, failInsolvent, sheet, statusOf, zeroAssets, zeroLosses, type Ctx,
} from "./simctx.math";
import type {
  AssetId, DayState, FinNetwork, Institution, Intervention, Shock, SimParams, SimResult, Status,
} from "./systemic.types";

const QUIET_DAYS = 5;
const MIN_FLOW = 0.005;

function makeCtx(net: FinNetwork, params: SimParams): Ctx {
  const insts = net.institutions.map((i) => ({ ...i, holdings: { ...i.holdings } }));
  const exps = net.exposures.map((e) => ({ ...e }));
  const book = indexBook(exps);
  const depth = { gov: Infinity, corp: Infinity, mbs: Infinity, equity: Infinity };
  for (const a of net.assets) depth[a.id] = a.depth;
  const ctx = {
    day: 0, params, insts, byId: new Map(insts.map((i) => [i.id, i])), exps, book, prices: { ...UNIT_PRICES }, depth,
    equity0: new Map(), failed: new Map(), frozen: new Map(), charged: new Set(), liquidated: new Set(), pledged: new Map(),
    flags: { liquidity: false, guarantee: false, parLending: false }, purchases: zeroAssets(),
  } as Ctx;
  for (const i of insts) ctx.equity0.set(i.id, sheet(ctx, i).equity);
  return ctx;
}

function startDay(ctx: Ctx, day: number) {
  ctx.day = day;
  ctx.purchases = zeroAssets();
  ctx.fundSales = emptySales();
  ctx.deleverSales = emptySales();
  ctx.losses = zeroLosses();
  ctx.lossesById = Object.fromEntries(ctx.insts.map((i) => [i.id, zeroLosses()]));
  ctx.flows = [];
  ctx.flowIndex = new Map();
  ctx.events = [];
}

/// An idiosyncratic loss that wipes out equity: written off against loans, then cash.
function wipeOut(ctx: Ctx, inst: Institution) {
  let loss = Math.max(0, sheet(ctx, inst).equity);
  for (const f of ["loans", "cash"] as const) {
    const take = Math.min(loss, Math.max(0, inst[f]));
    inst[f] -= take;
    loss -= take;
  }
}

type RunShock = Extract<Shock, { kind: "run" }>;

/// Step 1: shocks and interventions dated today. Returns today's `run` shocks for the funding step.
function applyToday(ctx: Ctx, shocks: Shock[], interventions: Intervention[]): RunShock[] {
  const runs: RunShock[] = [];
  for (const s of shocks) {
    const day = s.day ?? 0;
    if (s.kind === "asset") {
      const span = s.shape === "gradual" ? Math.max(1, s.days ?? 10) : 1;
      if (ctx.day < day || ctx.day >= day + span) continue;
      const factor = span > 1 ? (1 - s.drop) ** (1 / span) : 1 - s.drop;
      ctx.prices[s.asset] = Math.max(ctx.params.priceFloor, ctx.prices[s.asset] * factor);
      if (ctx.day === day) ctx.events.push({ day: ctx.day, kind: "shock", asset: s.asset, value: s.drop });
    } else if (day === ctx.day && s.kind === "default") {
      const inst = ctx.byId.get(s.id);
      if (!inst || ctx.failed.has(s.id)) continue;
      wipeOut(ctx, inst);
      ctx.events.push({ day: ctx.day, kind: "shock", id: s.id });
      fail(ctx, inst);
    } else if (day === ctx.day && s.kind === "run") {
      runs.push(s);
      ctx.events.push({ day: ctx.day, kind: "shock", id: s.target, value: s.fraction });
    }
  }
  for (const iv of interventions) {
    if (iv.day !== ctx.day) continue;
    const event = { day: ctx.day, kind: "intervention" as const };
    if (iv.kind === "capital") {
      const inst = ctx.byId.get(iv.id);
      if (!inst || ctx.failed.has(iv.id)) continue;
      inst.cash += iv.amount;
      ctx.events.push({ ...event, id: iv.id, value: iv.amount });
    } else if (iv.kind === "assetPurchases") {
      ctx.purchases[iv.asset] += iv.amount;
      ctx.events.push({ ...event, asset: iv.asset, value: iv.amount });
    } else {
      ctx.flags[iv.kind] = true;
      ctx.events.push(event);
    }
  }
  return runs;
}

function snapshot(ctx: Ctx): DayState {
  const equity: Record<string, number> = {};
  const assets: Record<string, number> = {};
  const status: Record<string, Status> = {};
  for (const i of ctx.insts) {
    const s = sheet(ctx, i);
    equity[i.id] = s.equity;
    assets[i.id] = s.assets;
    status[i.id] = statusOf(ctx, i, s);
  }
  return {
    day: ctx.day, equity, assets, status, prices: { ...ctx.prices }, losses: ctx.losses, lossesById: ctx.lossesById,
    flows: ctx.flows.filter((f) => f.amount >= MIN_FLOW), events: ctx.events,
  };
}

/// Runs a day-by-day contagion over `net`; the result has `params.days + 1` states (day 0 includes day-0 shocks).
/// Each day, in this fixed order:
/// 1. shocks and interventions dated today (capital adds cash; asset purchases offset today's net sales);
/// 2. **direct** (and **ccp**): creditors of institutions that failed on an earlier day lose lgd × (claim − collateral);
///    derivative claims are made whole by the CCP, which absorbs the loss with its equity, then members' margin;
/// 3. **funding**: institutions under `runTrigger` lose `runFraction` of short funding; distressed regionals and MMFs
///    and `run` shocks pull deposits; outflows come from cash, then (par lending) pledged bonds, then securities sold
///    gov → corp → mbs → equity; an unmet outflow is a failure;
/// 4. **fireSales**: failed institutions liquidate, those under `distressRatio` deleverage to `targetRatio`; net
///    sales move prices by net ÷ depth percent (floored at `priceFloor`) and every holder marks to market;
/// 5. status from equity and capital ratio (equity ≤ 0 ⇒ failed, creditors lose from tomorrow), events, flows.
/// With `params.market`, step 1 also moves prices with noise and recovery and may add a seeded aftershock.
/// A channel that is off skips its step. `totalLoss` sums the four channel losses; the initial asset shock itself
/// is not a channel loss. Deterministic: same inputs ⇒ same result.
export function simulate(net: FinNetwork, shocks: Shock[], params: SimParams, interventions: Intervention[] = []): SimResult {
  const ctx = makeCtx(net, params);
  const { channels } = params;
  const days: DayState[] = [];
  let before: Record<string, Status> = Object.fromEntries(ctx.insts.map((i) => [i.id, statusOf(ctx, i)]));
  let quiet = 0;
  let active = false;
  const market = params.market ? makeMarket(params.market) : null;
  for (let day = 0; day <= params.days; day++) {
    startDay(ctx, day);
    const runs = applyToday(ctx, shocks, interventions);
    if (market) runs.push(...marketDay(ctx, market));
    failInsolvent(ctx);
    if (channels.direct || channels.ccp) {
      directLosses(ctx);
      failInsolvent(ctx);
    }
    if (channels.funding) {
      fundingRuns(ctx, runs);
      failInsolvent(ctx);
    }
    if (channels.fireSales) {
      fireSales(ctx);
      failInsolvent(ctx);
    }
    const state = snapshot(ctx);
    const moved = ctx.insts.some((i) => state.status[i.id] !== before[i.id]);
    before = state.status;
    const lost = state.losses.direct + state.losses.fireSale + state.losses.funding + state.losses.ccp > 0;
    quiet = ctx.events.length || moved || lost ? 0 : quiet + 1;
    active = active || quiet === 0;
    if (active && quiet === QUIET_DAYS) state.events.push({ day, kind: "calm" });
    days.push(state);
  }
  const peak: Record<AssetId, number> = zeroAssets();
  let totalLoss = 0;
  for (const d of days) {
    for (const a of Object.keys(peak) as AssetId[]) peak[a] = Math.max(peak[a], 1 - d.prices[a]);
    totalLoss += d.losses.direct + d.losses.fireSale + d.losses.funding + d.losses.ccp;
  }
  return { days, defaults: [...ctx.failed.keys()], totalLoss, peakPriceDrop: peak };
}
