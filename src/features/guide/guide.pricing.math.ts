import { blackScholesCall, blackScholesDelta, blackScholesGamma, blackScholesPut, normalCdf } from "../black-scholes/blackScholes.math";
import { optionPayoff, type OptionKind } from "../../lib/finance/options";

const grid = (from: number, to: number, points: number) =>
  Array.from({ length: points }, (_, i) => from + ((to - from) * i) / (points - 1));

// #region Forwards and parity

/// Arbitrage against a mispriced forward quote. `sign` is +1 for cash-and-carry
/// (quote too high: borrow, buy the stock, sell forward) and −1 for the reverse trade.
export function forwardArbitrage(S0: number, r: number, T: number, quote: number) {
  const fair = S0 * Math.exp(r * T);
  const sign = quote >= fair ? 1 : -1;
  return { fair, sign, profit: Math.abs(quote - fair) };
}

/// Maturity value of the two legs of the arbitrage and their (flat) total, against S_T.
export function forwardArbitrageRows(S0: number, r: number, T: number, quote: number, sMax = 200, points = 41) {
  const { fair, sign } = forwardArbitrage(S0, r, T, quote);
  return grid(0, sMax, points).map((S) => {
    const stock = sign * (S - fair);
    const forward = sign * (quote - S);
    return { S, stock, forward, total: stock + forward };
  });
}

/// Long call + short put payoff next to the forward payoff S_T − K, against S_T.
export function parityRows(K: number, sMax = 200, points = 41) {
  const xs = grid(0, sMax, points);
  if (!xs.includes(K)) xs.push(K);
  return xs.sort((a, b) => a - b).map((S) => ({
    S,
    combo: optionPayoff(S, K, "call") - optionPayoff(S, K, "put"),
    forward: S - K,
  }));
}

/// Black–Scholes call and put prices with both sides of put–call parity.
export function parityPrices(S0: number, K: number, T: number, r: number, sigma: number) {
  const call = blackScholesCall(S0, K, T, r, sigma);
  const put = blackScholesPut(S0, K, T, r, sigma);
  return { call, put, lhs: call - put, rhs: S0 - K * Math.exp(-r * T) };
}
// #endregion

// #region Binomial

/// One-step call: arbitrage-free price and the "naive" discounted real-world expectation for each p.
export function realVsRiskNeutral(S0: number, u: number, d: number, r: number, K: number) {
  const cu = optionPayoff(u * S0, K, "call");
  const cd = optionPayoff(d * S0, K, "call");
  const q = (1 + r - d) / (u - d);
  const fair = (q * cu + (1 - q) * cd) / (1 + r);
  const rows = grid(0, 1, 41).map((p) => ({ p, naive: (p * cu + (1 - p) * cd) / (1 + r), fair }));
  return { q, fair, rows, valid: d < 1 + r && 1 + r < u };
}

/// Real-world expected one-period stock return p·u + (1−p)·d − 1.
export const expectedStockReturn = (p: number, u: number, d: number) => p * u + (1 - p) * d - 1;

/// Option price on an n-step Cox–Ross–Rubinstein tree (u = e^{σ√Δt}, d = 1/u);
/// `american` takes max(continuation, exercise) at every node.
export function crrPrice(S0: number, K: number, T: number, r: number, sigma: number, n: number, kind: OptionKind = "call", american = false) {
  const dt = T / n;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const growth = Math.exp(r * dt);
  const q = (growth - d) / (u - d);
  const values = Array.from({ length: n + 1 }, (_, j) => optionPayoff(S0 * u ** j * d ** (n - j), K, kind));
  for (let step = n - 1; step >= 0; step--) {
    for (let j = 0; j <= step; j++) {
      const hold = (q * values[j + 1] + (1 - q) * values[j]) / growth;
      values[j] = american ? Math.max(hold, optionPayoff(S0 * u ** j * d ** (step - j), K, kind)) : hold;
    }
  }
  return values[0];
}

/// European and American put against today's stock price, with the payoff, from 100-step trees.
export function americanPutRows(K: number, T: number, r: number, sigma: number, sMin = 50, sMax = 150, n = 100) {
  return grid(sMin, sMax, 51).map((S) => ({
    S,
    european: crrPrice(S, K, T, r, sigma, n, "put"),
    american: crrPrice(S, K, T, r, sigma, n, "put", true),
    payoff: optionPayoff(S, K, "put"),
  }));
}

/// Highest stock price at which immediate exercise of the American put is optimal (bisection on value = payoff).
export function criticalPutPrice(K: number, T: number, r: number, sigma: number, n = 100) {
  const exercise = (S: number) => crrPrice(S, K, T, r, sigma, n, "put", true) - optionPayoff(S, K, "put") < 1e-6;
  let lo = 1;
  let hi = K;
  if (!exercise(lo)) return NaN;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (exercise(mid)) lo = mid;
    else hi = mid;
  }
  return lo;
}

/// CRR call price for n = 1..maxSteps, for the convergence chart.
export function treeConvergenceRows(S0: number, K: number, T: number, r: number, sigma: number, maxSteps = 150) {
  return Array.from({ length: maxSteps }, (_, i) => ({ n: i + 1, tree: crrPrice(S0, K, T, r, sigma, i + 1) }));
}
// #endregion

// #region Black–Scholes curves

/// Call value against S, the tangent at S₀ (slope Δ) and the maturity payoff.
export function deltaTangent(S0: number, K: number, T: number, r: number, sigma: number, sMin = 40, sMax = 160) {
  const value = blackScholesCall(S0, K, T, r, sigma);
  const delta = blackScholesDelta(S0, K, T, r, sigma);
  const gamma = blackScholesGamma(S0, K, T, r, sigma);
  const tangentAt = (S: number) => value + delta * (S - S0);
  const hedgeError = (move: number) => blackScholesCall(S0 + move, K, T, r, sigma) - tangentAt(S0 + move);
  const rows = grid(sMin, sMax, 61).map((S) => ({
    S,
    value: blackScholesCall(S, K, T, r, sigma),
    tangent: tangentAt(S),
    payoff: optionPayoff(S, K, "call"),
  }));
  return { value, delta, gamma, rows, errorUp: hedgeError(10), errorDown: hedgeError(-10) };
}

/// Black–Scholes price against S with the maturity payoff, plus d₁, d₂ at a reference spot.
export function blackScholesCurve(kind: OptionKind, K: number, T: number, r: number, sigma: number, spot = 100, sMax = 200) {
  const price = (S: number) => (kind === "call" ? blackScholesCall : blackScholesPut)(S, K, T, r, sigma);
  const rows = grid(1, sMax, 80).map((S) => ({ S, price: price(S), payoff: optionPayoff(S, K, kind) }));
  const d1 = (Math.log(spot / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  return { rows, price: price(spot), d1, d2, nd1: normalCdf(d1), nd2: normalCdf(d2) };
}
// #endregion
