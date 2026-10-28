import { useMemo, useState } from "react";
import SliderField from "../../../components/SliderField";
import { LineChart, SERIES_PALETTE } from "../../../components/charts";
import { ChartContainer, Panel } from "../../../components/layout";
import { ControlGroup, SegmentedControl, StatCard } from "../../../components/ui";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import GuidedExperiments from "../../../components/GuidedExperiments";
import IncrementDependenceCharts from "./IncrementDependenceCharts";
import SeedControl from "../../../components/SeedControl";
import { autocorrelation, cumulativePath, incrementSequence, lagPairs } from "./wienerProperties.math";
import type { IncrementSource } from "./wienerProperties.types";

const SAMPLES = 4000;
const PATH_STEPS = 400;
const MAX_LAG = 12;

/// (ii) Independent increments: lag scatter and autocorrelation of Brownian increments,
/// against a moving-average noise with identical N(0,1) marginals but correlated neighbours.
export default function WienerIndependenceExperiment() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [source, setSource] = useState<IncrementSource>("brownian");
  const [lag, setLag] = useState(1);
  const [seed, setSeed] = useState(7);

  const increments = useMemo(() => incrementSequence(seed, SAMPLES, source), [seed, source]);
  const path = useMemo(() => cumulativePath(increments, PATH_STEPS).map((p) => ({ t: p.x, w: p.y })), [increments]);
  const acf = useMemo(() => autocorrelation(increments, MAX_LAG), [increments]);
  const pairs = useMemo(() => lagPairs(increments, lag), [increments, lag]);
  const theory = source === "movingAverage" && lag === 1 ? 0.5 : 0;

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <Panel title={t("stochControlsLabel")}>
          <ControlGroup label={t("wpIndSource")}>
            <SegmentedControl<IncrementSource>
              options={[
                { value: "brownian", label: t("wpIndBrownian") },
                { value: "movingAverage", label: t("wpIndMovingAverage") },
              ]}
              value={source}
              onChange={setSource}
              ariaLabel={t("wpIndSource")}
            />
          </ControlGroup>
          <SliderField label={t("wpIndLag")} min={1} max={MAX_LAG} step={1} value={lag} onChange={setLag} />
          <SeedControl seed={seed} setSeed={setSeed} />
        </Panel>
        <Panel title={t("wpMetrics")}>
          <div className="stoch-metric-grid">
            <StatCard label={t("wpIndEmpirical")} value={acf[lag - 1].y.toFixed(3)} />
            <StatCard label={t("wpIndTheory")} value={theory.toFixed(3)} />
          </div>
          <IntuitionTrigger sectionId="wiener-independence" variant="button" />
        </Panel>
        <GuidedExperiments keys={["wpIndTry1", "wpIndTry2"]} />
      </aside>
      <div className="stoch-stage">
        <ChartContainer className="stoch-path-frame" title={t("wpIndPathChart")}>
          <div className="stoch-density-chart">
            <LineChart
              data={path}
              xKey="t"
              series={[{ key: "w", label: t("stochPathLabel"), color: SERIES_PALETTE[source === "brownian" ? 0 : 1], strokeWidth: 1.4 }]}
              xDomain={[0, 1]}
              curve="linear"
              legend={false}
              isMobile={isMobile}
              tooltipLabel={(x) => `t = ${x.toFixed(3)}`}
              valueFormat={(v) => v.toFixed(3)}
            />
          </div>
          <p className="stoch-chart-caption">{t("wpIndPathCaption")}</p>
        </ChartContainer>
        <IncrementDependenceCharts pairs={pairs} acf={acf} lag={lag} sampleSize={SAMPLES} />
      </div>
    </div>
  );
}
