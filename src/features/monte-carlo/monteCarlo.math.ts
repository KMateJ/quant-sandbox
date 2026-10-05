import { makeRng, nextNormal } from "../../lib/math/random";
import { blackScholesCall } from "../black-scholes/blackScholes.math";
import type { MonteCarloPoint, MonteCarloResult } from "./monteCarlo.types";

/// Price a European call by Monte Carlo and track the running estimate converging to Black–Scholes.
/// Terminal prices are S₀·exp((r−½σ²)T + σ√T·Z); payoffs are discounted at the risk-free rate.
export function monteCarloCall(
  s0: number,
  strike: number,
  maturity: number,
  rate: number,
  vol: number,
  sims: number,
  seed: number,
  samplePoints: number
): MonteCarloResult {
  const rng = makeRng(seed);
  const disc = Math.exp(-rate * maturity);
  const drift = (rate - 0.5 * vol * vol) * maturity;
  const diffusion = vol * Math.sqrt(maturity);
  const analytic = blackScholesCall(s0, strike, maturity, rate, vol);
  const stride = Math.max(1, Math.floor(sims / samplePoints));

  let sum = 0;
  let sumSq = 0;
  const data: MonteCarloPoint[] = [];
  for (let i = 1; i <= sims; i++) {
    const sT = s0 * Math.exp(drift + diffusion * nextNormal(rng));
    const payoff = Math.max(sT - strike, 0) * disc;
    sum += payoff;
    sumSq += payoff * payoff;
    if (i % stride === 0 || i === sims) {
      data.push({ n: i, estimate: sum / i, analytic });
    }
  }

  const estimate = sum / sims;
  const variance = Math.max(sumSq / sims - estimate * estimate, 0);
  const standardError = Math.sqrt(variance / sims);
  return { estimate, analytic, standardError, data };
}
