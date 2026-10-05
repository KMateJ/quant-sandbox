import { useMemo, useState } from "react";
import {
  ASSET_PALETTE,
  DEFAULT_ASSETS,
  buildCov,
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
import type { Asset } from "./portfolioLab.types";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/// State, handlers and derived risk/return model powering the Portfolio Lab view.
export function usePortfolioModel() {
  const [assets, setAssets] = useState<Asset[]>(DEFAULT_ASSETS);
  const [rawWeights, setRawWeights] = useState<number[]>(DEFAULT_ASSETS.map(() => 1 / DEFAULT_ASSETS.length));
  const [rho, setRho] = useState(0.3);
  const [riskFree, setRiskFree] = useState(0.03);
  const [cashWeight, setCashWeight] = useState(0);
  const [cloudCount, setCloudCount] = useState(320);
  const [cloudSeed, setCloudSeed] = useState(1);
  const [showCloud, setShowCloud] = useState(true);

  const mus = useMemo(() => assets.map((a) => a.mu), [assets]);
  const sigmas = useMemo(() => assets.map((a) => a.sigma), [assets]);
  const cov = useMemo(() => buildCov(sigmas, rho), [sigmas, rho]);

  const weights = useMemo(() => normalize(rawWeights), [rawWeights]);
  const riskyCurrent = portfolioMetrics(weights, mus, cov, riskFree);
  const combined = withCash(riskyCurrent, cashWeight, riskFree);
  const current = { ...combined, sharpe: riskyCurrent.sharpe };
  const finalWeights = weights.map((w) => w * (1 - cashWeight));
  const contributions = riskContributions(weights, cov);
  const diversification = diversificationBenefit(weights, sigmas, riskyCurrent.vol);

  const frontier = useMemo(() => frontierCurve(mus, cov, 90), [mus, cov]);
  const cloud = useMemo(
    () => (showCloud ? randomPortfolios(mus, cov, cloudCount, cloudSeed) : []),
    [mus, cov, cloudCount, cloudSeed, showCloud]
  );
  const gmv = useMemo(() => portfolioPoint(gmvWeights(cov), mus, cov), [cov, mus]);
  const tangency = useMemo(
    () => portfolioPoint(maxSharpeWeights(mus, cov, riskFree), mus, cov),
    [mus, cov, riskFree]
  );

  const volMax = Math.max(...sigmas, tangency.vol, ...cloud.map((p) => p.vol)) * 1.08;
  const retMin = Math.min(0, riskFree, ...mus) * 0.5;
  const retMax = Math.max(...mus) * 1.1;
  const cml = useMemo(() => capitalMarketLine(tangency, riskFree, volMax), [tangency, riskFree, volMax]);

  const setWeight = (i: number, v: number) =>
    setRawWeights((prev) => prev.map((w, j) => (j === i ? v : w)));
  const applyPreset = (target: number[]) => setRawWeights(target.map(clamp01));

  const setAssetParam = (i: number, key: "mu" | "sigma", v: number) =>
    setAssets((prev) => prev.map((a, j) => (j === i ? { ...a, [key]: v } : a)));
  const setAssetName = (i: number, name: string) =>
    setAssets((prev) => prev.map((a, j) => (j === i ? { ...a, name } : a)));

  const addAsset = () => {
    setAssets((prev) => [
      ...prev,
      {
        id: `asset-${Date.now()}`,
        name: `Asset ${prev.length + 1}`,
        color: ASSET_PALETTE[prev.length % ASSET_PALETTE.length],
        mu: 0.1,
        sigma: 0.2,
      },
    ]);
    setRawWeights((prev) => [...prev, 1 / (prev.length + 1)]);
  };

  const removeAsset = (i: number) => {
    if (assets.length <= 2) return;
    setAssets((prev) => prev.filter((_, j) => j !== i));
    setRawWeights((prev) => prev.filter((_, j) => j !== i));
  };

  return {
    assets,
    rawWeights,
    weights,
    finalWeights,
    cashWeight,
    rho,
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
    canRemove: assets.length > 2,
    cloudCount,
    showCloud,
    setRho,
    setRiskFree,
    setCashWeight,
    setWeight,
    applyPreset,
    setAssetParam,
    setAssetName,
    addAsset,
    removeAsset,
    setCloudCount,
    setShowCloud,
    regenerateCloud: () => setCloudSeed((s) => s + 1),
  };
}
