import { zeroGrid, zeroRate } from "./curve.math";
import { futureQuote } from "./pricing.math";
import { objectiveLimits } from "./limits.math";
import { bookValue, bucketsOf, dv01HedgeQty, isExpired, krdHedgeQty, ratesRisk } from "./risk.math";
import type { CurveFactors, RatesAction, RatesEvent, RatesMission, RatesState } from "./rates.types";

const bpMove = (a: CurveFactors, b: CurveFactors, t: number) => Math.round((zeroRate(b, t) - zeroRate(a, t)) * 1e5) / 10;

/// Opening state: the mission's opening futures on day 0 of `path`.
export function startRates(mission: RatesMission, seed: number, path: CurveFactors[]): RatesState {
  return {
    missionId: mission.id,
    seed,
    day: 0,
    contracts: mission.futures.map((_, j) => mission.opening[j] ?? 0),
    futPnl: 0,
    costs: 0,
    traded: 0,
    misses: 0,
    krdMisses: 0,
    book0: bookValue(mission, zeroGrid(path[0])),
    hist: [{ day: 0, hedged: 0, naked: 0 }],
    events: [{ t: 0, kind: "start" }],
    settled: false,
  };
}

/// Hedged P&L to date: book move plus futures P&L minus costs.
export const hedgedPnl = (s: RatesState) => s.hist[s.hist.length - 1].hedged;

function trade(state: RatesState, mission: RatesMission, path: CurveFactors[], j: number, qty: number, tag: "manual" | "auto"): RatesState {
  const spec = mission.futures[j];
  if (state.settled || qty === 0 || !spec || isExpired(spec, state.day)) return state;
  const cost = Math.abs(qty) * mission.costPerContract;
  const contracts = state.contracts.map((q, i) => (i === j ? q + qty : q));
  const price = futureQuote(spec, zeroGrid(path[state.day])).F;
  const hist = state.hist.map((h, i) => (i === state.hist.length - 1 ? { ...h, hedged: h.hedged - cost } : h));
  const fill: RatesEvent = { t: state.day, kind: "fill", future: spec.id, qty, price, tag };
  return { ...state, contracts, costs: state.costs + cost, traded: state.traded + Math.abs(qty), hist, events: [...state.events, fill] };
}

function stepDay(state: RatesState, mission: RatesMission, path: CurveFactors[]): RatesState {
  const d = state.day;
  const z0 = zeroGrid(path[d]);
  const z1 = zeroGrid(path[d + 1]);
  const events: RatesEvent[] = [];
  const risk = ratesRisk(state, mission, z0);
  const { dv01Band, krdLimit } = objectiveLimits(mission);
  let { misses, krdMisses } = state;
  if (dv01Band !== null && Math.abs(risk.net) > dv01Band) {
    misses++;
    events.push({ t: d, kind: "dv01Miss", net: risk.net });
  }
  if (krdLimit !== null) {
    const buckets = bucketsOf(risk.kNet);
    const worst = buckets.reduce((w, v, k) => (Math.abs(v) > Math.abs(buckets[w]) ? k : w), 0);
    if (Math.abs(buckets[worst]) > krdLimit) {
      krdMisses++;
      events.push({ t: d, kind: "krdMiss", node: worst, value: buckets[worst] });
    }
  }
  let futPnl = state.futPnl;
  const contracts = state.contracts.slice();
  mission.futures.forEach((spec, j) => {
    const q0 = futureQuote(spec, z0);
    const q1 = futureQuote(spec, z1);
    futPnl += (contracts[j] * spec.size * (q1.F - q0.F)) / 100;
    if (q1.ctd !== q0.ctd) events.push({ t: d + 1, kind: "ctdSwitch", future: spec.id, to: q1.ctd });
    if (spec.expiryDay === d + 1 && contracts[j] !== 0) {
      events.push({ t: d + 1, kind: "expired", future: spec.id, qty: contracts[j], price: q1.F });
      contracts[j] = 0;
    }
  });
  const day = d + 1;
  const naked = bookValue(mission, z1) - state.book0;
  const hedged = naked + futPnl - state.costs;
  events.unshift({ t: day, kind: "move", d2: bpMove(path[d], path[day], 2), d10: bpMove(path[d], path[day], 10) });
  const settled = day >= mission.days;
  if (settled) events.push({ t: day, kind: "end", pnl: hedged });
  return { ...state, day, contracts, futPnl, misses, krdMisses, hist: [...state.hist, { day, hedged, naked }], events: [...state.events, ...events], settled };
}

/// Applies one desk action; `path` is the mission's factor path for the state's seed.
export function reduceRates(state: RatesState, action: RatesAction, mission: RatesMission, path: CurveFactors[]): RatesState {
  switch (action.type) {
    case "trade":
      return trade(state, mission, path, action.future, action.qty, action.tag);
    case "dv01Hedge":
      return trade(state, mission, path, action.future, dv01HedgeQty(state, mission, zeroGrid(path[state.day]), action.future), "auto");
    case "krdHedge": {
      const target = krdHedgeQty(state, mission, zeroGrid(path[state.day]));
      return target.reduce((s, q, j) => trade(s, mission, path, j, q - s.contracts[j], "auto"), state);
    }
    case "step": {
      let s = state;
      for (let i = 0; i < action.days && !s.settled; i++) s = stepDay(s, mission, path);
      return s;
    }
    case "restore":
      return action.state;
    default: {
      const never: never = action;
      return never;
    }
  }
}
