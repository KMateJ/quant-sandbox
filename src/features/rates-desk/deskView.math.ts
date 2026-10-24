import type { ZeroPoint } from "../../lib/finance/curveRisk";
import { zeroRate } from "./engine/curve.math";
import { bondPrice, futureDv01, futureKrd, futureQuote } from "./engine/pricing.math";
import { bookValue, ratesRisk } from "./engine/risk.math";
import type { CurveFactors, FutureQuote, FutureSpec, RatesMission, RatesState } from "./engine/rates.types";

/// Maturities shown in the quote strip and the yield-moves chart.
export const QUOTE_TENORS = [2, 5, 10, 30];

export type PositionRow = { kind: "bond" | "future"; id: string; size: number; price: number; value: number; dv01: number; krd: number[] };

/// One row per book bond and per futures position held, with dollar DV01 and key-rate DV01s.
export function positionRows(state: RatesState, mission: RatesMission, zeros: ZeroPoint[]): PositionRow[] {
  const bonds = mission.book.map((b): PositionRow => {
    const one = { ...mission, book: [b] };
    const v = bookValue(one, zeros);
    const r = ratesRisk({ ...state, contracts: mission.futures.map(() => 0) }, one, zeros);
    return { kind: "bond", id: b.id, size: b.face, price: bondPrice(b.coupon, b.maturity, zeros), value: v, dv01: r.bookDv01, krd: r.kBook };
  });
  const futures = mission.futures.flatMap((f, j): PositionRow[] => {
    const q = state.contracts[j];
    if (q === 0) return [];
    const F = futureQuote(f, zeros).F;
    return [{ kind: "future", id: f.id, size: q, price: F, value: 0, dv01: q * futureDv01(f, zeros), krd: futureKrd(f, zeros).map((k) => q * k) }];
  });
  return [...bonds, ...futures];
}

export type TicketPreview = { price: number; perContract: number; impact: number; netAfter: number; cost: number };

/// What an order of `qty` signed contracts in `future` would do to net DV01 and costs.
export function ticketPreview(mission: RatesMission, zeros: ZeroPoint[], future: number, qty: number, net: number): TicketPreview {
  const spec = mission.futures[future];
  const perContract = futureDv01(spec, zeros);
  return { price: futureQuote(spec, zeros).F, perContract, impact: qty * perContract, netAfter: net + qty * perContract, cost: Math.abs(qty) * mission.costPerContract };
}

/// Cumulative bp move of each `QUOTE_TENORS` zero since day 0, one row per day up to today.
export function yieldMoves(path: CurveFactors[], day: number) {
  return path.slice(0, day + 1).map((f, d) => {
    const row: Record<string, number> = { day: d };
    QUOTE_TENORS.forEach((t) => (row[`y${t}`] = (zeroRate(f, t) - zeroRate(path[0], t)) * 1e4));
    return row;
  });
}

/// Zero curve today and on day 0, sampled for the curve chart (rates in %).
export function curveRows(path: CurveFactors[], day: number) {
  const ts = Array.from({ length: 61 }, (_, i) => Math.max(0.25, i / 2));
  return ts.map((t) => ({ t, today: zeroRate(path[day], t) * 100, start: zeroRate(path[0], t) * 100 }));
}


/// Deliverable basket rows: clean price, CF, P/CF and gross basis (price − futures × CF) per bond.
export function basketRows(spec: FutureSpec, q: FutureQuote) {
  const F = q.F - (spec.calendarSpread ?? 0);
  return spec.basket.map(([coupon, maturity], i) => ({
    coupon, maturity, price: q.prices[i], cf: q.cfs[i], ratio: q.prices[i] / q.cfs[i], basis: q.prices[i] - F * q.cfs[i], ctd: i === q.ctd,
  }));
}
