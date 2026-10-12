import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { PathCloudChart, SERIES_ROLE } from "../../components/charts";
import type { PathOverlay } from "../../components/charts";
import { ChartContainer, Panel } from "../../components/layout";
import { ControlGroup, SegmentedControl, StatCard } from "../../components/ui";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import GuidedExperiments from "./GuidedExperiments";
import SeedControl from "./SeedControl";
import { levyCloud } from "./wienerProperties.math";

const PATHS = 120;
const POINTS = 300;
const MAX_ZOOM = 14;

/// (i) W₀ = 0: zoom into [0, ε]. On a fixed axis the cloud funnels into 0; on a √ε-scaled
/// axis it looks identical at every zoom.
export default function WienerStartExperiment() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [zoom, setZoom] = useState(0);
  const [scaled, setScaled] = useState(false);
  const [seed, setSeed] = useState(7);
  const eps = 2 ** -zoom;
  const sd = Math.sqrt(eps);

  const cloud = useMemo(() => levyCloud(seed, PATHS, 0, eps, POINTS), [seed, eps]);
  const overlays = useMemo<PathOverlay[]>(() => {
    const upper = Array.from({ length: 101 }, (_, i) => ({ x: (eps * i) / 100, y: Math.sqrt((eps * i) / 100) }));
    return [
      { key: "up", points: upper, color: SERIES_ROLE.reference, strokeWidth: 2 },
      { key: "down", points: upper.map((p) => ({ x: p.x, y: -p.y })), color: SERIES_ROLE.reference, strokeWidth: 2 },
    ];
  }, [eps]);
  const range = scaled ? 3 * sd : 3;

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <Panel title={t("stochControlsLabel")}>
          <SliderField
            label={t("wpZoom")}
            min={0}
            max={MAX_ZOOM}
            step={1}
            value={zoom}
            onChange={setZoom}
            formatValue={(z) => `×${(2 ** z).toLocaleString()}`}
          />
          <ControlGroup label={t("wpAxisMode")}>
            <SegmentedControl
              options={[
                { value: "fixed", label: t("wpAxisFixed") },
                { value: "scaled", label: t("wpAxisScaled") },
              ]}
              value={scaled ? "scaled" : "fixed"}
              onChange={(value) => setScaled(value === "scaled")}
              ariaLabel={t("wpAxisMode")}
            />
          </ControlGroup>
          <SeedControl seed={seed} setSeed={setSeed} />
        </Panel>
        <Panel title={t("wpMetrics")}>
          <div className="stoch-metric-grid">
            <StatCard label={t("wpStartMetricWindow")} value={eps.toPrecision(3)} />
            <StatCard label={t("wpStartMetricSd")} value={sd.toPrecision(3)} />
          </div>
        </Panel>
        <GuidedExperiments keys={["wpStartTry1", "wpStartTry2"]} />
      </aside>
      <div className="stoch-stage">
        <ChartContainer
          className="stoch-path-frame"
          title={t("wpStartChart")}
          actions={<span className="stoch-chart-readout">{t("wpStartReadout", { eps: eps.toPrecision(3), sd: sd.toPrecision(3) })}</span>}
        >
          <div className="stoch-path-chart stoch-hero-chart">
            <PathCloudChart
              values={cloud.values}
              pathCount={cloud.pathCount}
              stepCount={cloud.stepCount}
              dx={cloud.dx}
              xDomain={[0, eps]}
              yDomain={[-range, range]}
              maxOpacity={0.3}
              overlays={overlays}
              isMobile={isMobile}
              ariaLabel={t("wpStartChart")}
            />
          </div>
          <p className="stoch-chart-caption">{t("wpStartCaption")}</p>
        </ChartContainer>
      </div>
    </div>
  );
}
