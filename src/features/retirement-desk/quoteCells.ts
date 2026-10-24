import type { QuoteCell } from "../../components/game";
import { pct } from "../../components/game/gameFormat";
import { avgSpend } from "./engine/objectives.math";
import { amount, spct } from "./retirementFormat";
import { firstDecadeReturn } from "./ticket.math";
import type { RetirementDeskModel } from "./useRetirementDesk";

type Translate = (key: string, vars?: Record<string, unknown>) => string;

const tone = (x: number): QuoteCell["tone"] => (x > 0 ? "up" : x < 0 ? "down" : undefined);

/// Quote strip: wealth, last return, spent so far, average spend, cuts, first-decade return, odds now.
export function quoteCells(desk: RetirementDeskModel, t: Translate): QuoteCell[] {
  const { state, mission, oddsNow } = desk;
  const last = state.rows[state.rows.length - 1];
  const spent = state.rows.reduce((a, r) => a + r.take, 0);
  const decade = firstDecadeReturn(state);
  const allowed = mission.objectives.find((o) => o.kind === "cutsAtMost");
  return [
    { label: t("retrQWealth"), value: amount(state.wealth) },
    { label: t("retrQLast"), value: last ? spct(last.r) : "—", tone: last ? tone(last.r) : undefined },
    { label: t("retrQSpent"), value: amount(spent) },
    { label: t("retrQAvg"), value: state.rows.length ? amount(avgSpend(mission, state)) : "—" },
    { label: t("retrQCuts"), value: allowed?.kind === "cutsAtMost" ? `${state.cuts} / ${allowed.allowed}` : String(state.cuts) },
    { label: t("retrQDecade"), value: decade === null ? "—" : t("retrPerYear", { r: spct(decade, 2) }), tone: decade === null ? undefined : tone(decade) },
    { label: t("retrQOdds"), value: pct(oddsNow, 0) },
  ];
}
