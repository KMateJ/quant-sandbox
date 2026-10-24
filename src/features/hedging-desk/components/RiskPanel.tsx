import { BandMeter } from "../../../components/game";
import Panel from "../../../components/layout/Panel";
import { useI18n } from "../../../i18n";
import { money, num, signed, signedMoney } from "../../../components/game/gameFormat";
import { breakevenMove } from "../sidePanels.math";
import type { HedgingDeskModel } from "../useHedgingDesk";

const METER_RANGE = 400;

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
    <Panel id="hd-risk" title={t("hdRiskPanelTitle")} className="gdesk-panel">
      <div className="gdesk-netdelta">
        <span className="gdesk-label">{t("hdSideNetDelta")}</span>
        <span className="gdesk-netdelta-value gdesk-num">
          {signed(greeks.delta)} <small>{t("hdSideShares")}</small>
        </span>
        <span className={`gdesk-bandtag ${inBand ? "gdesk-up" : "gdesk-down"}`}>
          {t(inBand ? "hdSideInBand" : "hdSideOutOfBand")}
        </span>
        <span className="gdesk-label gdesk-num">
          {t("hdSideDollarDelta")} {signedMoney(greeks.dollarDelta)}
        </span>
      </div>
      <BandMeter
        value={greeks.delta}
        min={-METER_RANGE}
        max={METER_RANGE}
        lo={-mission.band}
        hi={mission.band}
        scale={[signed(-METER_RANGE), "0", signed(METER_RANGE)]}
        label={t("hdSideMeterAria", { delta: signed(greeks.delta), band: mission.band })}
      />
      <dl className="hdesk-greekgrid">
        {cells.map((c) => (
          <div key={c.label}>
            <dt className="gdesk-label">{c.label}</dt>
            <dd className="gdesk-num">{c.value}</dd>
          </div>
        ))}
      </dl>
      <dl className="gdesk-kv">
        {rows.map((r) => (
          <div key={r.label}>
            <dt>{r.label}</dt>
            <dd className="gdesk-num">{r.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
