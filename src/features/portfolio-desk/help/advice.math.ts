import { rankAdvice } from "../../../lib/game/advice";
import type { AdviceItem } from "../../../lib/game/game.types";
import { ewmaCov } from "../engine/market.math";
import type { PortfolioMission, PortfolioState } from "../engine/portfolio.types";
import { corrChange, exAnteVol, riskShares } from "../engine/risk.math";

export type PortfolioAdviceAction =
  | { kind: "fill"; preset: "scale" | "parity" | "bench" }
  | { kind: "key"; code: "F2" | "F3" | "F4" | "F6" }
  | { kind: "screen"; screen: "debrief" }
  | { kind: "tab"; tab: "whatIf" | "guide" }
  | { kind: "point"; anchor: string };

export type PortfolioAdvice = AdviceItem<PortfolioAdviceAction>;

/// Vol band used when the mission has no realised-vol objective.
export const DEFAULT_VOL_BAND: readonly [number, number] = [0.085, 0.115];
const DD_MARGIN = 0.05;
const CONCENTRATED = 0.5;
const CORR_UP = 0.08;
const COSTS_WARN = 0.8;

/// Realised-vol band of the mission, else the default.
export function volBandOf(mission: PortfolioMission): readonly [number, number] {
  const o = mission.objectives.find((x) => x.kind === "realizedVolBand");
  return o?.kind === "realizedVolBand" ? [o.lo, o.hi] : DEFAULT_VOL_BAND;
}

/// Mean change of the off-diagonal correlations against the calm market.
export function meanCorrChange(change: number[][]): number {
  let sum = 0;
  let n = 0;
  change.forEach((row, i) => row.forEach((c, j) => {
    if (j > i) {
      sum += c;
      n++;
    }
  }));
  return n ? sum / n : 0;
}

const topOf = (shares: number[]) => shares.reduce((best, s, i) => (s > shares[best] ? i : best), 0);

/// Live next-move advice, most urgent first (at most six). Asset vars are indices into the asset list.
export function portfolioAdvice(mission: PortfolioMission, state: PortfolioState, R: number[][]): PortfolioAdvice[] {
  if (state.settled) return [{ id: "ended", tone: "done", vars: { nav: state.nav, bench: state.bench }, action: { kind: "screen", screen: "debrief" } }];
  const S = ewmaCov(mission, R, state.month);
  const vol = exAnteVol(state.w, S);
  const shares = riskShares(state.w, S);
  const top = topOf(shares);
  const [lo, hi] = volBandOf(mission);
  const dd = -state.hist[state.hist.length - 1].dd;
  const items: PortfolioAdvice[] = [];

  if (vol > hi || vol < lo)
    items.push({ id: "volOff", tone: "urgent", vars: { vol, lo, hi, hot: vol > hi ? 1 : 0 }, action: { kind: "fill", preset: vol > hi ? "scale" : "parity" } });
  for (const o of mission.objectives) {
    if (o.kind === "maxDrawdown" && dd >= o.limit - DD_MARGIN)
      items.push({ id: "drawdownNear", tone: "urgent", vars: { dd, limit: o.limit }, action: { kind: "point", anchor: "nav" } });
    if (o.kind === "riskShareMisses" && (state.month + 1) % 3 === 0) {
      const over = shares[top] > o.limit;
      items.push({ id: "quarterEnd", tone: over ? "urgent" : "info", vars: { asset: top, share: shares[top], limit: o.limit, over: over ? 1 : 0 },
        action: over ? { kind: "fill", preset: "parity" } : undefined });
    }
    if (o.kind === "costsBelow" && state.costs * 1e4 > COSTS_WARN * o.limitBp)
      items.push({ id: "costsHigh", tone: "suggest", vars: { costs: state.costs * 1e4, limit: o.limitBp } });
  }
  if (shares[top] > CONCENTRATED) items.push({ id: "concentrated", tone: "suggest", vars: { asset: top, share: shares[top] }, action: { kind: "fill", preset: "parity" } });
  if (mission.stressStart !== "random" && state.month < mission.stressStart)
    items.push({ id: "stressAhead", tone: "info", vars: { start: mission.stressStart, months: mission.stressStart - state.month }, action: { kind: "tab", tab: "whatIf" } });
  const change = meanCorrChange(corrChange(S, mission));
  if (change > CORR_UP) items.push({ id: "correlationsUp", tone: "info", vars: { change }, action: { kind: "point", anchor: "corr" } });
  if (vol >= lo && vol <= hi) items.push({ id: "onTarget", tone: "info", vars: { vol, lo, hi }, action: { kind: "key", code: "F2" } });

  return rankAdvice(items);
}

/// Every advice id the desk can show (for the copy test).
export const ADVICE_IDS = ["ended", "volOff", "drawdownNear", "quarterEnd", "costsHigh", "concentrated", "stressAhead", "correlationsUp", "onTarget"] as const;
