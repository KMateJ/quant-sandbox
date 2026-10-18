import { useMemo, useState } from "react";
import { LineChart } from "../../../../components/charts";
import { SegmentedControl } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { randomWalkRows, walkEndpointVariance } from "../../guide.processes.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt } from "./figureFormat";
import { bandSeries, pathSeries } from "./figureSeries";

const STEP_OPTIONS = [10, 100, 1000] as const;
const PATHS = 6;
const SAMPLE = 2000;

/// ±√(1/n) coin-flip walks on [0, 1]: refining the steps leaves the spread (variance t) unchanged.
export default function RandomWalkFigure() {
  const { t } = useI18n();
  const [n, setN] = useState<number>(100);
  const [seed, setSeed] = useState(1);
  const data = useMemo(() => randomWalkRows(n, PATHS, seed), [n, seed]);
  const variance = useMemo(() => walkEndpointVariance(n, SAMPLE, seed + 7), [n, seed]);

  return (
    <GuideFigure title={t("gfRandomWalkTitle")} labId="brownian-motion">
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
      <div className="gf-chart" role="img" aria-label={t("gfRandomWalkAria", { n })}>
        <LineChart
          data={data}
          xKey="t"
          series={[
            ...pathSeries(PATHS),
            bandSeries("env1", "±√t", "5 3"),
            bandSeries("env1n", "", "5 3"),
            bandSeries("env2", "±2√t", "2 4"),
            bandSeries("env2n", "", "2 4"),
          ]}
          yDomain={[-3, 3]}
          curve="linear"
          tooltipLabel={(x) => `t = ${x.toFixed(2)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfStepSize"), value: fmt(Math.sqrt(1 / n), 3) },
          { label: t("gfEndpointVariance", { count: SAMPLE }), value: fmt(variance, 3), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
