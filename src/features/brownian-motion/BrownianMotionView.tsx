import { useMemo, useState } from "react";
import { useUrlState } from "../../components/useUrlState";
import { BROWNIAN_URL_SCHEMA } from "./brownianMotion.url";
import SliderField from "../../components/SliderField";
import SeedControl from "../../components/SeedControl";
import { useMediaQuery } from "../../components/useMediaQuery";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { useI18n } from "../../i18n";
import { CLOUD_SIZES, simulateBrownianCloud, snapCloudSize } from "./brownianMotion.math";
import BarrierPanel from "./components/BarrierPanel";
import BrownianCloud from "./components/BrownianCloud";
import BrownianMetrics from "./components/BrownianMetrics";

const STEPS = 200;

export default function BrownianMotionView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [url, setUrl] = useUrlState(BROWNIAN_URL_SCHEMA);
  const { mu: drift, sigma: vol, T: horizon, seed, b: barrier } = url;
  const cloudSize = snapCloudSize(url.paths);
  const setDrift = (mu: number) => setUrl({ mu });
  // Cursor as a share of the horizon, so it survives changes of T.
  const [share, setShare] = useState(0.75);
  const cursor = share * horizon;

  const cloud = useMemo(() => simulateBrownianCloud(drift, vol, horizon, STEPS, cloudSize, seed), [drift, vol, horizon, cloudSize, seed]);
  const num = (v: number) => v.toFixed(3);

  return (
    <>
      <PageHeader title={t("brownianMotionTitle")} description={t("brownianMotionDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("brownianMotionControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("brownianMotionDriftLabel")} min={-0.5} max={0.5} step={0.01} value={drift} onChange={setDrift} formatValue={num} />
            <SliderField label={t("brownianMotionVolLabel")} min={0.05} max={1} step={0.05} value={vol} onChange={(sigma) => setUrl({ sigma })} formatValue={num} />
            <SliderField label={t("brownianMotionHorizonLabel")} min={0.25} max={5} step={0.25} value={horizon} onChange={(T) => setUrl({ T })} formatValue={(v) => v.toFixed(2)} />
            <SliderField label={t("brownianMotionPathsLabel")} min={0} max={CLOUD_SIZES.length - 1} step={1} value={CLOUD_SIZES.indexOf(cloudSize)}
              onChange={(i) => setUrl({ paths: CLOUD_SIZES[i] })} formatValue={(i) => String(CLOUD_SIZES[i])} />
            <SeedControl seed={seed} setSeed={(s) => setUrl({ seed: s })} compact />
          </div>
          <p className="lp-ensemble-hint">{t("brownianMotionDriftHint")}</p>
        </Panel>

        <div className="bm-main">
          <BrownianCloud values={cloud} pathCount={cloudSize} steps={STEPS} horizon={horizon} drift={drift} vol={vol}
            cursor={cursor} onCursor={(c) => setShare(c / horizon)} isMobile={isMobile} />
          <BrownianMetrics values={cloud} pathCount={cloudSize} steps={STEPS} horizon={horizon} drift={drift} vol={vol} cursor={cursor} />
        </div>
      </Workspace>

      <Workspace className="lp-section">
        <ChartContainer title={t("bmBarrierTitle")}>
          <BarrierPanel values={cloud} pathCount={cloudSize} steps={STEPS} horizon={horizon} drift={drift} vol={vol}
            barrier={barrier} onBarrier={(b) => setUrl({ b })} onZeroDrift={() => setDrift(0)} isMobile={isMobile} />
        </ChartContainer>
      </Workspace>
    </>
  );
}
