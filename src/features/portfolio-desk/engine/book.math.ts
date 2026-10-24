import { riskParityWeights, scaleToVol } from "../../../lib/finance/portfolio";
import type { Matrix } from "../../../lib/math/matrix";
import { ewmaCov } from "./market.math";
import { exAnteVol, riskShares } from "./risk.math";
import type { PortfolioAction, PortfolioEvent, PortfolioMission, PortfolioState } from "./portfolio.types";

const ASSET_IDS = ["EQ", "EM", "GOV", "CRD", "GOLD"];
const BIG_MONTH = 0.03;
const DRAWDOWN_ALERT = -0.1;
const DEFAULT_SHARE_LIMIT = 0.3;

const sum = (v: number[]) => v.reduce((a, b) => a + b, 0);

/// Opening book: NAV 1, the mission's start weights, nothing realised yet.
export function startPortfolio(mission: PortfolioMission, seed: number): PortfolioState {
  return {
    missionId: mission.id,
    seed,
    month: 0,
    w: mission.start.slice(),
    nav: 1,
    bench: 1,
    peak: 1,
    mdd: 0,
    costs: 0,
    shareMisses: 0,
    hist: [{ m: 0, nav: 1, bench: 1, dd: 0, rp: 0, rb: 0, w: mission.start.slice() }],
    events: [{ t: 0, kind: "start" }],
    settled: false,
  };
}

/// Risk-share cap checked at quarter ends: the mission's `riskShareMisses` limit, else 30%.
export function shareLimit(mission: PortfolioMission): number {
  const o = mission.objectives.find((x) => x.kind === "riskShareMisses");
  return o?.kind === "riskShareMisses" ? o.limit : DEFAULT_SHARE_LIMIT;
}

/// Long-only targets with a total of at most 1 (negatives clipped, excess scaled away).
function cleanTargets(targets: number[]): number[] {
  const t = targets.map((x) => Math.max(0, x));
  const total = sum(t);
  return total > 1 ? t.map((x) => x / total) : t;
}

/// Turnover Σ|Δw|/2 with cash counted as a sixth line.
export function turnoverOf(from: number[], to: number[]): number {
  const dCash = Math.abs(sum(from) - sum(to));
  return (sum(to.map((x, i) => Math.abs(x - from[i]))) + dCash) / 2;
}

function rebalance(state: PortfolioState, mission: PortfolioMission, S: Matrix, targets: number[], tag: "manual" | "auto"): PortfolioState {
  const next = cleanTargets(targets);
  const turnover = turnoverOf(state.w, next);
  if (turnover < 1e-9) return state;
  const cost = (mission.costBp / 1e4) * state.nav * turnover;
  const event: PortfolioEvent = { t: state.month, kind: "rebalance", turnover, vol: exAnteVol(next, S), tag };
  return { ...state, w: next, nav: state.nav - cost, costs: state.costs + cost, events: [...state.events, event] };
}

function stepOne(state: PortfolioState, mission: PortfolioMission, R: number[][]): PortfolioState {
  const r = R[state.month];
  const rp = sum(state.w.map((w, i) => w * r[i])) + ((1 - sum(state.w)) * mission.riskFree) / 12;
  const rb = 0.6 * r[0] + 0.4 * r[2];
  const month = state.month + 1;
  const nav = state.nav * (1 + rp);
  const bench = state.bench * (1 + rb);
  const peak = Math.max(state.peak, nav);
  const dd = nav / peak - 1;
  const prevDd = state.hist[state.hist.length - 1].dd;
  const w = state.w.map((wi, i) => (wi * (1 + r[i])) / (1 + rp));
  const events: PortfolioEvent[] = [];
  if (Math.abs(rp) > BIG_MONTH) events.push({ t: month, kind: "bigMonth", fund: rp, eq: r[0], gov: r[2] });
  if (prevDd > DRAWDOWN_ALERT && dd <= DRAWDOWN_ALERT) events.push({ t: month, kind: "drawdown", dd });
  let shareMisses = state.shareMisses;
  if (month % 3 === 0) {
    const shares = riskShares(w, ewmaCov(mission, R, month));
    const top = shares.reduce((best, s, i) => (s > shares[best] ? i : best), 0);
    if (shares[top] > shareLimit(mission)) {
      shareMisses += 1;
      events.push({ t: month, kind: "shareMiss", asset: ASSET_IDS[top], share: shares[top] });
    }
  }
  const settled = month >= mission.months;
  if (settled) events.push({ t: month, kind: "end", nav, bench });
  return {
    ...state,
    month,
    w,
    nav,
    bench,
    peak,
    mdd: Math.max(state.mdd, -dd),
    shareMisses,
    hist: [...state.hist, { m: month, nav, bench, dd, rp, rb, w: state.w }],
    events: [...state.events, ...events],
    settled,
  };
}

/// Pure reducer of the portfolio desk; `R` is the mission's monthly return path. A settled book only accepts `restore`.
export function reducePortfolio(state: PortfolioState, action: PortfolioAction, mission: PortfolioMission, R: number[][]): PortfolioState {
  if (action.type === "restore") return action.state;
  if (state.settled) return state;
  const S = ewmaCov(mission, R, state.month);
  switch (action.type) {
    case "rebalance":
      return rebalance(state, mission, S, action.targets, action.tag);
    case "scaleToTarget":
      return rebalance(state, mission, S, scaleToVol(state.w, S, mission.target), "manual");
    case "riskParity":
      return rebalance(state, mission, S, scaleToVol(riskParityWeights(S), S, mission.target), "manual");
    case "step": {
      let s = state;
      for (let k = 0; k < action.months && !s.settled; k++) s = stepOne(s, mission, R);
      return s;
    }
    default: {
      const never: never = action;
      return never;
    }
  }
}
