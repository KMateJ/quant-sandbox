import { useMemo, useState } from "react";
import {
  discreteMonitoringApprox,
  extremaUpTo,
  firstPassageTimes,
  hitFraction,
  maxTailProbability,
  nextMissedCrossing,
  subsampleCloud,
  tailFraction,
  withDrift,
} from "./pathGeometry.math";
import { PG_MONITORING_STEPS } from "./pathGeometry.types";
import { pathPoints } from "./brownianFundamentals.math";
import { usePathGeometry } from "./usePathGeometry";

const FINE_STEPS = PG_MONITORING_STEPS[PG_MONITORING_STEPS.length - 1];
const TIMES = Array.from({ length: 50 }, (_, i) => (i + 1) / 50);
const LEVELS = Array.from({ length: 30 }, (_, i) => (i + 1) / 10);

/// State and derived statistics for lesson 3.4: one fine Brownian sample with drift,
/// monitored on a coarser sub-grid, against continuous and BGK-corrected theory.
export function useHittingExperiment() {
  const sim = usePathGeometry(1000, FINE_STEPS);
  const [barrier, setBarrier] = useState(1);
  const [drift, setDrift] = useState(0);
  const [monitoring, setMonitoring] = useState<number>(PG_MONITORING_STEPS[1]);
  const [pathCursor, setPathCursor] = useState(0);
  const dt = 1 / monitoring;

  const fine = useMemo(() => withDrift(sim.cloud, drift), [sim.cloud, drift]);
  const coarse = useMemo(() => subsampleCloud(fine, FINE_STEPS / monitoring), [fine, monitoring]);
  const fineMax = useMemo(() => extremaUpTo(fine, fine.steps).max, [fine]);
  const coarseMax = useMemo(() => extremaUpTo(coarse, coarse.steps).max, [coarse]);
  const times = useMemo(() => firstPassageTimes(coarse, barrier), [coarse, barrier]);

  const path = nextMissedCrossing(fineMax, coarseMax, barrier, pathCursor - 1) ?? pathCursor % fine.pathCount;
  const finePath = useMemo(() => pathPoints(fine, path), [fine, path]);
  const coarsePath = useMemo(() => pathPoints(coarse, path), [coarse, path]);

  const timeRows = useMemo(
    () =>
      TIMES.map((t) => ({
        x: t,
        empirical: hitFraction(times, t),
        continuous: maxTailProbability(barrier, t, drift),
        bgk: discreteMonitoringApprox(barrier, t, drift, dt),
      })),
    [times, barrier, drift, dt]
  );
  const levelRows = useMemo(
    () =>
      LEVELS.map((a) => ({
        x: a,
        empirical: tailFraction(coarseMax, a),
        continuous: maxTailProbability(a, 1, drift),
        bgk: discreteMonitoringApprox(a, 1, drift, dt),
      })),
    [coarseMax, drift, dt]
  );

  return {
    sim,
    barrier,
    setBarrier,
    drift,
    setDrift,
    monitoring,
    setMonitoring,
    nextPath: () => setPathCursor(path + 1),
    coarse,
    finePath,
    coarsePath,
    isMissed: fineMax[path] >= barrier && coarseMax[path] < barrier,
    timeRows,
    levelRows,
    stats: {
      discrete: tailFraction(coarseMax, barrier),
      fine: tailFraction(fineMax, barrier),
      continuous: maxTailProbability(barrier, 1, drift),
      bgk: discreteMonitoringApprox(barrier, 1, drift, dt),
    },
  };
}

export type HittingExperiment = ReturnType<typeof useHittingExperiment>;
