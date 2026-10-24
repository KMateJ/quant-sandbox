import { logLinearDf } from "../../lib/finance/yieldcurve";
import { swapMtm, type Curve, type SwapPayment, type SwapSpec } from "../../lib/finance/swap";
import { buildTermStructure } from "../yield-curve/yieldCurve.math";
import type { CurveNode } from "../yield-curve/yieldCurve.types";

/// Discount curve from par quotes: bootstrapped node DFs, log-linear in between.
export function curveFromNodes(nodes: CurveNode[]): Curve {
  const term = buildTermStructure(nodes);
  return { df: logLinearDf(term.map((p) => p.t), term.map((p) => p.df)) };
}

/// Every node quote moved by `bp` basis points.
export const shiftNodes = (nodes: CurveNode[], bp: number): CurveNode[] => nodes.map((n) => ({ ...n, rate: n.rate + bp / 1e4 }));

/// One bar group of the leg ladder: a payment date, or a whole year when payments are aggregated.
export type LadderRow = { t: number; fixed: number; floating: number; pvFixed: number; pvFloating: number; net: number; forward: number; df: number };

/// Ladder rows signed for the holder (received positive, paid negative). With `byYear`, payments in the same
/// year are summed (forward and DF of the year's last payment).
export function ladderRows(payments: SwapPayment[], payer: boolean, byYear: boolean): LadderRow[] {
  const s = payer ? 1 : -1;
  const rows = payments.map((p) => ({
    t: p.t,
    fixed: -s * p.fixed,
    floating: s * p.floating,
    pvFixed: -s * p.pvFixed,
    pvFloating: s * p.pvFloating,
    net: s * (p.floating - p.fixed),
    forward: p.forward,
    df: p.df,
  }));
  if (!byYear) return rows;
  const out: LadderRow[] = [];
  for (const r of rows) {
    const year = Math.ceil(r.t - 1e-9);
    const last = out[out.length - 1];
    if (last && last.t === year) {
      last.fixed += r.fixed;
      last.floating += r.floating;
      last.pvFixed += r.pvFixed;
      last.pvFloating += r.pvFloating;
      last.net += r.net;
      last.forward = r.forward;
      last.df = r.df;
    } else out.push({ ...r, t: year });
  }
  return out;
}

/// Phone-width rule: aggregate to years when there are more than this many payments.
export const MAX_BARS_NARROW = 20;

/// MTM change if every quote rises `bp` (full revaluation) and its first-order estimate DV01 × bp.
export function shockOutcome(spec: SwapSpec, nodes: CurveNode[], bp: number): { actual: number; estimate: number } {
  const base = swapMtm(spec, curveFromNodes(nodes));
  const dv01 = swapMtm(spec, curveFromNodes(shiftNodes(nodes, 1))) - base;
  return { actual: swapMtm(spec, curveFromNodes(shiftNodes(nodes, bp))) - base, estimate: dv01 * bp };
}
