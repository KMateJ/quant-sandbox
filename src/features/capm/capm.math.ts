import { capmExpectedReturn, jensenAlpha } from "../../lib/finance/capm";
import type { SmlPoint } from "./capm.types";

/// CAPM required expected return: rf + β·(E[rm] − rf).
export function expectedReturn(riskFree: number, beta: number, marketReturn: number): number {
  return capmExpectedReturn(riskFree, beta, marketReturn);
}

/// Market risk premium: E[rm] − rf.
export function marketRiskPremium(riskFree: number, marketReturn: number): number {
  return marketReturn - riskFree;
}

/// Jensen's alpha: realised return minus the CAPM-required return (positive ⇒ undervalued).
export function alpha(
  actualReturn: number,
  riskFree: number,
  beta: number,
  marketReturn: number
): number {
  return jensenAlpha(actualReturn, riskFree, beta, marketReturn);
}

/// Points along the security market line from beta 0 to `maxBeta`.
export function securityMarketLine(
  riskFree: number,
  marketReturn: number,
  maxBeta: number,
  steps: number
): SmlPoint[] {
  const points: SmlPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const beta = (i / steps) * maxBeta;
    points.push({ beta, ret: expectedReturn(riskFree, beta, marketReturn) });
  }
  return points;
}
