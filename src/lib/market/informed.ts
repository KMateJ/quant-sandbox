import { bisection } from "../math/roots";
import { normCdf, normPdf } from "../stats/distributions";

/// Flow seen by a symmetric quoter: arrivals/s, fill decay k (1/price unit), informed share, volatility per √s,
/// and how far ahead informed customers see.
export type InformedFlow = { lambda: number; k: number; informed: number; sigma: number; horizon: number };

/// Expected loss to one informed arrival on one side at half-spread δ, when the value moves N(0, s²): E[(X − δ)⁺].
export function informedLoss(delta: number, s: number): number {
  if (s <= 0) return 0;
  const z = delta / s;
  return s * normPdf(z) - delta * (1 - normCdf(z));
}

/// Income per second of symmetric quotes at half-spread δ: λ·[(1 − π)·δ·e^{−kδ} − 2π·informedLoss(δ, σ√h)].
/// With π = 0 this equals `expectedSpreadIncome(δ, λ/2, k)`.
export function incomeRate(delta: number, p: InformedFlow): number {
  const noise = (1 - p.informed) * delta * Math.exp(-p.k * delta);
  const informed = 2 * p.informed * informedLoss(delta, p.sigma * Math.sqrt(p.horizon));
  return p.lambda * (noise - informed);
}

const GOLD = (Math.sqrt(5) - 1) / 2;

/// Half-spread maximising `incomeRate`, by golden-section search on [0, 6/k].
export function bestDelta(p: InformedFlow): number {
  let a = 0;
  let b = 6 / p.k;
  for (let i = 0; i < 80; i++) {
    const c = b - GOLD * (b - a);
    const d = a + GOLD * (b - a);
    if (incomeRate(c, p) > incomeRate(d, p)) b = d;
    else a = c;
  }
  return (a + b) / 2;
}

/// Smallest half-spread with non-negative income (0 without informed flow; NaN if no spread breaks even).
export function breakEvenDelta(p: InformedFlow): number {
  if (incomeRate(0, p) >= 0) return 0;
  const best = bestDelta(p);
  if (incomeRate(best, p) < 0) return Number.NaN;
  return bisection((d) => incomeRate(d, p), 0, best, { tol: 1e-9 }).root;
}
