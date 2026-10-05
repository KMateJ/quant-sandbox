import { useEffect, useMemo, useState } from "react";
import { usePortfolioUniverse } from "../portfolio-lab/PortfolioUniverseContext";
import {
  frontierVolatility,
  globalMinVariance,
  gmvWeights,
  tangencyWeights,
} from "./efficientFrontier.math";
import {
  boundsFromConstraints,
  constrainedFrontier,
  efficientBranch,
  feasibleCloud,
  gmvConstrained,
  maxSharpeConstrained,
  pointAtReturn,
  pointAtVol,
  summarize,
} from "./portfolioOptimization.math";
import type { OptConstraints, OptObjective, OptPoint } from "./portfolioOptimization.types";

const DEFAULT_CONSTRAINTS: OptConstraints = {
  longOnly: true,
  allowShort: false,
  minWeight: 0,
  maxWeight: 1,
  useRiskFree: false,
  riskFree: 0.03,
  allowLeverage: false,
  maxGross: 1,
};

export type ConstraintCost = {
  metric: "vol" | "sharpe" | "ret";
  unconstrained: number;
  constrained: number;
  delta: number;
};

/// Full optimization model: objective, constraints, frontiers, reference portfolios,
/// the selected solution and the cost of the active constraints.
export function useOptimization() {
  const { assets, mus, cov, sigmas, riskFree: universeRf } = usePortfolioUniverse();

  const [objective, setObjective] = useState<OptObjective>("minVariance");
  const [constraints, setConstraints] = useState<OptConstraints>({
    ...DEFAULT_CONSTRAINTS,
    riskFree: universeRf,
  });
  const [targetReturn, setTargetReturn] = useState(0.1);
  const [targetVol, setTargetVol] = useState(0.15);
  const [selReturn, setSelReturn] = useState<number | null>(null);

  const rf = constraints.useRiskFree ? constraints.riskFree : universeRf;
  const bounds = useMemo(() => boundsFromConstraints(constraints, mus.length), [constraints, mus.length]);
  const openBounds = useMemo(
    () => ({ lo: mus.map(() => -2), hi: mus.map(() => 2) }),
    [mus]
  );

  const frontier = useMemo(() => constrainedFrontier(mus, cov, bounds, rf), [mus, cov, bounds, rf]);
  const branch = useMemo(() => efficientBranch(frontier), [frontier]);
  const unconstrained = useMemo(() => constrainedFrontier(mus, cov, openBounds, rf), [mus, cov, openBounds, rf]);
  const unconBranch = useMemo(() => efficientBranch(unconstrained), [unconstrained]);

  const gmv = useMemo(() => gmvConstrained(frontier), [frontier]);
  const tangency = useMemo(() => maxSharpeConstrained(frontier), [frontier]);
  const gmvU = useMemo(() => summarize(gmvWeights(mus, cov), mus, cov, rf), [cov, mus, rf]);
  const tangencyU = useMemo(
    () => summarize(tangencyWeights(mus, cov, rf), mus, cov, rf),
    [mus, cov, rf]
  );

  const cloud = useMemo(() => feasibleCloud(mus, cov, bounds, 260), [mus, cov, bounds]);

  const objectivePoint = useMemo<OptPoint>(() => {
    if (objective === "maxSharpe") return tangency;
    if (objective === "targetReturn") return pointAtReturn(frontier, targetReturn);
    if (objective === "targetVolatility") return pointAtVol(frontier, targetVol);
    return gmv;
  }, [objective, frontier, gmv, tangency, targetReturn, targetVol]);

  // Reset manual selection whenever the problem definition changes.
  const problemKey = `${objective}|${targetReturn}|${targetVol}|${JSON.stringify(constraints)}|${mus.join(",")}`;
  useEffect(() => setSelReturn(null), [problemKey]);

  const selected = useMemo<OptPoint>(
    () => (selReturn == null ? objectivePoint : pointAtReturn(frontier, selReturn)),
    [selReturn, objectivePoint, frontier]
  );

  const cost = useMemo<ConstraintCost>(() => {
    if (objective === "maxSharpe") {
      return { metric: "sharpe", unconstrained: tangencyU.sharpe, constrained: tangency.sharpe, delta: tangency.sharpe - tangencyU.sharpe };
    }
    if (objective === "targetReturn") {
      const u = frontierVolatility(targetReturn, mus, cov);
      const cVol = pointAtReturn(frontier, targetReturn).vol;
      return { metric: "vol", unconstrained: u, constrained: cVol, delta: cVol - u };
    }
    if (objective === "targetVolatility") {
      const u = nearestByVol(unconBranch, targetVol).ret;
      const cRet = pointAtVol(frontier, targetVol).ret;
      return { metric: "ret", unconstrained: u, constrained: cRet, delta: cRet - u };
    }
    const gmvVolU = globalMinVariance(mus, cov).vol;
    return { metric: "vol", unconstrained: gmvVolU, constrained: gmv.vol, delta: gmv.vol - gmvVolU };
  }, [objective, targetReturn, targetVol, frontier, unconBranch, gmv, tangency, tangencyU, mus, cov]);

  const volMax = Math.max(...sigmas, tangency.vol, ...frontier.map((p) => p.vol), ...cloud.map((p) => p.vol)) * 1.12;
  const retMin = Math.min(...mus, constraints.useRiskFree ? rf : Infinity) - 0.02;
  const retMax = Math.max(...mus, ...frontier.map((p) => p.ret)) + 0.03;

  const cml = useMemo(() => {
    if (!constraints.useRiskFree || tangency.vol <= 0) return [];
    const reach = constraints.allowLeverage ? volMax : tangency.vol;
    return [
      { vol: 0, ret: rf },
      { vol: reach, ret: rf + tangency.sharpe * reach },
    ];
  }, [constraints.useRiskFree, constraints.allowLeverage, tangency, rf, volMax]);

  const updateConstraint = <K extends keyof OptConstraints>(key: K, value: OptConstraints[K]) =>
    setConstraints((prev) => reconcile({ ...prev, [key]: value }, key));

  return {
    assets,
    mus,
    sigmas,
    objective,
    setObjective,
    constraints,
    updateConstraint,
    targetReturn,
    setTargetReturn,
    targetVol,
    setTargetVol,
    rf,
    frontier,
    branch,
    unconBranch,
    cloud,
    gmv,
    tangency,
    gmvU,
    tangencyU,
    selected,
    selectReturn: setSelReturn,
    objectivePoint,
    cost,
    cml,
    volMax,
    retMin,
    retMax,
  };
}

function nearestByVol(pts: OptPoint[], vol: number): OptPoint {
  return pts.reduce((best, p) => (Math.abs(p.vol - vol) < Math.abs(best.vol - vol) ? p : best), pts[0]);
}

// Keep mutually-exclusive toggles coherent (long-only vs shorting, leverage vs gross).
function reconcile(c: OptConstraints, changed: keyof OptConstraints): OptConstraints {
  const next = { ...c };
  if (changed === "longOnly" && next.longOnly) next.allowShort = false;
  if (changed === "allowShort" && next.allowShort) {
    next.longOnly = false;
    if (next.minWeight >= 0) next.minWeight = -0.3;
  }
  if (changed === "allowShort" && !next.allowShort) {
    next.longOnly = true;
    next.minWeight = Math.max(0, next.minWeight);
  }
  if (!next.allowLeverage) next.maxGross = 1;
  return next;
}
