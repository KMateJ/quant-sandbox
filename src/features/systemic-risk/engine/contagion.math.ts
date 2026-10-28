import { ASSET_IDS, BOND_ASSETS } from "./accounting.math";
import {
  fail, lose, ratioOf, sell, sheet, totalSales, usesRatio, type Ctx,
} from "./simctx.math";
import type { AssetId, Institution, Shock } from "./systemic.types";

type RunShock = Extract<Shock, { kind: "run" }>;

// #region direct and CCP losses
/// Mutualises `pool` of derivative losses: the CCP's own equity first, then members' margin pro rata to it.
function mutualise(ctx: Ctx, ccp: Institution, pool: number, cause: string) {
  const own = Math.min(pool, Math.max(0, sheet(ctx, ccp).equity));
  ccp.cash -= pool;
  const rest = pool - own;
  const members = (ctx.book.owed.get(ccp.id) ?? []).filter((e) => e.type === "derivatives" && e.amount > 0 && !ctx.failed.has(e.lender));
  const margin = members.reduce((s, e) => s + e.amount, 0);
  let uncovered = rest;
  for (const e of members) {
    const share = Math.min(e.amount, (rest * e.amount) / margin);
    e.amount -= share;
    uncovered -= share;
    lose(ctx, e.lender, "ccp", share, cause);
  }
  lose(ctx, ccp.id, "ccp", own + Math.max(0, uncovered), cause);
}

/// Direct channel: creditors of institutions that failed on an earlier day write off lgd × (claim − collateral).
/// Derivative claims are made whole by the CCP (when its channel is on and a live CCP exists) and the loss is mutualised.
export function directLosses(ctx: Ctx) {
  const { lgd, channels } = ctx.params;
  const ccp = channels.ccp ? ctx.insts.find((i) => i.kind === "ccp" && !ctx.failed.has(i.id)) : undefined;
  for (const [id, day] of ctx.failed) {
    if (day >= ctx.day || ctx.charged.has(id)) continue;
    ctx.charged.add(id);
    const debtor = ctx.byId.get(id)!;
    let pool = 0;
    for (const e of ctx.book.owed.get(id) ?? []) {
      const lender = ctx.byId.get(e.lender)!;
      const amount = e.amount;
      e.amount = 0;
      if (amount <= 0 || ctx.failed.has(lender.id)) continue;
      const raw = lgd * Math.max(0, amount - e.collateral);
      if (ccp && e.type === "derivatives" && debtor.kind !== "ccp") {
        lender.cash += amount;
        pool += raw;
      } else {
        const hit = channels.direct ? raw : 0;
        lender.cash += amount - hit;
        lose(ctx, lender.id, "direct", hit, id);
      }
    }
    if (ccp && pool > 0) mutualise(ctx, ccp, pool, id);
  }
}
// #endregion

// #region funding runs
const matches = (s: RunShock, inst: Institution) => s.target === inst.id || s.target === inst.kind;

/// Deposit runs: regionals under the distress ratio, and money market funds that have lost half their cushion.
function depositRun(ctx: Ctx, inst: Institution): boolean {
  const s = sheet(ctx, inst);
  if (inst.kind === "regional") return ratioOf(s) < ctx.params.distressRatio;
  return inst.kind === "mmf" && s.equity < 0.5 * (ctx.equity0.get(inst.id) ?? 0);
}

/// Pays `need` out of cash, then (with par lending) by pledging bonds at par, then by selling securities in the
/// order gov, corp, mbs, equity. Returns what could not be paid.
function raiseCash(ctx: Ctx, inst: Institution, amount: number): number {
  const fromCash = Math.min(Math.max(0, inst.cash), amount);
  inst.cash -= fromCash;
  let need = amount - fromCash;
  if (ctx.flags.parLending && need > 0) {
    const par = BOND_ASSETS.reduce((s, a) => s + inst.holdings[a], 0);
    const take = Math.min(need, Math.max(0, par - (ctx.pledged.get(inst.id) ?? 0)));
    ctx.pledged.set(inst.id, (ctx.pledged.get(inst.id) ?? 0) + take);
    inst.otherLiab += take;
    need -= take;
  }
  for (const a of ASSET_IDS) {
    if (need <= 1e-9) break;
    if (ctx.flags.parLending && BOND_ASSETS.includes(a)) continue;
    need -= sell(ctx, inst, a, need, ctx.fundSales);
  }
  return Math.max(0, need);
}

