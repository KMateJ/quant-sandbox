import { useMemo } from "react";
import { useUrlState } from "../../components/useUrlState";
import { useMediaQuery } from "../../components/useMediaQuery";
import { usePlayback } from "../../components/playback";
import { PageHeader, Workspace } from "../../components/layout";
import { useI18n } from "../../i18n";
import GaltonChart from "./lab/GaltonChart";
import WalkControls from "./lab/WalkControls";
import WalkMetrics from "./lab/WalkMetrics";
import WalkPaths from "./lab/WalkPaths";
import { RANDOM_WALK_URL_SCHEMA } from "./randomWalk.url";
import { SHOWN_PATHS, WALKER_COUNT, countMoments, shownPositions, simulateUps, siteCounts, walkRange, walkerUniforms } from "./randomWalk.math";

/// Root page of the Random Walk lab: walkers fall through n rows of a Galton board into a histogram that
/// follows the binomial law and, for large n, its normal approximation.
export default function RandomWalkView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [url, setUrl] = useUrlState(RANDOM_WALK_URL_SCHEMA);
  const { p, n, h, seed } = url;
  const playback = usePlayback({ steps: n, durationMs: 7000 });
  const step = playback.step;

  const uniforms = useMemo(() => walkerUniforms(seed, n, WALKER_COUNT), [seed, n]);
  const ups = useMemo(() => simulateUps(uniforms, n, WALKER_COUNT, p), [uniforms, n, p]);
  const range = useMemo(() => walkRange(n, p, h), [n, p, h]);
  const counts = useMemo(() => siteCounts(ups, WALKER_COUNT, step), [ups, step]);
  const positions = useMemo(() => shownPositions(ups, n, WALKER_COUNT, SHOWN_PATHS, h), [ups, n, h]);

  return (
    <>
      <PageHeader title={t("rwTitle")} description={t("rwDesc")} />
      <Workspace columns="sidebar">
        <div className="rw-side">
          <WalkControls p={p} setP={(v) => setUrl({ p: v })} n={n} setN={(v) => setUrl({ n: v })} h={h} setH={(v) => setUrl({ h: v })}
            seed={seed} setSeed={(v) => setUrl({ seed: v })} playback={playback} />
          <WalkMetrics step={step} p={p} h={h} sample={countMoments(counts, step, h)} />
        </div>
        <div className="rw-main">
          <GaltonChart counts={counts} walkers={WALKER_COUNT} step={step} p={p} h={h} range={range} isMobile={isMobile} />
          <WalkPaths positions={positions} n={n} step={step} p={p} h={h} range={range} isMobile={isMobile} />
        </div>
      </Workspace>
    </>
  );
}
