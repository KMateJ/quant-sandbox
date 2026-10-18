import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../../components/charts";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { itoSums } from "../../../guide.stochastic.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";

const NS = [10, 100, 1000, 10000] as const;

/// Riemann sums of ∫W dW on one path: left points tend to (W² − t)/2 (Itô), midpoints to W²/2 (Stratonovich).
export default function ItoSumsFigure() {
  const { t } = useI18n();
  const [n, setN] = useState<number>(1000);
  const [seed, setSeed] = useState(1);
  const r = useMemo(() => itoSums(n, seed), [n, seed]);

  return (
    <GuideFigure title={t("gsItoTitle")} labId="ito-process">
      <div className="gf-toolbar">
        <SegmentedControl<number> ariaLabel={t("gfFieldSteps")} value={n} onChange={setN} options={NS.map((v) => ({ value: v, label: `n = ${v}` }))} />
        <button type="button" className="preset-btn" onClick={() => setSeed((v) => v + 1)}>{t("gsNewPath")}</button>
      </div>
      <div className="gf-chart" role="img" aria-label={t("gsItoAria", { n })}>
        <LineChart
          data={r.rows}
          xKey="t"
          series={[
            { key: "ito", label: "(W² − t)/2", color: SERIES_PALETTE[0], strokeWidth: 3 },
            { key: "left", label: t("gsLeftSum"), color: SERIES_PALETTE[2], strokeWidth: 1.5, dash: "4 3" },
            { key: "strat", label: "W²/2", color: SERIES_PALETTE[1], strokeWidth: 3 },
            { key: "mid", label: t("gsMidSum"), color: SERIES_PALETTE[3], strokeWidth: 1.5, dash: "4 3" },
          ]}
          curve="linear"
          tooltipLabel={(x) => `t = ${x.toFixed(3)}`}
          valueFormat={(v) => v.toFixed(3)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gsLeftAt1"), value: `${fmt(r.left, 3)} · ${fmt(r.ito, 3)}` },
          { label: t("gsMidAt1"), value: `${fmt(r.mid, 3)} · ${fmt(r.strat, 3)}` },
          { label: t("gsSumGap"), value: fmt(r.mid - r.left, 3), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
