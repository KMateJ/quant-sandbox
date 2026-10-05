/// Simple (arithmetic) period returns from a price series: r[i] = p[i]/p[i-1] − 1.
/// Output length is `prices.length − 1`. Requires at least two prices.
export function simpleReturns(prices: number[]): number[] {
  const n = prices.length;
  if (n < 2) throw new Error("simpleReturns: need at least two prices");
  const out = new Array<number>(n - 1);
  for (let i = 1; i < n; i++) {
    if (prices[i - 1] === 0) throw new Error("simpleReturns: zero price encountered");
    out[i - 1] = prices[i] / prices[i - 1] - 1;
  }
  return out;
}

/// Continuously compounded (log) period returns: r[i] = ln(p[i]/p[i-1]).
/// Output length is `prices.length − 1`. Requires at least two positive prices.
export function logReturns(prices: number[]): number[] {
  const n = prices.length;
  if (n < 2) throw new Error("logReturns: need at least two prices");
  const out = new Array<number>(n - 1);
  for (let i = 1; i < n; i++) {
    if (prices[i - 1] <= 0 || prices[i] <= 0) {
      throw new Error("logReturns: prices must be positive");
    }
    out[i - 1] = Math.log(prices[i] / prices[i - 1]);
  }
  return out;
}

/// Total cumulative return from a series of simple period returns: Π(1 + r) − 1.
export function cumulativeReturn(returns: number[]): number {
  let growth = 1;
  for (let i = 0; i < returns.length; i++) growth *= 1 + returns[i];
  return growth - 1;
}

/// Annualise a per-period mean return by compounding over `periodsPerYear` periods.
export function annualiseReturn(periodReturn: number, periodsPerYear: number): number {
  return Math.pow(1 + periodReturn, periodsPerYear) - 1;
}

/// Annualise a per-period volatility by the square-root-of-time rule.
export function annualiseVolatility(periodVol: number, periodsPerYear: number): number {
  return periodVol * Math.sqrt(periodsPerYear);
}
