import { useMemo, useState } from "react";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import { incomeCurve, incomeSplit, toxicFlow, toxicSummary } from "../../../guide.micro.adverseSelection.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import ToxicIncomeChart from "./ToxicIncomeChart";

/// Spread income per minute against the half-spread: the informed share pushes the best spread out and creates a break-even spread.
export default function ToxicIncomeFigure() {
  const { t } = useI18n();
  const [informed, setInformed] = useState(0.2);
  const [sigma, setSigma] = useState(1);
  const [delta, setDelta] = useState(2);
  const flow = useMemo(() => toxicFlow(informed, sigma), [informed, sigma]);
  const rows = useMemo(() => incomeCurve(flow), [flow]);
  const summary = useMemo(() => toxicSummary(flow), [flow]);
  const split = incomeSplit(delta, flow);

  return (
    <GuideFigure title={t("gfMsToxicIncomeTitle")} labId="market-making">
      <div className="gf-sliders">
        <SliderField label={t("gfMsToxicInformed")} min={0} max={0.4} step={0.01} value={informed} onChange={setInformed} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfMsToxicVolatility")} min={0.25} max={2} step={0.05} value={sigma} onChange={setSigma} formatValue={(v) => v.toFixed(2)} />
      </div>
      <p className="gf-hint">{t("gfMsToxicUnits")}</p>
      <div className="gf-chart gf-chart--tall" role="img" aria-label={t("gfMsToxicAria")}>
        <ToxicIncomeChart rows={rows} summary={summary} delta={delta} onDelta={setDelta} />
      </div>
      <FigureReadout
        items={[
          { label: t("gfMsToxicNoise"), value: fmt(split.noise, 1) },
          { label: t("gfMsToxicLoss"), value: fmt(split.informed, 1) },
          { label: t("gfMsToxicNet"), value: fmt(split.net, 1), tone: "strong" },
          { label: t("gfMsToxicBest"), value: fmt(summary.best, 2), tone: "accent" },
          { label: t("gfMsToxicBreakEven"), value: fmt(summary.breakEven, 2) },
        ]}
      />
    </GuideFigure>
  );
}
