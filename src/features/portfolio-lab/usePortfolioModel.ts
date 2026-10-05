import { useEffect, useMemo, useState } from "react";
import {
  capitalMarketLine,
  diversificationBenefit,
  frontierCurve,
  gmvWeights,
  maxSharpeWeights,
  normalize,
  portfolioMetrics,
  portfolioPoint,
  randomPortfolios,
  riskContributions,
  withCash,
} from "./portfolioLab.math";
import { usePortfolioUniverse } from "./PortfolioUniverseContext";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/// State, handlers and derived risk/return model powering the Portfolio Lab view.
/// Asset assumptions come from the shared portfolio universe; weights/cash/cloud are local.
export function usePortfolioModel() {
  const universe = usePortfolioUniverse();
  const { assets, mus, sigmas, cov, corr, corrValid, riskFree } = universe;

  const [rawWeights, setRawWeights] = useState<number[]>(assets.map(() => 1 / assets.length));
  const [cashWeight, setCashWeight] = useState(0);
  const [cloudCount, setCloudCount] = useState(320);
  const [cloudSeed, setCloudSeed] = useState(1);
  const [showCloud, setShowCloud] = useState(true);

  // Keep the local weight vector aligned with the shared asset list.
  useEffect(() => {
    setRawWeights((prev) => {
      if (prev.length === assets.length) return prev;
      if (prev.length < assets.length) {
        return [...prev, ...assets.slice(prev.length).map(() => 1 / assets.length)];
      }
      return prev.slice(0, assets.length);
    });
  }, [assets.length]);

  const weights = useMemo(() => normalize(rawWeights), [rawWeights]);
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

  const setWeight = (i: number, v: number) =>
    setRawWeights((prev) => prev.map((w, j) => (j === i ? v : w)));
  const applyPreset = (target: number[]) => setRawWeights(target.map(clamp01));
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

  const addAsset = () => {
    universe.addAsset();
    setRawWeights((prev) => [...prev, 1 / (prev.length + 1)]);
  };

  const removeAsset = (i: number) => {
    if (!universe.canRemove) return;
    universe.removeAsset(i);
    setRawWeights((prev) => prev.filter((_, j) => j !== i));
  };

  return {
    assets,
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
    resetCorr: universe.resetCorr,
    applyCorrPreset: universe.applyCorrPreset,
    repairCorr: universe.repairCorr,
    setRiskFree: universe.setRiskFree,
    setCashWeight,
    setWeight,
    applyPreset,
    applyEqual,
    applyMinVar,
    applyMaxSharpe,
    setAssetParam: universe.setAssetParam,
    setAssetName: universe.setAssetName,
    addAsset,
    removeAsset,
    setCloudCount,
    setShowCloud,
    regenerateCloud: () => setCloudSeed((s) => s + 1),
  };
}
