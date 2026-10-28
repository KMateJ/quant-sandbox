import { sheetOf, type Book, type Prices, type Sheet } from "./accounting.math";
import type {
  AssetId, ChannelLosses, Exposure, Institution, SimEvent, SimParams, Status,
} from "./systemic.types";

export type Flow = { from: string; to: string; amount: number; channel: keyof ChannelLosses };
type SalesByAsset = Record<AssetId, Map<string, number>>;

/// Mutable state of one `simulate` run: working copies of the network plus the current day's accumulators.
export type Ctx = {
  day: number;
  params: SimParams;
  insts: Institution[];
  byId: Map<string, Institution>;
  exps: Exposure[];
  book: Book;
  prices: Prices;
  depth: Record<AssetId, number>;
  equity0: Map<string, number>;
  /// id → day of failure, in order of failure
  failed: Map<string, number>;
  frozen: Map<string, Sheet>;
  charged: Set<string>;
  liquidated: Set<string>;
  pledged: Map<string, number>;
  flags: { liquidity: boolean; guarantee: boolean; parLending: boolean };
  purchases: Record<AssetId, number>;
  fundSales: SalesByAsset;
  deleverSales: SalesByAsset;
  losses: ChannelLosses;
  lossesById: Record<string, ChannelLosses>;
  flows: Flow[];
  flowIndex: Map<string, Flow>;
  events: SimEvent[];
};

export const zeroLosses = (): ChannelLosses => ({ direct: 0, fireSale: 0, funding: 0, ccp: 0 });
export const emptySales = (): SalesByAsset => ({ gov: new Map(), corp: new Map(), mbs: new Map(), equity: new Map() });
export const zeroAssets = (): Record<AssetId, number> => ({ gov: 0, corp: 0, mbs: 0, equity: 0 });

/// Capital ratios apply to everyone except money market funds and CCPs (equity measured against its start value).
export const usesRatio = (inst: Institution) => inst.kind !== "mmf" && inst.kind !== "ccp";

export const sheet = (ctx: Ctx, inst: Institution): Sheet => ctx.frozen.get(inst.id) ?? sheetOf(inst, ctx.prices, ctx.book);

export const ratioOf = (s: Sheet) => (s.assets > 0 ? s.equity / s.assets : 0);

export function statusOf(ctx: Ctx, inst: Institution, s: Sheet = sheet(ctx, inst)): Status {
  if (ctx.failed.has(inst.id)) return "failed";
  const { runTrigger, distressRatio } = ctx.params;
  if (usesRatio(inst)) {
    const r = ratioOf(s);
    return r < runTrigger ? "critical" : r < distressRatio ? "stressed" : "ok";
  }
  const kept = s.equity / (ctx.equity0.get(inst.id) || 1);
  return kept < 0.5 ? "critical" : kept < 0.8 ? "stressed" : "ok";
}

/// Marks `inst` failed today and freezes its balance sheet.
export function fail(ctx: Ctx, inst: Institution) {
  if (ctx.failed.has(inst.id)) return;
  ctx.frozen.set(inst.id, sheetOf(inst, ctx.prices, ctx.book));
  ctx.failed.set(inst.id, ctx.day);
  ctx.events.push({ day: ctx.day, kind: "default", id: inst.id });
}

/// Fails every live institution whose equity is gone.
export function failInsolvent(ctx: Ctx) {
  for (const inst of ctx.insts) if (!ctx.failed.has(inst.id) && sheet(ctx, inst).equity <= 1e-9) fail(ctx, inst);
}

/// Books a loss of `amount` on `id` in `channel`; `from` (the cause) adds a flow for the edge animation.
export function lose(ctx: Ctx, id: string, channel: keyof ChannelLosses, amount: number, from?: string) {
  if (amount <= 1e-12) return;
  ctx.losses[channel] += amount;
  ctx.lossesById[id][channel] += amount;
  if (from && from !== id) {
    const key = `${from}>${id}>${channel}`;
    const hit = ctx.flowIndex.get(key);
    if (hit) hit.amount += amount;
    else {
      const flow = { from, to: id, amount, channel };
      ctx.flowIndex.set(key, flow);
      ctx.flows.push(flow);
    }
  }
}

/// Sells `value` (market value at today's price) of `a`, recording the seller; returns the proceeds.
export function sell(ctx: Ctx, inst: Institution, a: AssetId, value: number, bucket: SalesByAsset): number {
  const v = Math.min(value, inst.holdings[a] * ctx.prices[a]);
  if (v <= 0) return 0;
  inst.holdings[a] -= v / ctx.prices[a];
  bucket[a].set(inst.id, (bucket[a].get(inst.id) ?? 0) + v);
  return v;
}

export const totalSales = (m: Map<string, number>) => [...m.values()].reduce((s, v) => s + v, 0);
