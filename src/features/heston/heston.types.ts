import type React from "react";

export type HestonParams = {
  S0: number;
  K: number;
  r: number;
  v0: number;
  theta: number;
  kappa: number;
  xi: number;
  rho: number;
  T: number;
  steps: number;
  paths: number;
};

export type HestonPathPoint = {
  t: number;
  [key: string]: number;
};

export type HestonControlsState = {
  S0: number;
  strike: number;
  rate: number;
  v0: number;
  theta: number;
  kappa: number;
  xi: number;
  rho: number;
  maturity: number;
  steps: number;
  pathCount: number;
  pricingSteps: number;
  pricingPaths: number;
};

export type HestonControlsSetters = {
  setS0: React.Dispatch<React.SetStateAction<number>>;
  setStrike: React.Dispatch<React.SetStateAction<number>>;
  setRate: React.Dispatch<React.SetStateAction<number>>;
  setV0: React.Dispatch<React.SetStateAction<number>>;
  setTheta: React.Dispatch<React.SetStateAction<number>>;
  setKappa: React.Dispatch<React.SetStateAction<number>>;
  setXi: React.Dispatch<React.SetStateAction<number>>;
  setRho: React.Dispatch<React.SetStateAction<number>>;
  setMaturity: React.Dispatch<React.SetStateAction<number>>;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  setPathCount: React.Dispatch<React.SetStateAction<number>>;
  setPricingSteps: React.Dispatch<React.SetStateAction<number>>;
  setPricingPaths: React.Dispatch<React.SetStateAction<number>>;
};

export type PriceComparisonPoint = {
  S: number;
  bs: number;
  heston: number;
};

export type SmilePoint = {
  moneyness: number;
  bsIv: number;
  hestonIv: number;
};

export type HestonPricingWorkerRequest = {
  requestId: number;
  S0: number;
  strike: number;
  rate: number;
  v0: number;
  theta: number;
  kappa: number;
  xi: number;
  rho: number;
  maturity: number;
  pricingSteps: number;
  pricingPaths: number;
};

export type HestonPricingWorkerResponse = {
  requestId: number;
  priceComparisonData: PriceComparisonPoint[];
  smileData: SmilePoint[];
};