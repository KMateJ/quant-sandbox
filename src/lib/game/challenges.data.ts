import type { ChallengeKind } from "./game.types";

export type ChallengeArea = "stochastic" | "portfolio" | "rates" | "corporate";
/// One lab challenge round; `tolerance` is display text matching the lab's hit rule.
export type ChallengeDef = { id: string; area: ChallengeArea; moduleId: string; kind: ChallengeKind; tolerance: string };

/// Every lab challenge round, by stable id.
export const CHALLENGES: readonly ChallengeDef[] = [
  { id: "clt-spread", area: "stochastic", moduleId: "stochastic-models", kind: "guess", tolerance: "±0.05" },
  { id: "sqrt-scaling", area: "stochastic", moduleId: "stochastic-models", kind: "guess", tolerance: "±0.1" },
  { id: "covariance", area: "stochastic", moduleId: "stochastic-models", kind: "guess", tolerance: "±0.03" },
  { id: "running-max", area: "stochastic", moduleId: "stochastic-models", kind: "guess", tolerance: "±0.05" },
  { id: "first-passage", area: "stochastic", moduleId: "stochastic-models", kind: "guess", tolerance: "±3 pp" },
  { id: "first-passage-range", area: "stochastic", moduleId: "stochastic-models", kind: "range", tolerance: "90%" },
  { id: "hitting", area: "stochastic", moduleId: "stochastic-models", kind: "guess", tolerance: "±3 pp" },
  { id: "barrier-hit", area: "stochastic", moduleId: "brownian-motion", kind: "guess", tolerance: "±5 pp" },
  { id: "gbm-median", area: "stochastic", moduleId: "gbm", kind: "place", tolerance: "±3% of S₀" },
  { id: "yield-shock-pick", area: "rates", moduleId: "yield-curve", kind: "pick", tolerance: "1 of 4" },
  { id: "return-range", area: "portfolio", moduleId: "risk-return", kind: "range", tolerance: "90%" },
  { id: "vol-range", area: "portfolio", moduleId: "portfolio-lab", kind: "range", tolerance: "90%" },
  { id: "capm-beta-draw", area: "portfolio", moduleId: "capm", kind: "draw", tolerance: "±0.15" },
  { id: "irr-guess", area: "corporate", moduleId: "npv-irr", kind: "guess", tolerance: "±0.5 pp" },
  { id: "doubling-time", area: "corporate", moduleId: "tvm", kind: "guess", tolerance: "±0.5 y" },
  { id: "wacc-min", area: "corporate", moduleId: "wacc", kind: "place", tolerance: "±5 pp D/V" },
];
