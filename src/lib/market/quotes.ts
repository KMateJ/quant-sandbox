/// Fill rate of a quote `delta` away from mid: A·e^{−kδ}.
export const fillIntensity = (delta: number, A: number, k: number) => A * Math.exp(-k * delta);

/// Expected spread income per unit time quoting ±δ with unit size on both sides: 2δ·A·e^{−kδ}.
export const expectedSpreadIncome = (delta: number, A: number, k: number) => 2 * delta * fillIntensity(delta, A, k);

/// The half-spread maximising `expectedSpreadIncome`: 1/k.
export const incomeMaximisingDelta = (k: number) => 1 / k;

/// Avellaneda–Stoikov reservation price s − q·γσ²·(T − t).
export const asReservation = (s: number, q: number, gamma: number, sigma: number, tLeft: number) =>
  s - q * gamma * sigma * sigma * tLeft;

/// Avellaneda–Stoikov total spread γσ²·(T − t) + (2/γ)·ln(1 + γ/k).
export const asTotalSpread = (gamma: number, sigma: number, k: number, tLeft: number) =>
  gamma * sigma * sigma * tLeft + (2 / gamma) * Math.log(1 + gamma / k);

/// Avellaneda–Stoikov bid/ask: reservation ± half the total spread.
export function asQuotes(p: { s: number; q: number; gamma: number; sigma: number; k: number; tLeft: number }) {
  const reservation = asReservation(p.s, p.q, p.gamma, p.sigma, p.tLeft);
  const halfSpread = asTotalSpread(p.gamma, p.sigma, p.k, p.tLeft) / 2;
  return { reservation, halfSpread, bid: reservation - halfSpread, ask: reservation + halfSpread };
}
