import Panel from "../../../components/layout/Panel";
import { useI18n } from "../../../i18n";
import { money, num, signed, signedMoney } from "../deskFormat";
import { breakevenMove } from "../sidePanels.math";
import type { HedgingDeskModel } from "../useHedgingDesk";
import DeltaMeter from "./DeltaMeter";

/// Net delta against the band, the book's Greeks, and cash / costs / breaches.
export default function RiskPanel({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const { greeks, mission, state, pnl } = desk;
  const inBand = Math.abs(greeks.delta) <= mission.band;
  const breachLimit = mission.objectives.find((o) => o.kind === "maxBreaches");
  const breakeven = breakevenMove(greeks.gamma, greeks.theta);
  const cells = [
    { label: t("hdSideGamma"), value: signed(greeks.gamma, 1) },
    { label: t("hdSideVega"), value: signedMoney(greeks.vega) },
    { label: t("hdSideTheta"), value: signedMoney(greeks.theta) },
    { label: t("hdSideDollarGamma"), value: signedMoney(greeks.dollarGamma1pct) },
  ];
  const rows = [
    { label: t("hdSideCash"), value: money(state.cash) },
    { label: t("hdSideBookValue"), value: money(pnl - state.cash) },
    { label: t("hdSideCostsPaid"), value: money(state.costsPaid) },
    {
      label: t("hdSideBreaches"),
      value: breachLimit && "limit" in breachLimit ? `${state.breaches} / ${breachLimit.limit}` : String(state.breaches),
    },
    { label: t("hdSideBreakeven"), value: breakeven === null ? "—" : `$${num(breakeven, 2)}` },
  ];
  return (
    <Panel id="hd-risk" title={t("hdRiskPanelTitle")} className="hdesk-panel">
      <div className="hdesk-netdelta">
        <span className="hdesk-label">{t("hdSideNetDelta")}</span>
        <span className="hdesk-netdelta-value hdesk-num">
          {signed(greeks.delta)} <small>{t("hdSideShares")}</small>
        </span>
        <span className={`hdesk-bandtag ${inBand ? "hdesk-up" : "hdesk-down"}`}>
          {t(inBand ? "hdSideInBand" : "hdSideOutOfBand")}
        </span>
        <span className="hdesk-label hdesk-num">
          {t("hdSideDollarDelta")} {signedMoney(greeks.dollarDelta)}
        </span>
      </div>
      <DeltaMeter delta={greeks.delta} band={mission.band} />
      <dl className="hdesk-greekgrid">
        {cells.map((c) => (
          <div key={c.label}>
            <dt className="hdesk-label">{c.label}</dt>
            <dd className="hdesk-num">{c.value}</dd>
          </div>
        ))}
      </dl>
      <dl className="hdesk-kv">
        {rows.map((r) => (
          <div key={r.label}>
            <dt>{r.label}</dt>
            <dd className="hdesk-num">{r.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
