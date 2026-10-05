import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  ASSET_PALETTE,
  DEFAULT_ASSETS,
  appendCorr,
  covFromCorr,
  defaultCorr,
  identityCorr,
  isValidCorrelation,
  nearestCorrelation,
  removeCorr,
  setCorrEntry,
  uniformCorr,
} from "./portfolioLab.math";
import type { Asset } from "./portfolioLab.types";

export type CorrPreset = "low" | "high" | "identity";

type UniverseValue = {
  assets: Asset[];
  mus: number[];
  sigmas: number[];
  cov: number[][];
  corr: number[][];
  corrValid: boolean;
  riskFree: number;
  setCorrelation: (i: number, j: number, v: number) => void;
  resetCorr: () => void;
  applyCorrPreset: (kind: CorrPreset) => void;
  repairCorr: () => void;
  setRiskFree: (v: number) => void;
  setAssetParam: (i: number, key: "mu" | "sigma", v: number) => void;
  setAssetName: (i: number, name: string) => void;
  addAsset: () => void;
  removeAsset: (i: number) => void;
  canRemove: boolean;
};

const PortfolioUniverseContext = createContext<UniverseValue | null>(null);

/// Shared asset universe (assets, correlation matrix, risk-free rate) for Portfolio Lab
/// and Portfolio Optimization so both operate on the same portfolio model.
export function PortfolioUniverseProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(DEFAULT_ASSETS);
  const [corr, setCorr] = useState<number[][]>(() => defaultCorr(DEFAULT_ASSETS.length));
  const [riskFree, setRiskFree] = useState(0.03);

  const mus = useMemo(() => assets.map((a) => a.mu), [assets]);
  const sigmas = useMemo(() => assets.map((a) => a.sigma), [assets]);
  const cov = useMemo(() => covFromCorr(sigmas, corr), [sigmas, corr]);
  const corrValid = useMemo(() => isValidCorrelation(corr), [corr]);

  const value = useMemo<UniverseValue>(
    () => ({
      assets,
      mus,
      sigmas,
      cov,
      corr,
      corrValid,
      riskFree,
      setCorrelation: (i, j, v) => setCorr((prev) => setCorrEntry(prev, i, j, v)),
      resetCorr: () => setCorr(defaultCorr(assets.length)),
      applyCorrPreset: (kind) =>
        setCorr(
          kind === "identity"
            ? identityCorr(assets.length)
            : uniformCorr(assets.length, kind === "low" ? 0.1 : 0.8)
        ),
      repairCorr: () => setCorr((prev) => nearestCorrelation(prev)),
      setRiskFree,
      setAssetParam: (i, key, v) =>
        setAssets((prev) => prev.map((a, j) => (j === i ? { ...a, [key]: v } : a))),
      setAssetName: (i, name) =>
        setAssets((prev) => prev.map((a, j) => (j === i ? { ...a, name } : a))),
      addAsset: () => {
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
        setCorr((prev) => appendCorr(prev, 0.2));
      },
      removeAsset: (i) => {
        if (assets.length <= 2) return;
        setAssets((prev) => prev.filter((_, j) => j !== i));
        setCorr((prev) => removeCorr(prev, i));
      },
      canRemove: assets.length > 2,
    }),
    [assets, mus, sigmas, cov, corr, corrValid, riskFree]
  );

  return (
    <PortfolioUniverseContext.Provider value={value}>
      {children}
    </PortfolioUniverseContext.Provider>
  );
}

/// Access the shared portfolio universe. Throws if used outside the provider.
export function usePortfolioUniverse(): UniverseValue {
  const ctx = useContext(PortfolioUniverseContext);
  if (!ctx) throw new Error("usePortfolioUniverse must be used within PortfolioUniverseProvider");
  return ctx;
}
