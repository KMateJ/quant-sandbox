import { KEY_RATES, type ZeroPoint } from "../../../lib/finance/curveRisk";
import { inverse } from "../../../lib/math/matrix";
import { bump, shiftKeys } from "./curve.math";
import { bondValue, futureDv01, futureKrd, futureQuote } from "./pricing.math";
import type { CurveScenario, FutureSpec, RatesMission, RatesRisk, RatesState } from "./rates.types";

/// Dollar value of the bond book on `zeros`.
export const bookValue = (mission: RatesMission, zeros: ZeroPoint[]) => mission.book.reduce((s, b) => s + bondValue(b, zeros), 0);

/// True once contract `j` has passed its expiry day.
export const isExpired = (spec: FutureSpec, day: number) => spec.expiryDay !== undefined && day >= spec.expiryDay;

/// Book, hedge and net DV01 plus key-rate DV01s (value lost for +1 bp).
export function ratesRisk(state: RatesState, mission: RatesMission, zeros: ZeroPoint[]): RatesRisk {
  const v0 = bookValue(mission, zeros);
  const bookDv01 = v0 - bookValue(mission, bump(zeros, "parallel", 1));
  const kBook = KEY_RATES.map((_, k) => v0 - bookValue(mission, bump(zeros, k, 1)));
  let futDv01 = 0;
  const kFut = KEY_RATES.map(() => 0);
  mission.futures.forEach((spec, j) => {
    const q = state.contracts[j];
    if (q === 0) return;
    futDv01 += q * futureDv01(spec, zeros);
    futureKrd(spec, zeros).forEach((v, k) => (kFut[k] += q * v));
  });
  return { bookValue: v0, bookDv01, futDv01, net: bookDv01 + futDv01, kBook, kFut, kNet: kBook.map((v, k) => v + kFut[k]) };
}

/// Contracts of `future` to trade so net DV01 is as close to zero as whole contracts allow.
export function dv01HedgeQty(state: RatesState, mission: RatesMission, zeros: ZeroPoint[], future: number): number {
  const per = futureDv01(mission.futures[future], zeros);
  return Math.round(-ratesRisk(state, mission, zeros).net / per) || 0;
}

/// Key-rate DV01s folded into the hedgeable buckets 2y, 5y and 10y+30y.
export const bucketsOf = (k: number[]) => [k[0], k[1], k[2] + k[3]];

/// Target positions that zero the 2y, 5y and 10y+30y buckets using the first three live contracts; others go to 0.
export function krdHedgeQty(state: RatesState, mission: RatesMission, zeros: ZeroPoint[]): number[] {
  const live = mission.futures.map((_, j) => j).filter((j) => !isExpired(mission.futures[j], state.day)).slice(0, 3);
  const target = mission.futures.map(() => 0);
  if (live.length < 3) return state.contracts.slice();
  const cols = live.map((j) => bucketsOf(futureKrd(mission.futures[j], zeros)));
  const A = [0, 1, 2].map((r) => cols.map((c) => c[r]));
  const book = bucketsOf(ratesRisk({ ...state, contracts: target }, mission, zeros).kBook);
  const inv = inverse(A);
  live.forEach((j, i) => (target[j] = Math.round(-inv[i].reduce((s, a, r) => s + a * book[r], 0))));
  return target;
}

const SCENARIOS: [CurveScenario["id"], number[]][] = [
  ["parallelUp", [25, 25, 25, 25]],
  ["parallelDown", [-25, -25, -25, -25]],
  ["steepener", [-15, -5, 5, 15]],
  ["flattener", [15, 5, -5, -15]],
  ["belly", [0, 20, 0, 0]],
];

/// Value change of the naked book and the hedged book under standard curve scenarios.
export function curveScenarios(state: RatesState, mission: RatesMission, zeros: ZeroPoint[]): CurveScenario[] {
  const v0 = bookValue(mission, zeros);
  const F0 = mission.futures.map((s) => futureQuote(s, zeros).F);
  return SCENARIOS.map(([id, bps]) => {
    const z = shiftKeys(zeros, bps);
    const naked = bookValue(mission, z) - v0;
    const fut = mission.futures.reduce((s, spec, j) => s + (state.contracts[j] * spec.size * (futureQuote(spec, z).F - F0[j])) / 100, 0);
    return { id, naked, hedged: naked + fut };
  });
}

/// Smallest parallel move (bp, 5 bp steps within ±300) that changes the contract's CTD, or null.
export function ctdSwitchBp(spec: FutureSpec, zeros: ZeroPoint[]): number | null {
  const ctd = futureQuote(spec, zeros).ctd;
  for (let bp = 5; bp <= 300; bp += 5) {
    if (futureQuote(spec, bump(zeros, "parallel", -bp)).ctd !== ctd) return -bp;
    if (futureQuote(spec, bump(zeros, "parallel", bp)).ctd !== ctd) return bp;
  }
  return null;
}
