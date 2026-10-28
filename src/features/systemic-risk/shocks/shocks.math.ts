import { balance, systemicRanking } from "../engine/metrics.math";
import type { AssetId, Channels, DayState, FinNetwork, SimEvent, SimResult, Shock } from "../engine/systemic.types";

/// Asset classes in the order of the price-shock bars and of the `drop` URL list.
export const ASSET_ORDER: AssetId[] = ["gov", "corp", "mbs", "equity"];
export const MAX_DROP = 50;
export const GRADUAL_DAYS = 10;
/// Value of `fail` that means "no institution fails".
export const NO_FAIL = "none";

export const CHANNEL_KEYS = ["direct", "fireSales", "funding", "ccp"] as const;
export const ALL_CHANNELS = 15;

/// Channel switches ↔ bitmask (direct 1, fire sales 2, funding runs 4, CCP 8).
export const decodeChannels = (mask: number): Channels => ({
  direct: (mask & 1) !== 0, fireSales: (mask & 2) !== 0, funding: (mask & 4) !== 0, ccp: (mask & 8) !== 0,
});
export const encodeChannels = (c: Channels): number =>
  CHANNEL_KEYS.reduce((m, k, i) => m | (c[k] ? 1 << i : 0), 0);

/// "0,0,20,0" → four price drops in percent (gov, corp, mbs, equity); anything invalid → zeros.
export function parseDrops(raw: string | null): number[] {
  const zeros = ASSET_ORDER.map(() => 0);
  const parts = (raw ?? "").split(",");
  if (parts.length !== ASSET_ORDER.length) return zeros;
  const nums = parts.map((p) => (p.trim() === "" ? NaN : Number(p)));
  return nums.every((v) => Number.isFinite(v) && v >= 0 && v <= MAX_DROP) ? nums.map(Math.round) : zeros;
}
export const formatDrops = (drops: number[]): string => drops.join(",");

/// The institution to fail: `""` → the most systemic one by DebtRank, `none` → nobody, an unknown id → the default.
export function failedId(raw: string, net: FinNetwork): string | null {
  if (raw === NO_FAIL) return null;
  if (net.institutions.some((i) => i.id === raw)) return raw;
  return systemicRanking(net)[0]?.id ?? null;
}

/// The engine shocks for a setup: a default at day 0 and a price drop per asset class (drops in percent).
export function buildShocks(fail: string | null, drops: number[], shape: "instant" | "gradual"): Shock[] {
  const shocks: Shock[] = fail ? [{ kind: "default", id: fail }] : [];
  ASSET_ORDER.forEach((asset, i) => {
    if (drops[i] > 0) shocks.push({ kind: "asset", asset, drop: drops[i] / 100, shape, days: shape === "gradual" ? GRADUAL_DAYS : undefined });
  });
  return shocks;
}

export type MarkerKind = "default" | "fireSale" | "run" | "peak" | "calm" | "jolt" | "rumour" | "writedown";
export type Marker = { kind: MarkerKind; day: number; id?: string };

const first = (days: DayState[], pick: (e: SimEvent) => boolean): SimEvent | undefined =>
  days.flatMap((d) => d.events).find(pick);
const dayLoss = (d: DayState) => d.losses.direct + d.losses.fireSale + d.losses.funding + d.losses.ccp;

/// Timeline markers derived from the events: first default, first fire sale, first run, the worst day, the calm
/// and every market aftershock (asset jolt, rumour run or write-down).
export function eventMarkers(days: DayState[]): Marker[] {
  const out: Marker[] = [];
  const def = first(days, (e) => e.kind === "default");
  if (def) out.push({ kind: "default", day: def.day, id: def.id });
  const sale = first(days, (e) => e.kind === "fireSale");
  if (sale) out.push({ kind: "fireSale", day: sale.day });
  const run = first(days, (e) => e.kind === "run");
  if (run) out.push({ kind: "run", day: run.day, id: run.id });
  const worst = days.reduce<DayState | null>((m, d) => (dayLoss(d) > (m ? dayLoss(m) : 0) ? d : m), null);
  if (worst) out.push({ kind: "peak", day: worst.day });
  const calm = days.flatMap((d) => d.events).findLast((e) => e.kind === "calm");
  if (calm) out.push({ kind: "calm", day: calm.day });
  for (const e of days.flatMap((d) => d.events)) {
    if (e.kind === "aftershock" && e.cause) out.push({ kind: e.cause, day: e.day, id: e.id });
  }
  return out.sort((a, b) => a.day - b.day);
}

