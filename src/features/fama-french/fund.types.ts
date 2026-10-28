import type { FactorFit, FactorId, FundSpec, ModelId } from "./famaFrench.types";

/// A fund the reader can pick: a synthetic one with an answer key, a real industry portfolio without one,
/// or the hidden `challenge` fund of the loadings game.
export type FundChoice =
  | { id: string; kind: "synthetic"; spec: FundSpec }
  | { id: string; kind: "industry"; index: number }
  | { id: string; kind: "challenge" };

/// OLS fit on any set of factors, with the alpha's own standard error (monthly) and ±2 se band (annualised).
export type AlphaFit = FactorFit & { alphaSe: number; lo: number; hi: number };

export type AlphaRung = { model: ModelId | "custom"; factors: FactorId[]; fit: AlphaFit };
