import type { ChallengeKind } from "./game.types";

export type ChallengeArea = "stochastic" | "portfolio" | "rates" | "corporate" | "microstructure";
/// One lab challenge round; `tolerance` is display text matching the lab's hit rule.
export type ChallengeDef = { id: string; area: ChallengeArea; moduleId: string; kind: ChallengeKind; tolerance: string };

/// Every lab challenge round, by stable id.
export const CHALLENGES: readonly ChallengeDef[] = [
  { id: "clt-spread", area: "stochastic", moduleId: "random-walk", kind: "guess", tolerance: "±0.05" },
  { id: "sqrt-scaling", area: "stochastic", moduleId: "random-walk", kind: "guess", tolerance: "±0.1" },
  { id: "covariance", area: "stochastic", moduleId: "brownian-motion", kind: "guess", tolerance: "±0.03" },
  { id: "running-max", area: "stochastic", moduleId: "brownian-motion", kind: "guess", tolerance: "±0.05" },
  { id: "first-passage", area: "stochastic", moduleId: "brownian-motion", kind: "guess", tolerance: "±3 pp" },
  { id: "first-passage-range", area: "stochastic", moduleId: "brownian-motion", kind: "range", tolerance: "90%" },
  { id: "hitting", area: "stochastic", moduleId: "brownian-motion", kind: "guess", tolerance: "±3 pp" },
  { id: "barrier-hit", area: "stochastic", moduleId: "brownian-motion", kind: "guess", tolerance: "±5 pp" },
  { id: "gbm-median", area: "stochastic", moduleId: "gbm", kind: "place", tolerance: "±3% of S₀" },
  { id: "yield-shock-pick", area: "rates", moduleId: "yield-curve", kind: "pick", tolerance: "1 of 4" },
  { id: "return-range", area: "portfolio", moduleId: "risk-return", kind: "range", tolerance: "90%" },
  { id: "vol-range", area: "portfolio", moduleId: "portfolio-lab", kind: "range", tolerance: "90%" },
  { id: "capm-beta-draw", area: "portfolio", moduleId: "capm", kind: "draw", tolerance: "±0.15" },
  { id: "irr-guess", area: "corporate", moduleId: "npv-irr", kind: "guess", tolerance: "±0.5 pp" },
  { id: "doubling-time", area: "corporate", moduleId: "tvm", kind: "guess", tolerance: "±0.5 y" },
  { id: "wacc-min", area: "corporate", moduleId: "wacc", kind: "place", tolerance: "±5 pp D/V" },
  { id: "glm-belief", area: "microstructure", moduleId: "glosten-milgrom", kind: "guess", tolerance: "±0.05" },
  { id: "glm-quote", area: "microstructure", moduleId: "glosten-milgrom", kind: "score", tolerance: "error ≤ 0.03" },
  { id: "spe-roll", area: "microstructure", moduleId: "spread-estimation", kind: "guess", tolerance: "±1¢" },
  { id: "spe-classify", area: "microstructure", moduleId: "spread-estimation", kind: "score", tolerance: "≥ 80% correct" },
  { id: "mkm-best-spread", area: "microstructure", moduleId: "market-making", kind: "place", tolerance: "±0.4¢" },
  { id: "mkm-round", area: "microstructure", moduleId: "market-making", kind: "score", tolerance: "≥ 60% of theory" },
  { id: "kyl-lambda", area: "microstructure", moduleId: "kyle", kind: "draw", tolerance: "±15%" },
  { id: "kyl-insider", area: "microstructure", moduleId: "kyle", kind: "score", tolerance: "≥ 85% of optimal" },
  { id: "obk-avg-price", area: "microstructure", moduleId: "order-book", kind: "place", tolerance: "±0.4¢" },
  { id: "obk-execution", area: "microstructure", moduleId: "order-book", kind: "score", tolerance: "≤ 60% of one order" },
  { id: "avs-reservation", area: "microstructure", moduleId: "avellaneda-stoikov", kind: "place", tolerance: "±$0.15" },
  { id: "avs-beat", area: "microstructure", moduleId: "avellaneda-stoikov", kind: "score", tolerance: "CE within $1 of AS" },
  { id: "ffm-loadings", area: "portfolio", moduleId: "fama-french", kind: "score", tolerance: "±0.15 each" },
  { id: "ffm-alpha", area: "portfolio", moduleId: "fama-french", kind: "pick", tolerance: "1 of 5" },
  { id: "ffm-corner", area: "portfolio", moduleId: "fama-french", kind: "pick", tolerance: "1 of 25" },
  { id: "syr-most-systemic", area: "portfolio", moduleId: "systemic-risk", kind: "pick", tolerance: "top 1" },
  { id: "syr-rescue", area: "portfolio", moduleId: "systemic-risk", kind: "score", tolerance: "≤ DebtRank policy defaults" },
  { id: "syr-fragile", area: "portfolio", moduleId: "systemic-risk", kind: "place", tolerance: "±1.5 links" },
  { id: "syr-without", area: "portfolio", moduleId: "systemic-risk", kind: "guess", tolerance: "±2 failures" },
];
