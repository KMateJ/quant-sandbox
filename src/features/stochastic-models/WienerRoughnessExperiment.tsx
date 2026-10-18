import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { IntervalSelector, PathCloudChart, SERIES_PALETTE, SERIES_ROLE } from "../../components/charts";
import type { PlotFrame } from "../../components/charts";
import { ChartContainer, Panel } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";
import GuidedExperiments from "../../components/GuidedExperiments";
import RoughnessZoomCharts from "./RoughnessZoomCharts";
import SeedControl from "../../components/SeedControl";
import { levyPath, sampleWindow } from "./wienerProperties.math";

const MAX_ZOOM = 30;
const OVERVIEW_POINTS = 800;

/// The zoom window [a, b] of width 2⁻ᶻ around c, shifted to stay inside [0, 1].
function zoomWindow(center: number, zoom: number): [number, number] {
  const width = 2 ** -zoom;
  const a = Math.min(Math.max(0, center - width / 2), 1 - width);
  return [a, a + width];
}

/// (iv) Continuity without differentiability: an exactly-refined Brownian path zoomed
/// up to 2³⁰× next to a smooth function, with the difference quotient on a log scale.
export default function WienerRoughnessExperiment() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [center, setCenter] = useState(0.37);
  const [zoom, setZoom] = useState(4);
  const [seed, setSeed] = useState(7);
  const [a, b] = zoomWindow(center, zoom);

  const path = useMemo(() => levyPath(seed * 7919), [seed]);
  const overview = useMemo(() => Float64Array.from(sampleWindow(path, 0, 1, OVERVIEW_POINTS), (p) => p.y), [path]);

  const onWindow = (from: number, to: number) => {
    const width = to - from;
    if (Math.abs(width - (b - a)) > 1e-3) setZoom(Math.min(MAX_ZOOM, Math.max(0, Math.round(-Math.log2(width)))));
    setCenter((from + to) / 2);
  };

  const layer = (frame: PlotFrame) => (
    <IntervalSelector
      frame={frame}
      from={a}
      to={b}
      onChange={onWindow}
      bounds={[0, 1]}
      minGap={0.001}
      snap={0.001}
      color={SERIES_ROLE.estimate}
      slidable
    />
  );

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
            formatValue={(z) => `2^−${z}`}
          />
          <SliderField
            label={t("wpRoughCenter")}
            min={0}
            max={1}
            step={0.001}
            value={center}
            onChange={setCenter}
            formatValue={(c) => c.toFixed(3)}
          />
          <SeedControl seed={seed} setSeed={setSeed} />
          <IntuitionTrigger sectionId="wiener-roughness" variant="button" />
        </Panel>
        <GuidedExperiments keys={["wpRoughTry1", "wpRoughTry2"]} />
      </aside>
      <div className="stoch-stage">
        <ChartContainer
          className="stoch-path-frame"
          title={t("wpRoughOverview")}
          actions={<span className="stoch-chart-readout">{t("wpRoughReadout", { z: zoom })}</span>}
        >
          <div className="stoch-density-chart">
            <PathCloudChart
              values={overview}
              pathCount={1}
              stepCount={overview.length}
              dx={1 / (overview.length - 1)}
              xDomain={[0, 1]}
              palette={[SERIES_PALETTE[0]]}
              layer={layer}
              isMobile={isMobile}
              ariaLabel={t("wpRoughOverview")}
            />
          </div>
        </ChartContainer>
        <RoughnessZoomCharts path={path} a={a} b={b} center={center} />
      </div>
    </div>
  );
}
