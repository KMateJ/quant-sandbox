import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import { SegmentedControl } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { quadraticVariationRows, variationStats } from "../../guide.simulation.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt } from "./figureFormat";
import { pathSeries } from "./figureSeries";

const STEP_OPTIONS = [10, 100, 1000] as const;
const PATHS = 4;
const SAMPLE = 2000;

/// Running Σ(ΔW)² hugs the line t as the steps get finer, while Σ|ΔW| grows without bound.
export default function QuadraticVariationFigure() {
  const { t } = useI18n();
  const [n, setN] = useState<number>(100);
  const [seed, setSeed] = useState(1);
  const data = useMemo(() => quadraticVariationRows(n, PATHS, seed), [n, seed]);
  const stats = useMemo(() => variationStats(n, SAMPLE, seed + 11), [n, seed]);

  return (
    <GuideFigure title={t("gfQvTitle")} labId="ito-process">
      <div className="gf-toolbar">
        <SegmentedControl<number>
          ariaLabel={t("gfFieldSteps")}
          value={n}
          onChange={setN}
          options={STEP_OPTIONS.map((v) => ({ value: v, label: `n = ${v}` }))}
        />
        <button type="button" className="preset-btn" onClick={() => setSeed((s) => s + 1)}>
          {t("gfNewPaths")}
        </button>
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfQvAria", { n })}>
        <LineChart
          data={data}
          xKey="t"
          series={[...pathSeries(PATHS), { key: "line", label: "t", color: SERIES_PALETTE[2], strokeWidth: 2, dash: "6 3" }]}
          yDomain={[0, 1.6]}
          curve="linear"
          tooltipLabel={(x) => `t = ${x.toFixed(2)}`}
          valueFormat={(v) => v.toFixed(3)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfQvMean", { count: SAMPLE }), value: fmt(stats.mean, 3), tone: "accent" },
          { label: t("gfQvSd"), value: `${fmt(stats.sd, 3)} (√(2/n) = ${fmt(Math.sqrt(2 / n), 3)})` },
          { label: t("gfTotalVariation"), value: `${fmt(stats.totalVariation, 2)} (√(2n/π) = ${fmt(Math.sqrt((2 * n) / Math.PI), 2)})` },
        ]}
      />
    </GuideFigure>
  );
}