/// Funding channel: low-capital institutions lose a fraction of short funding, distressed regionals/MMFs lose
/// deposits, and `run` shocks pull funding; outflows are met from liquid assets, and an unmet outflow is a failure.
export function fundingRuns(ctx: Ctx, runs: RunShock[]) {
  const { runTrigger, runFraction, depositRunFraction } = ctx.params;
  for (const inst of ctx.insts) {
    if (ctx.failed.has(inst.id) || inst.kind === "ccp") continue;
    let outSf = usesRatio(inst) && ratioOf(sheet(ctx, inst)) < runTrigger ? runFraction * inst.shortFunding : 0;
    let outDep = depositRun(ctx, inst) ? depositRunFraction * inst.deposits : 0;
    for (const r of runs) {
      if (!matches(r, inst)) continue;
      if (r.source === "shortFunding") outSf += r.fraction * inst.shortFunding;
      else outDep += r.fraction * inst.deposits;
    }
    outSf = ctx.flags.liquidity ? 0 : Math.min(outSf, inst.shortFunding);
    outDep = ctx.flags.guarantee ? 0 : Math.min(outDep, inst.deposits);
    const total = outSf + outDep;
    if (total <= 1e-9) continue;
    inst.shortFunding -= outSf;
    inst.deposits -= outDep;
    ctx.events.push({ day: ctx.day, kind: "run", id: inst.id, value: total });
    if (raiseCash(ctx, inst, total) > 1e-9) fail(ctx, inst);
  }
}
// #endregion

// #region fire sales
/// Sells enough securities pro rata to restore `targetRatio` (all of them if that is not enough); proceeds repay
/// short funding, then other liabilities, then deposits.
function deleverage(ctx: Ctx, inst: Institution) {
  const s = sheet(ctx, inst);
  const held = ASSET_IDS.reduce((v, a) => v + inst.holdings[a] * ctx.prices[a], 0);
  const need = Math.max(0, s.assets - s.equity / ctx.params.targetRatio);
  if (held <= 0 || need <= 0) return;
  const frac = Math.min(1, need / held);
  let proceeds = 0;
  for (const a of ASSET_IDS) proceeds += sell(ctx, inst, a, inst.holdings[a] * ctx.prices[a] * frac, ctx.deleverSales);
  for (const f of ["shortFunding", "otherLiab", "deposits"] as const) {
    const pay = Math.min(inst[f], proceeds);
    inst[f] -= pay;
    proceeds -= pay;
  }
  inst.cash += proceeds;
}

function repriceAsset(ctx: Ctx, a: AssetId) {
  const fund = totalSales(ctx.fundSales[a]);
  const delever = totalSales(ctx.deleverSales[a]);
  const net = fund + delever - ctx.purchases[a];
  const p0 = ctx.prices[a];
  const p1 = Math.min(1, Math.max(ctx.params.priceFloor, p0 * (1 - net / ctx.depth[a] / 100)));
  if (!Number.isFinite(p1) || p1 === p0) return;
  ctx.prices[a] = p1;
  if (p1 > p0) return;
  const fundShare = fund + delever > 0 ? fund / (fund + delever) : 0;
  const sellers = [...ctx.fundSales[a], ...ctx.deleverSales[a]].reduce((m, [id, v]) => m.set(id, (m.get(id) ?? 0) + v), new Map<string, number>());
  const sold = totalSales(sellers);
  for (const holder of ctx.insts) {
    if (ctx.failed.has(holder.id)) continue;
    const loss = holder.holdings[a] * (p0 - p1);
    for (const [seller, v] of sellers) {
      lose(ctx, holder.id, "funding", (loss * fundShare * v) / sold, seller);
      lose(ctx, holder.id, "fireSale", (loss * (1 - fundShare) * v) / sold, seller);
    }
  }
  if ((p0 - p1) / p0 >= 0.001) ctx.events.push({ day: ctx.day, kind: "fireSale", asset: a, value: (p0 - p1) / p0 });
}

/// Fire-sale channel: failed institutions liquidate everything, institutions under `distressRatio` deleverage
/// to `targetRatio`; net sales (plus the run-forced sales already made today, minus central-bank purchases) move
/// each price by net ÷ depth percent, floored at `priceFloor`, and every holder marks to market.
export function fireSales(ctx: Ctx) {
  for (const inst of ctx.insts) {
    if (ctx.failed.has(inst.id)) {
      if (ctx.liquidated.has(inst.id)) continue;
      ctx.liquidated.add(inst.id);
      for (const a of ASSET_IDS) sell(ctx, inst, a, inst.holdings[a] * ctx.prices[a], ctx.deleverSales);
    } else if (usesRatio(inst) && ratioOf(sheet(ctx, inst)) < ctx.params.distressRatio) {
      deleverage(ctx, inst);
    }
  }
  for (const a of ASSET_IDS) repriceAsset(ctx, a);
}
// #endregion
