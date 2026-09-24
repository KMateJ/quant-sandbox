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

export type HestonGreeks = {
  price: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  rho: number;
};

export type GreekKey = "delta" | "gamma" | "vega" | "theta" | "rho";

export type GreekRow = {
  key: GreekKey;
  bs: number;
  heston: number;
};

export type GreeksComparison = {
  bsPrice: number;
  hestonPrice: number;
  sigma: number;
  rows: GreekRow[];
};

export type HestonGreekProfilePoint = {
  S: number;
  delta_bs: number;
  delta_heston: number;
  gamma_bs: number;
  gamma_heston: number;
  vega_bs: number;
  vega_heston: number;
  theta_bs: number;
  theta_heston: number;
  rho_bs: number;
  rho_heston: number;
};

export type HestonPricingCore = {
  greeks: HestonGreeks;
  profile: HestonGreekProfilePoint[];
  // Terminal stock at the base parameters (common random numbers). Reused to
  // reprice the price-comparison curve and volatility smile without extra sims.
  baseTerminal: Float64Array;
  baseDisc: number;
};

export type HestonPricingWorkerRequest = {
  kind: "pricing";
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

export type HestonPathsWorkerRequest = {
  kind: "paths";
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
  steps: number;
  pathCount: number;
};

export type HestonPricingWorkerResponse = {
  kind: "pricing";
  requestId: number;
  priceComparisonData: PriceComparisonPoint[];
  smileData: SmilePoint[];
  greeks: GreeksComparison;
  greeksProfile: HestonGreekProfilePoint[];
};

export type HestonPathsWorkerResponse = {
  kind: "paths";
  requestId: number;
  stockData: HestonPathPoint[];
  varianceData: HestonPathPoint[];
};

export type HestonWorkerRequest =
  | HestonPricingWorkerRequest
  | HestonPathsWorkerRequest;

export type HestonWorkerResponse =
  | HestonPricingWorkerResponse
  | HestonPathsWorkerResponse;