/// Share of institutions failed at the end of each day, in percent.
export const defaultsByDay = (days: DayState[], count: number): number[] =>
  days.map((d) => (100 * Object.values(d.status).filter((s) => s === "failed").length) / Math.max(1, count));

/// Cumulative loss per channel up to and including each day.
export function cumulativeLosses(days: DayState[]) {
  const acc = { direct: 0, fireSale: 0, funding: 0, ccp: 0 };
  return days.map((d) => {
    acc.direct += d.losses.direct;
    acc.fireSale += d.losses.fireSale;
    acc.funding += d.losses.funding;
    acc.ccp += d.losses.ccp;
    return { ...acc };
  });
}

/// Each channel's share of total loss in percent (zeros when nothing was lost).
export function channelShares(result: SimResult) {
  const c = cumulativeLosses(result.days).at(-1) ?? { direct: 0, fireSale: 0, funding: 0, ccp: 0 };
  const total = c.direct + c.fireSale + c.funding + c.ccp;
  const pct = (v: number) => (total > 0 ? (100 * v) / total : 0);
  return { direct: pct(c.direct), fireSale: pct(c.fireSale), funding: pct(c.funding), ccp: pct(c.ccp) };
}

/// Headline numbers of a run: failed count, total loss, deepest price drop (percent) and the day it calmed.
export function runStats(result: SimResult) {
  const peak = Math.max(0, ...Object.values(result.peakPriceDrop));
  const calm = result.days.flatMap((d) => d.events).findLast((e) => e.kind === "calm");
  return { failed: result.defaults.length, totalLoss: result.totalLoss, peakDrop: 100 * peak, calmDay: calm ? calm.day : null };
}

/// Share of starting equity lost by each institution at `day`, in percent (0…100).
export function equityLostPct(net: FinNetwork, day: DayState): Record<string, number> {
  const out: Record<string, number> = {};
  for (const inst of net.institutions) {
    const start = balance(inst, net).equity;
    out[inst.id] = start > 0 ? Math.min(100, Math.max(0, (100 * (start - day.equity[inst.id])) / start)) : 0;
  }
  return out;
}

/// Ids of the institutions touched by a flow on `day` (either end), for pulsing edges.
export const flowPairs = (day: DayState): Set<string> =>
  new Set(day.flows.flatMap((f) => [`${f.from}>${f.to}`, `${f.to}>${f.from}`]));

export type ChartRows = {
  defaults: { day: number; pct: number }[];
  losses: { day: number; direct: number; fireSale: number; funding: number; ccp: number }[];
  prices: { day: number; gov: number; corp: number; mbs: number; equity: number }[];
};

/// Per-day rows for the three charts: defaults (percent of institutions), cumulative losses by channel ($bn)
/// and asset prices (percent of the starting price).
export function chartRows(result: SimResult, count: number): ChartRows {
  const pct = defaultsByDay(result.days, count);
  const cum = cumulativeLosses(result.days);
  return {
    defaults: result.days.map((d, i) => ({ day: d.day, pct: pct[i] })),
    losses: result.days.map((d, i) => ({ day: d.day, ...cum[i] })),
    prices: result.days.map((d) => ({
      day: d.day, gov: 100 * d.prices.gov, corp: 100 * d.prices.corp, mbs: 100 * d.prices.mbs, equity: 100 * d.prices.equity,
    })),
  };
}
