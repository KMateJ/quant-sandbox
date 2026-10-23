import Panel from "../../../../components/layout/Panel";
import { useI18n } from "../../../../i18n";
import { signed, signedMoney, toneClass } from "../../deskFormat";
import type { DebriefModel } from "../../useDebrief";
import type { HedgingDeskModel } from "../../useHedgingDesk";

/// Theta collected against gamma paid, and the realized-minus-implied vol gap.
export default function ThetaGammaPanel({ desk, debrief }: { desk: HedgingDeskModel; debrief: DebriefModel }) {
  const { t } = useI18n();
  const { tg, rvFull } = debrief;
  const gap = rvFull === null ? null : (rvFull - desk.mission.market.impliedVol) * 100;
  const cards = [
    { label: t("hdDebriefThetaCollected"), value: signedMoney(tg.thetaCollected), tone: toneClass(tg.thetaCollected), note: t("hdDebriefThetaNote") },
    { label: t("hdDebriefGammaPaid"), value: signedMoney(-tg.gammaPaid), tone: toneClass(-tg.gammaPaid), note: t("hdDebriefGammaNote") },
    { label: t("hdDebriefVolGap"), value: gap === null ? "—" : t("hdDebriefVolPts", { value: signed(gap, 2) }), tone: "", note: t("hdDebriefVolGapNote") },
  ];
  return (
    <Panel title={t("hdDebriefWhyTitle")} className="hdesk-panel">
      <div className="hdesk-why">
        {cards.map((c) => (
          <div key={c.label} className="hdesk-why-card">
            <span className="hdesk-label">{c.label}</span>
            <strong className={`hdesk-num ${c.tone}`}>{c.value}</strong>
            <p>{c.note}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
