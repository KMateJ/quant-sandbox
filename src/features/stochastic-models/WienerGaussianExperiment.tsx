import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { ChartContainer, Panel } from "../../components/layout";
import { ControlGroup, SegmentedControl, StatCard } from "../../components/ui";
import { useMediaQuery } from "../../components/useMediaQuery";
import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";
import GuidedExperiments from "./GuidedExperiments";
import SeedControl from "./SeedControl";
import { simulateBrownian } from "./brownianFundamentals.math";
import { BM_GRID_STEPS } from "./brownianFundamentals.types";
import { terminalSummary } from "./rescaledWalk.math";
import { collapseRows, windowIncrements } from "./wienerProperties.math";
import { COLLAPSE_WINDOWS } from "./wienerProperties.types";

const PATHS = 1200;

/// (iii) Gaussian increments: increments over several Δt are bells of width √Δt; divided
/// by √Δt they collapse onto one N(0, 1).
export default function WienerGaussianExperiment() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [standardised, setStandardised] = useState(false);
  const [seed, setSeed] = useState(7);

  const samples = useMemo(() => {
    const cloud = simulateBrownian(seed, PATHS, BM_GRID_STEPS);
    return COLLAPSE_WINDOWS.map((delta) => windowIncrements(cloud, delta));
  }, [seed]);
  const rows = useMemo(() => collapseRows(samples, COLLAPSE_WINDOWS, standardised), [samples, standardised]);
  const sds = useMemo(() => samples.map((s) => Math.sqrt(terminalSummary(s).variance)), [samples]);

  const series: ChartSeries[] = COLLAPSE_WINDOWS.flatMap((delta, i) => {
    const color = SERIES_PALETTE[i];
    const label = t("wpGaussSeries", { d: delta });
    const empirical: ChartSeries = { key: `d${i}`, label, color, strokeWidth: 2 };
    const theory: ChartSeries = { key: `n${i}`, label: `N(0, ${delta})`, color, strokeWidth: 1.5, dash: "5 4", legend: false };
    return standardised && i > 0 ? [empirical] : [empirical, standardised ? { ...theory, label: "N(0, 1)", color: "var(--muted)" } : theory];
  });

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <Panel title={t("stochControlsLabel")}>
          <ControlGroup label={t("wpGaussMode")}>
            <SegmentedControl
              options={[
                { value: "raw", label: t("wpGaussRaw") },
                { value: "std", label: t("wpGaussStandardised") },
              ]}
              value={standardised ? "std" : "raw"}
              onChange={(value) => setStandardised(value === "std")}
              ariaLabel={t("wpGaussMode")}
            />
          </ControlGroup>
          <SeedControl seed={seed} setSeed={setSeed} />
        </Panel>
        <Panel title={t("wpMetrics")}>
          <div className="stoch-metric-grid">
            {COLLAPSE_WINDOWS.flatMap((delta, i) => [
              <StatCard key={`e${i}`} label={t("wpGaussSd", { d: delta })} value={sds[i].toFixed(3)} />,
              <StatCard key={`t${i}`} label={t("wpGaussTheory", { d: delta })} value={Math.sqrt(delta).toFixed(3)} />,
            ])}
          </div>
          <IntuitionTrigger sectionId="wiener-increments" variant="button" />
        </Panel>
        <GuidedExperiments keys={["wpGaussTry1", "wpGaussTry2"]} />
      </aside>
      <div className="stoch-stage">
        <ChartContainer className="stoch-distribution-frame" title={t("wpGaussChart")}>
          <div className="stoch-path-chart stoch-hero-chart">
            <LineChart
              data={rows}
              xKey="x"
              series={series}
              isMobile={isMobile}
              tooltipLabel={(x) => `x = ${x.toFixed(2)}`}
              valueFormat={(v) => v.toFixed(3)}
            />
          </div>
          <p className="stoch-chart-caption">{t(standardised ? "wpGaussCaptionStd" : "wpGaussCaptionRaw")}</p>
        </ChartContainer>
      </div>
    </div>
  );
}
