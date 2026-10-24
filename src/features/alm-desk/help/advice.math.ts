import { rankAdvice } from "../../../lib/game/advice";
import type { AdviceItem } from "../../../lib/game/game.types";
import { surplusOf } from "../../immunization/immunization.math";
import { almConfig, bandOf, gapsOf } from "../engine/book.math";
import type { AlmMission, AlmState } from "../engine/alm.types";

export type AlmAdviceAction =
  | { kind: "fillMatch" }
  | { kind: "key"; code: "F2" | "F4" }
  | { kind: "screen"; screen: "debrief" }
  | { kind: "tab"; tab: "whatIf" | "guide" }
  | { kind: "point"; anchor: string };

export type AlmAdvice = AdviceItem<AlmAdviceAction>;

/// Gap band used when the mission has no gap objective.
export const DEFAULT_GAP_BAND = 0.25;
const COSTS_WARN = 0.8;
const CONV_NOTE_MIN = 5;

/// Live next-move advice for the book, most urgent first (at most six).
export function almAdvice(mission: AlmMission, state: AlmState): AlmAdvice[] {
  const cfg = almConfig(mission);
  const g = state.game;
  const surplus = surplusOf(g, cfg);
  if (state.settled) return [{ id: "ended", tone: "done", vars: { surplus }, action: { kind: "screen", screen: "debrief" } }];

  const { gap, convGap } = gapsOf(g, cfg);
  const band = bandOf(mission, "gapMisses") ?? DEFAULT_GAP_BAND;
  const convBand = bandOf(mission, "convexityMisses");
  const items: AlmAdvice[] = [];
  const round = g.round;

  if (Math.abs(gap) > band) items.push({ id: "gapOutside", tone: "urgent", vars: { gap, band }, action: { kind: "fillMatch" } });
  if (surplus < 0) items.push({ id: "surplusNegative", tone: "urgent", vars: { surplus }, action: { kind: "point", anchor: "attr" } });
  if (convBand !== undefined && Math.abs(convGap) > convBand)
    items.push({ id: "convexityGap", tone: "urgent", vars: { gap: convGap, band: convBand }, action: { kind: "tab", tab: "whatIf" } });

  for (const e of state.events)
    if (e.kind === "matured" && e.t === round && round > 0)
      items.push({ id: "maturedThisYear", tone: "suggest", vars: { tenor: e.tenor, amount: e.amount }, action: { kind: "fillMatch" } });
  for (const o of mission.objectives)
    if (o.kind === "costsBelow" && state.costs > COSTS_WARN * o.limit)
      items.push({ id: "costsHigh", tone: "suggest", vars: { costs: state.costs, limit: o.limit } });
  if (mission.maxTrades !== undefined) {
    const left = mission.maxTrades - state.trades;
    if (left <= 1) items.push({ id: "tradesLow", tone: "suggest", vars: { left } });
  }

  for (const e of cfg.extraLiabilities ?? [])
    if (e.from === round + 1) items.push({ id: "liabilitySoon", tone: "info", vars: { amount: e.amount, year: e.year, from: e.from } });
  if (convBand !== undefined && Math.abs(convGap) <= convBand) items.push({ id: "convexityGap", tone: "info", vars: { gap: convGap, band: convBand } });
  if (convBand === undefined && Math.abs(convGap) > CONV_NOTE_MIN)
    items.push({ id: "convexityNote", tone: "info", vars: { gap: convGap, sign: Math.sign(convGap) }, action: { kind: "tab", tab: "guide" } });
  if (Math.abs(gap) <= band) items.push({ id: "matched", tone: "info", vars: { gap, band }, action: { kind: "key", code: "F2" } });

  return rankAdvice(items);
}
