import { useMemo, useState } from "react";
import { DragHandles, PathCloudChart, ScatterChart, SERIES_PALETTE, SERIES_ROLE } from "../../../components/charts";
import type { PathOverlay } from "../../../components/charts";
import { ChartContainer, Panel } from "../../../components/layout";
import SeedControl from "../../../components/SeedControl";
import SliderField from "../../../components/SliderField";
import { StatCard } from "../../../components/ui";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import { bridgeEnvelope, bridgeValues, bridgeVariance, bridgeVarianceProfile } from "./bridge.math";
import { simulateBrownian } from "./brownianFundamentals.math";

const T = 1;
const PATHS = 300;
const STEPS = 200;
const Y = 3;
const B_MAX = 2.5;

/// Brownian bridges pinned at B(T) = b: the cloud, its mean line and ±1 sd band, and the parabola Var B(t) = t(T − t)/T.
export default function BridgeExplore() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [seed, setSeed] = useState(3);
  const [b, setB] = useState(1);
  const cloud = useMemo(() => simulateBrownian(seed, PATHS, STEPS), [seed]);
  const values = useMemo(() => bridgeValues(cloud, T, b), [cloud, b]);
  const profile = useMemo(() => bridgeVarianceProfile(values, cloud, T), [values, cloud]);
  const theory = useMemo(() => Array.from({ length: 41 }, (_, i) => ({ x: (i / 40) * T, y: bridgeVariance((i / 40) * T, T) })), []);

  const overlays = useMemo<PathOverlay[]>(() => {
    const env = bridgeEnvelope(STEPS, T, b);
    const hero = Array.from({ length: STEPS + 1 }, (_, k) => ({ x: (k / STEPS) * T, y: values[k * PATHS] }));
    return [
      { key: "up", points: env.upper, color: SERIES_ROLE.reference, strokeWidth: 1.75 },
      { key: "down", points: env.lower, color: SERIES_ROLE.reference, strokeWidth: 1.75 },
      { key: "mean", points: env.mean, color: "var(--text)", strokeWidth: 1.75, dash: "6 4" },
      { key: "hero", points: hero, color: "var(--primary)", strokeWidth: 2.25 },
    ];
  }, [b, values]);

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <Panel title={t("stochBrControls")}>
          <div className="controls-grid">
            <SliderField label={t("stochBrEndpoint")} min={-B_MAX} max={B_MAX} step={0.05} value={b} onChange={setB} formatValue={(v) => v.toFixed(2)} />
            <SeedControl seed={seed} setSeed={setSeed} compact />
          </div>
          <p className="stoch-chart-caption">{t("stochBrDragHint")}</p>
          <div className="stoch-metric-grid">
            <StatCard label={t("stochBrMidMean")} value={(b / 2).toFixed(3)} />
            <StatCard label={t("stochBrMidVar")} value={bridgeVariance(T / 2, T).toFixed(3)} />
          </div>
        </Panel>
      </aside>
      <div className="stoch-stage">
        <ChartContainer title={t("stochBrCloudTitle", { n: PATHS })}>
          <div className="stoch-path-chart">
            <PathCloudChart values={values} pathCount={PATHS} stepCount={STEPS + 1} dx={T / STEPS} xDomain={[0, T * 1.14]} yDomain={[-Y, Y]}
              maxOpacity={0.14} overlays={overlays} isMobile={isMobile} ariaLabel={t("stochBrCloudTitle", { n: PATHS })}
              layer={(frame) => (
                <DragHandles frame={frame} onChange={(_, v) => v.y !== undefined && setB(Number(v.y.toFixed(2)))}
                  handles={[{ id: "end", axis: "xy", x: T, y: b, bounds: { x: [T, T], y: [-B_MAX, B_MAX] }, step: 0.05, label: "B(T)", format: (v) => v.toFixed(2) }]} />
              )} />
          </div>
          <p className="stoch-chart-caption">{t("stochBrCloudCaption")}</p>
        </ChartContainer>
        <ChartContainer title={t("stochBrVarTitle")}>
          <div className="stoch-path-chart bl-short-chart">
            <ScatterChart isMobile={isMobile} xDomain={[0, T]} yDomain={[0, 0.3]} xLabel="t" yLabel="Var B(t)"
              series={[
                { key: "theory", label: "t(T − t)/T", color: SERIES_ROLE.reference, points: theory, line: true, strokeWidth: 2 },
                { key: "emp", label: t("stochBrEmpirical"), color: SERIES_PALETTE[0], points: profile, radius: 4 },
              ]} />
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}
