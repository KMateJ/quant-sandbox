import { portfolioReturn } from "./market.math";
import { successOdds } from "./odds.math";
import type { RetirementAction, RetirementEvent, RetirementMission, RetirementState } from "./retirement.types";
import { nextWithdrawal } from "./rules.math";

/// A year is "big" when the portfolio moves more than this.
export const BIG_YEAR = 0.12;
/// Taking less than this share of last year's amount counts as a cut.
export const CUT_RATIO = 0.9;

/// Opening state: the full pot at the mission's equity share, nothing taken yet.
export function startRetirement(mission: RetirementMission, seed: number): RetirementState {
  return {
    missionId: mission.id,
    seed,
    year: 0,
    wealth: mission.start,
    equity: mission.equity0,
    last: null,
    cuts: 0,
    broke: false,
    minOdds: 1,
    rows: [],
    events: [{ t: 0, kind: "start" }],
    settled: false,
  };
}

function take(state: RetirementState, amount: number, equityIn: number, tag: "manual" | "auto", mission: RetirementMission, shocks: [number, number][]): RetirementState {
  if (state.settled) return state;
  const y = state.year + 1;
  const equity = mission.equityLocked ? state.equity : Math.min(1, Math.max(0, equityIn));
  const asked = Math.max(0, amount);
  const odds = successOdds(mission, state.seed, y, state.wealth, asked, equity);
  const taken = Math.min(asked, state.wealth);
  const broke = asked >= state.wealth && asked > 0;
  const [z1, z2] = shocks[y - 1];
  const r = portfolioReturn(mission, equity, z1, z2, y);
  const end = broke ? 0 : (state.wealth - taken) * (1 + r);
  const events: RetirementEvent[] = [{ t: y, kind: "take", amount: taken, equity, tag }];
  let cuts = state.cuts;
  if (state.last !== null && state.last > 0 && taken < CUT_RATIO * state.last) {
    cuts++;
    events.push({ t: y, kind: "cut", amount: taken, pct: taken / state.last - 1 });
  }
  if (!broke && Math.abs(r) > BIG_YEAR) events.push({ t: y, kind: "bigYear", r });
  if (broke) events.push({ t: y, kind: "broke" });
  const settled = broke || y >= mission.years;
  if (settled) events.push({ t: y, kind: "end", wealth: end });
  return {
    ...state,
    year: y,
    wealth: end,
    equity,
    last: taken,
    cuts,
    broke,
    minOdds: Math.min(state.minOdds, odds),
    rows: [...state.rows, { y, start: state.wealth, take: taken, equity, r: broke ? 0 : r, end, odds }],
    events: [...state.events, ...events],
    settled,
  };
}

/// Applies one desk action; `shocks` is `yearShocks(mission, state.seed)`.
export function reduceRetirement(state: RetirementState, action: RetirementAction, mission: RetirementMission, shocks: [number, number][]): RetirementState {
  switch (action.type) {
    case "restore":
      return action.state;
    case "take":
      return take(state, action.amount, action.equity, action.tag, mission, shocks);
    case "auto": {
      let s = state;
      for (let i = 0; i < action.years && !s.settled; i++)
        s = take(s, nextWithdrawal(action.rule, mission, s.last, s.wealth), s.equity, "auto", mission, shocks);
      return s;
    }
    default: {
      const never: never = action;
      return never;
    }
  }
}
