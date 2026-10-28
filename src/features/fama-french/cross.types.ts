import type { ModelId } from "./famaFrench.types";

export type CrossModel = Extract<ModelId, "capm" | "ff3" | "ff5">;
export const CROSS_MODELS: readonly CrossModel[] = ["capm", "ff3", "ff5"];

/// One of the 25 portfolios under a model; returns are annual excess returns in decimals.
export type CrossRow = {
  label: string;
  size: number;
  value: number;
  realised: number;
  predicted: number;
  alpha: number;
  alphaT: number;
};
