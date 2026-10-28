import { useMemo, useState } from "react";
import { LineChart } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { GM_FIGURE_SEED, gmLearning } from "../../../guide.micro.glostenMilgrom.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import GmLearningTiles from "./GmLearningTiles";

/// Ask, bid and belief of a Bayesian market maker over 40 trades; click a tile to flip that trade.
export default function GmLearningFigure() {
  const { t } = useI18n();
  const [pi, setPi] = useState(0.2);
  const [trueV, setTrueV] = useState<0 | 1>(1);
  const [seed, setSeed] = useState(GM_FIGURE_SEED);
  const [flips, setFlips] = useState<number[]>([]);
  const g = useMemo(() => gmLearning({ pi, trueV, seed, flips }), [pi, trueV, seed, flips]);
  const toggle = (k: number) => setFlips((f) => (f.includes(k) ? f.filter((x) => x !== k) : [...f, k]));
  const newSequence = () => {
    setSeed((s) => s + 1);
    setFlips([]);
  };

  return (
    <GuideFigure title={t("gfMsGmLearningTitle")} labId="glosten-milgrom">
      <div className="gf-toolbar">
        <SegmentedControl<0 | 1>
          ariaLabel={t("gfMsGmFieldTrueValue")}
          value={trueV}
          onChange={setTrueV}
          options={[
            { value: 0, label: "V = 0" },
            { value: 1, label: "V = 1" },
          ]}
        />
        <button type="button" className="preset-btn" onClick={newSequence}>{t("gfMsGmNewSequence")}</button>
      </div>
      <div className="gf-sliders">
        <SliderField label={t("gfMsGmFieldInformed")} min={0} max={0.6} step={0.01} value={pi} onChange={setPi} formatValue={(v) => pct(v, 0)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfMsGmAria", { n: g.trades.length })}>
        <LineChart
          data={g.rows}
          xKey="x"
          series={[
            { key: "ask", label: t("gfMsGmAsk"), color: "var(--negative)", strokeWidth: 2.2 },
            { key: "bid", label: t("gfMsGmBid"), color: "var(--positive)", strokeWidth: 2.2 },
            { key: "mu", label: t("gfMsGmBelief"), color: "var(--primary)", strokeWidth: 1.6, dash: "5 4" },
          ]}
          yDomain={[0, 1]}
          referenceLines={[{ axis: "y", value: trueV, color: "var(--muted)", dash: "2 4" }]}
          curve="linear"
          tooltipLabel={(x) => t("gfMsGmAfterTrades", { n: x.toFixed(0) })}
          valueFormat={(v) => v.toFixed(3)}
        />
      </div>
      <GmLearningTiles trades={g.trades} onFlip={toggle} />
      <FigureReadout
        items={[
          { label: t("gfMsGmBeliefNow"), value: fmt(g.belief, 3), tone: "strong" },
          { label: t("gfMsGmSpreadNow"), value: fmt(g.spread, 3), tone: "accent" },
          { label: t("gfMsGmConfidence"), value: g.confident === null ? t("gfMsGmNotReached") : String(g.confident) },
        ]}
      />
    </GuideFigure>
  );
}
