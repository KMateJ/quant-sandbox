import Panel from "../../../components/layout/Panel";
import { BandMeter, money, num, signed, signedMoney, toneClass } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import { bandOf } from "../engine/book.math";
import type { AlmDeskModel } from "../useAlmDesk";

const RANGE = 2;
const DEFAULT_BAND = 0.25;

/// Duration gap meter and the book's rate risk, cash, costs, misses and trades left.
export default function AlmRiskPanel({ desk }: { desk: AlmDeskModel }) {
  const { t } = useI18n();
  const { risk, state, mission, tradesLeft } = desk;
  const band = bandOf(mission, "gapMisses") ?? DEFAULT_BAND;
  const perBp = -risk.netDv01;
  const rows: [TranslationKey, string, string?][] = [
    ["almdRiskDurA", num(risk.durA, 2)],
    ["almdRiskDurL", num(risk.durL, 2)],
    ["almdRiskDv01A", money(risk.dv01A)],
    ["almdRiskDv01L", money(risk.dv01L)],
    ["almdRiskConvA", num(risk.convA, 1)],
    ["almdRiskConvL", num(risk.convL, 1)],
    ["almdRiskPerBp", signedMoney(perBp), toneClass(Math.round(perBp))],
    ["almdRiskCash", money(state.game.cash)],
    ["almdRiskCosts", money(state.costs)],
    ["almdRiskMisses", String(state.misses)],
  ];
  if (bandOf(mission, "convexityMisses") !== undefined) rows.push(["almdRiskConvMisses", String(state.convMisses)]);
  if (tradesLeft !== null) rows.push(["almdRiskTradesLeft", String(tradesLeft)]);
  const gapLabel = t("almdRiskGap", { gap: signed(risk.gap, 2), band: num(band, 2) });

  return (
    <Panel id="almd-risk" title={t("almdRiskTitle")} className="gdesk-panel">
      <p className="gdesk-label gdesk-num">{gapLabel}</p>
      <BandMeter value={risk.gap} min={-RANGE} max={RANGE} lo={-band} hi={band} scale={["−2y", "0", "+2y"]} label={gapLabel} />
      <dl className="gdesk-kv">
        {rows.map(([key, value, cls]) => (
          <div key={key}>
            <dt>{t(key)}</dt>
            <dd className={["gdesk-num", cls].filter(Boolean).join(" ")}>{value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
