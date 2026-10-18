import { useMemo, useState } from "react";
import {
  capitalMarketLine,
  diversificationBenefit,
  frontierCurve,
  gmvWeights,
  isValidCorrelation,
  maxSharpeWeights,
  normalize,
  portfolioMetrics,
  portfolioPoint,
  randomPortfolios,
  riskContributions,
  setCorrEntry,
  withCash,
} from "./portfolioLab.math";
import {
  allocationFrom,
  decodeAllocation,
  equalAllocation,
  removeShare,
  resizeAllocation,
  setShareProportional,
} from "./portfolioLab.weights";
import { usePortfolioUniverse } from "./PortfolioUniverseContext";

/// State, handlers and derived risk/return model powering the Portfolio Lab view.
/// Asset assumptions come from the shared portfolio universe; the allocation (assets + cash, summing to 1)
/// starts from the URL form `urlWeights` and is local once edited.
export function usePortfolioModel(urlWeights: string) {
  const universe = usePortfolioUniverse();
  const { assets, mus, sigmas, cov, corr, corrValid, riskFree } = universe;
  const n = assets.length;

  const [edited, setEdited] = useState<number[] | null>(null);
  const [cloudCount, setCloudCount] = useState(800);
  const [cloudSeed, setCloudSeed] = useState(1);
  const [showCloud, setShowCloud] = useState(true);

  // Always sized to the shared asset list (assets may be added or removed in another lab).
  const allocation = useMemo(
    () => resizeAllocation(edited ?? decodeAllocation(urlWeights, n) ?? equalAllocation(n), n),
    [edited, urlWeights, n]
  );
  const rawWeights = allocation.slice(0, n);
  const cashWeight = allocation[n];
  const update = (f: (a: number[]) => number[]) => setEdited(f(allocation));

  const weights = useMemo(() => normalize(allocation.slice(0, n)), [allocation, n]);
  const riskyCurrent = portfolioMetrics(weights, mus, cov, riskFree);
  const combined = withCash(riskyCurrent, cashWeight, riskFree);
  const current = { ...combined, sharpe: riskyCurrent.sharpe };
  const finalWeights = weights.map((w) => w * (1 - cashWeight));
  const contributions = riskContributions(weights, cov);
  const diversification = diversificationBenefit(weights, sigmas, riskyCurrent.vol);

  const frontier = useMemo(() => {
    try {
      return frontierCurve(mus, cov, 90);
    } catch {
      return [];
    }
  }, [mus, cov]);
  const cloud = useMemo(
    () => (showCloud ? randomPortfolios(mus, cov, cloudCount, cloudSeed) : []),
    [mus, cov, cloudCount, cloudSeed, showCloud]
  );
  const gmv = useMemo(() => {
    try {
      return portfolioPoint(gmvWeights(cov), mus, cov);
    } catch {
      return { vol: 0, ret: 0 };
    }
  }, [cov, mus]);
  const tangency = useMemo(() => {
    try {
      return portfolioPoint(maxSharpeWeights(mus, cov, riskFree), mus, cov);
    } catch {
      return { vol: 0, ret: 0 };
    }
  }, [mus, cov, riskFree]);

  const volMax = Math.max(...sigmas, tangency.vol, ...cloud.map((p) => p.vol)) * 1.08;
  const retMin = Math.min(0, riskFree, ...mus) * 0.5;
  const retMax = Math.max(...mus) * 1.1;
  const cml = useMemo(() => capitalMarketLine(tangency, riskFree, volMax), [tangency, riskFree, volMax]);

  /// Share `k` (cash is k = n) set to `v`, the others rescaled proportionally.
  const setShare = (k: number, v: number) => update((a) => setShareProportional(a, k, v));
  const applyPreset = (target: number[]) => update((a) => allocationFrom(target, a[n]));
  /// Take a fully invested mix as-is (e.g. a clicked random portfolio), so the portfolio lands on its point.
  const adoptWeights = (target: number[]) => update(() => allocationFrom(target, 0));
  const applyEqual = () => applyPreset(assets.map(() => 1 / assets.length));
  const applyMinVar = () => {
    try {
      applyPreset(gmvWeights(cov));
    } catch {
      /* invalid matrix — keep current weights */
    }
  };
  const applyMaxSharpe = () => {
    try {
      applyPreset(maxSharpeWeights(mus, cov, riskFree));
    } catch {
      /* invalid matrix — keep current weights */
    }
  };

  const removeAsset = (i: number) => {
    if (!universe.canRemove) return;
    universe.removeAsset(i);
    update((a) => removeShare(a, i));
  };

  // The scrubber already clamps to the PSD range; should an edit still leave the matrix invalid, repair it.
  const scrubCorrelation = (i: number, j: number, v: number) => {
    universe.setCorrelation(i, j, v);
    if (!isValidCorrelation(setCorrEntry(corr, i, j, v))) universe.repairCorr();
  };

  return {
    assets,
    allocation,
    rawWeights,
    weights,
    finalWeights,
    cashWeight,
    corr,
    corrValid,
    riskFree,
    mus,
    cov,
    current,
    contributions,
    diversification,
    frontier,
    cloud,
    cml,
    gmv,
    tangency,
    volMax,
    retMin,
    retMax,
    canRemove: universe.canRemove,
    cloudCount,
    showCloud,
    setCorrelation: universe.setCorrelation,
    scrubCorrelation,
    resetCorr: universe.resetCorr,
    applyCorrPreset: universe.applyCorrPreset,
    repairCorr: universe.repairCorr,
    setRiskFree: universe.setRiskFree,
    setShare,
    applyPreset,
    adoptWeights,
    applyEqual,
    applyMinVar,
    applyMaxSharpe,
    setAssetParam: universe.setAssetParam,
    setAssetName: universe.setAssetName,
    addAsset: universe.addAsset,
    removeAsset,
    setCloudCount,
    setShowCloud,
    regenerateCloud: () => setCloudSeed((s) => s + 1),
  };
}
