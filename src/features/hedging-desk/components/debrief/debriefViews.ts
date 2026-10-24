import { money, pct, signedMoney } from "../../../../components/game/gameFormat";
import type { TranslationKey } from "../../../../i18n";
import type { Attribution } from "../../engine/debrief.math";
import type { Translate } from "../../missionCopy";
import type { DebriefModel } from "../../useDebrief";
import type { HedgingDeskModel } from "../../useHedgingDesk";

const tone = (x: number) => (x > 0 ? ("up" as const) : x < 0 ? ("down" as const) : undefined);

const PARTS: [keyof Attribution, TranslationKey][] = [
  ["premium", "hdDebriefPremium"],
  ["optionSettlement", "hdDebriefOptionSettlement"],
  ["stockPnl", "hdDebriefStockPnl"],
  ["financing", "hdDebriefFinancing"],
  ["costs", "hdDebriefCosts"],
];

/// Headline numbers of the verdict banner: final P&L, realized and implied vol.
export function bannerStats(t: Translate, desk: HedgingDeskModel, { rvFull }: DebriefModel) {
  return [
    { label: t("hdDebriefFinalPnl"), value: signedMoney(desk.pnl), tone: tone(desk.pnl) },
    { label: t("hdDebriefRealizedVol"), value: rvFull === null ? "—" : pct(rvFull, 2) },
    { label: t("hdDebriefImpliedVol"), value: pct(desk.mission.market.impliedVol, 2) },
  ];
}

const bar = (t: Translate, label: TranslationKey, value: number) => ({ label: t(label), value, display: signedMoney(value) });

/// P&L attribution bars: one per component, the net P&L as the total.
export function attributionRows(t: Translate, { parts }: DebriefModel) {
  return {
    rows: PARTS.map(([k, label]) => bar(t, label, parts[k])),
    total: bar(t, "hdDebriefNet", parts.net),
  };
}

/// Auto-hedge policies replayed on the same path, plus the user's own run once settled.
export function policyRows(t: Translate, desk: HedgingDeskModel, debrief: DebriefModel) {
  const cells = (pnl: number, breaches: number, trades: number, costs: number) =>
    [signedMoney(pnl), String(breaches), String(trades), money(costs)];
  const rows = debrief.policies.map((p) => ({
    name: t(`hdDebriefPolicy${p.key}` as TranslationKey),
    cells: cells(p.pnl, p.breaches, p.trades, p.costs),
    highlight: false,
  }));
  if (desk.state.settled) {
    const { pnl, trades, state } = desk;
    rows.push({ name: t("hdDebriefYourRun"), cells: cells(pnl, state.breaches, trades, state.costsPaid), highlight: true });
  }
  return rows;
}

/// Column headings of the policy table.
export const policyColumns = (t: Translate) =>
  [t("hdDebriefPolicy"), t("hdDebriefPnl"), t("hdDebriefBreaches"), t("hdDebriefTrades"), t("hdDebriefCostsCol")];
