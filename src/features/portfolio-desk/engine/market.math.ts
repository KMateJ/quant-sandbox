import { cholesky, matVec, type Matrix } from "../../../lib/math/matrix";
import { makeRng, normals } from "../../../lib/math/random";
import { subSeed } from "../../../lib/game/seed";
import { covFromCorr } from "../../portfolio-lab/portfolioLab.math";
import type { PortfolioMission, PortfolioPath, Regime } from "./portfolio.types";

const SQRT12 = Math.sqrt(12);

/// Monthly covariance of a regime: Σᵢⱼ = ρᵢⱼ σᵢσⱼ / 12.
export function monthlyCov(regime: Regime): Matrix {
  return covFromCorr(regime.sigma.map((s) => s / SQRT12), regime.corr);
}

/// First stress month (1-based): fixed, or drawn in [10, 25] from a sub-seeded RNG so the return path is unaffected.
export function stressStartFor(mission: PortfolioMission, seed: number): number {
  if (mission.stressStart !== "random") return mission.stressStart;
  return 10 + Math.floor(makeRng(subSeed(seed, 1))() * 16);
}

/// True when 1-based `month` falls inside the stress window.
export function inStress(mission: PortfolioMission, stressStart: number, month: number): boolean {
  return month >= stressStart && month < stressStart + mission.stressLength;
}

/// Correlated lognormal monthly returns: rᵢ = exp(μᵢ/12 − σᵢ²/24 + (Lz)ᵢ) − 1 with L the Cholesky factor of the active regime.
export function monthlyReturns(mission: PortfolioMission, seed: number): PortfolioPath {
  const stressStart = stressStartFor(mission, seed);
  const factor = (regime: Regime) => {
    const L = cholesky(monthlyCov(regime));
    if (!L) throw new Error("monthlyReturns: regime correlation is not positive definite");
    return L;
  };
  const L = { calm: factor(mission.calm), stress: factor(mission.stress) };
  const rng = makeRng(seed);
  const R: number[][] = [];
  for (let m = 1; m <= mission.months; m++) {
    const stress = inStress(mission, stressStart, m);
    const regime = stress ? mission.stress : mission.calm;
    const shock = matVec(stress ? L.stress : L.calm, normals(regime.mu.length, rng));
    R.push(regime.mu.map((mu, i) => Math.exp(mu / 12 - regime.sigma[i] ** 2 / 24 + shock[i]) - 1));
  }
  return { R, stressStart };
}

/// EWMA monthly covariance after the first `upTo` realised months: S ← λS + (1−λ) r rᵀ, starting from the calm covariance.
export function ewmaCov(mission: PortfolioMission, R: number[][], upTo: number): Matrix {
  let S = monthlyCov(mission.calm);
  const lam = mission.lambda;
  for (let k = 0; k < Math.min(upTo, R.length); k++) {
    const r = R[k];
    S = S.map((row, i) => row.map((s, j) => lam * s + (1 - lam) * r[i] * r[j]));
  }
  return S;
}
