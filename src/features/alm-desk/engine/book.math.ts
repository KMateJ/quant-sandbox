import {
  DEFAULT_CONFIG,
  TENORS,
  advance,
  drawShock,
  exposure,
  immunisedWeights,
  liabilityConvexity,
  liabilityDuration,
  newGame,
  rebalance,
  surplusAttribution,
  surplusOf,
  yieldAt,
} from "../../immunization/immunization.math";
import type { GameConfig, GameState } from "../../immunization/immunization.types";
import type { AlmAction, AlmEvent, AlmMission, AlmState } from "./alm.types";

/// The mission's full game config (Immunization defaults plus its overrides).
export const almConfig = (mission: AlmMission): GameConfig => ({ ...DEFAULT_CONFIG, ...mission.config });

/// Band of the mission's gap or convexity objective, if it has one.
export function bandOf(mission: AlmMission, kind: "gapMisses" | "convexityMisses"): number | undefined {
  for (const o of mission.objectives) if (o.kind === kind) return o.band;
  return undefined;
}

/// Duration gap (assets − liability, modified) and convexity gap of a game.
export function gapsOf(game: GameState, cfg: GameConfig): { gap: number; convGap: number } {
  const e = exposure(game);
  return { gap: e.dMod - liabilityDuration(game, cfg), convGap: e.convexity - liabilityConvexity(game, cfg) };
}

/// Weights clamped at zero and scaled to sum to one over the four slots (2y, 5y, 12y, cash).
function normalise(w: number[]): number[] {
  const c = Array.from({ length: TENORS.length + 1 }, (_, i) => Math.max(0, w[i] ?? 0));
  const sum = c.reduce((a, b) => a + b, 0);
  return sum > 0 ? c.map((x) => x / sum) : [...TENORS.map(() => 0), 1];
}

/// Opening state: the liability's PV invested, then moved at no cost into the mission's start weights.
export function startAlm(mission: AlmMission, seed: number): AlmState {
  const cfg = almConfig(mission);
  const game = rebalance(newGame(seed, cfg), normalise(mission.startWeights), { ...cfg, costBp: 0 });
  return {
    missionId: mission.id,
    seed,
    game,
    misses: 0,
    convMisses: 0,
    trades: 0,
    costs: 0,
    minSurplus: surplusOf(game, cfg),
    events: [{ t: 0, kind: "start" }],
    settled: false,
  };
}

function trade(state: AlmState, weights: number[], tag: "manual" | "auto", mission: AlmMission): AlmState {
  const t = state.game.round;
  if (mission.maxTrades !== undefined && state.trades >= mission.maxTrades)
    return { ...state, events: [...state.events, { t, kind: "rejected", reason: "tradeLimit" }] };
  const game = rebalance(state.game, normalise(weights), almConfig(mission));
  if (game === state.game) return state;
  const cost = game.pendingCost - state.game.pendingCost;
  const event: AlmEvent = { t, kind: "rebalance", cost, duration: exposure(game).dMod, tag };
  return { ...state, game, trades: state.trades + 1, costs: state.costs + cost, events: [...state.events, event] };
}

/// Adds a newly announced liability's PV to cash and rewrites the round's history entry to match.
function contribute(prev: GameState, game: GameState, amount: number, cfg: GameConfig): GameState {
  const funded = { ...game, cash: game.cash + amount };
  const last = game.history[game.history.length - 1];
  const fixed = { ...last, surplus: surplusOf(funded, cfg), assets: last.assets + amount, attribution: surplusAttribution(prev, funded, cfg) };
  return { ...funded, history: [...game.history.slice(0, -1), fixed] };
}

function step(state: AlmState, mission: AlmMission): AlmState {
  const cfg = almConfig(mission);
  const prev = state.game;
  const t = prev.round + 1;
  const events: AlmEvent[] = [];
  let { misses, convMisses } = state;
  const { gap, convGap } = gapsOf(prev, cfg);
  const gapBand = bandOf(mission, "gapMisses");
  const convBand = bandOf(mission, "convexityMisses");
  if (gapBand !== undefined && Math.abs(gap) > gapBand) {
    misses++;
    events.push({ t: prev.round, kind: "gapMiss", gap });
  }
  if (convBand !== undefined && Math.abs(convGap) > convBand) {
    convMisses++;
    events.push({ t: prev.round, kind: "convMiss", gap: convGap });
  }

  const shock = drawShock(state.seed, t, cfg);
  let game = advance(prev, shock, cfg);
  events.push({ t, kind: "shock", ...shock });
  for (const p of prev.positions)
    if (p.maturity <= 1) events.push({ t, kind: "matured", tenor: TENORS[p.slot], amount: p.face });
  for (const e of cfg.extraLiabilities ?? []) {
    if (e.year === t && prev.round >= e.from) events.push({ t, kind: "liabilityPaid", amount: e.amount });
    if (e.from !== t || e.from >= e.year) continue;
    const n = e.year - t;
    const contribution = mission.contributionOnAdd ? e.amount / (1 + yieldAt(game.curve, n)) ** n : 0;
    if (contribution > 0) game = contribute(prev, game, contribution, cfg);
    events.push({ t, kind: "liabilityAdded", amount: e.amount, year: e.year, contribution });
  }

  const surplus = surplusOf(game, cfg);
  const settled = game.round >= cfg.years;
  if (settled) events.push({ t, kind: "end", surplus });
  return { ...state, game, misses, convMisses, minSurplus: Math.min(state.minSurplus, surplus), events: [...state.events, ...events], settled };
}

/// Applies one desk action; a settled book ignores everything but `restore`.
export function reduceAlm(state: AlmState, action: AlmAction, mission: AlmMission): AlmState {
  if (action.type === "restore") return action.state;
  if (state.settled) return state;
  switch (action.type) {
    case "rebalance":
      return trade(state, action.weights, action.tag, mission);
    case "match":
      return trade(state, immunisedWeights(state.game, almConfig(mission)), "auto", mission);
    case "step":
      return step(state, mission);
    default: {
      const never: never = action;
      return never;
    }
  }
}
