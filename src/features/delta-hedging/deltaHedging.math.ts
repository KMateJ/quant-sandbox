import { makeRng, nextNormal } from "../../lib/math/random";
import { blackScholesCall, blackScholesDelta } from "../black-scholes/blackScholes.math";
import type { HedgePoint, HedgeResult } from "./deltaHedging.types";

/// Simulate discrete delta hedging of a long call over one GBM path with `steps` rebalances.
/// Holds Δ shares plus a cash account accruing at `r`; tracks the replicating value vs the option value.
export function simulateDeltaHedge(
  s0: number,
  strike: number,
  maturity: number,
  rate: number,
  vol: number,
  steps: number,
  seed: number
): HedgeResult {
  const rng = makeRng(seed);
  const dt = maturity / steps;
  const sqrtDt = Math.sqrt(dt);
  const growth = (rate - 0.5 * vol * vol) * dt;

  let s = s0;
  let delta = blackScholesDelta(s0, strike, maturity, rate, vol);
  const premium = blackScholesCall(s0, strike, maturity, rate, vol);
  let cash = premium - delta * s0;

  const data: HedgePoint[] = [{ t: 0, option: premium, replicating: delta * s0 + cash }];

  for (let i = 1; i <= steps; i++) {
    const tau = maturity - i * dt;
    s *= Math.exp(growth + vol * sqrtDt * nextNormal(rng));
    cash *= Math.exp(rate * dt);
    const option = tau > 0 ? blackScholesCall(s, strike, tau, rate, vol) : Math.max(s - strike, 0);
    if (tau > 0) {
      const newDelta = blackScholesDelta(s, strike, tau, rate, vol);
      cash -= (newDelta - delta) * s;
      delta = newDelta;
    }
    data.push({ t: i * dt, option, replicating: delta * s + cash });
  }

  const payoff = Math.max(s - strike, 0);
  const terminalValue = data[data.length - 1].replicating;
  return { data, payoff, terminalValue, hedgeError: terminalValue - payoff };
}
