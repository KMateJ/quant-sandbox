import { makeRng, nextNormal } from "../../lib/math/random";
import { fillIntensity } from "../../lib/market/quotes";

/// Shares per fill and per unit of inventory skew.
export const LOT = 100;
export const SKEW_SEED = 7;

/// Standard deviation of the P&L of holding `q` shares for `tau` seconds when the mid moves with `sigma` per √second: |q|·σ·√τ.
export const inventoryPnlSd = (q: number, sigma: number, tau: number) => Math.abs(q) * sigma * Math.sqrt(tau);

/// Cost of flattening `q` shares now at the touch: |q|·(half-spread + fee), per share in USD.
export const flattenCost = (q: number, halfSpread: number, fee: number) => Math.abs(q) * (halfSpread + fee);

export type SkewInput = {
  /// USD both quotes move down per lot (`LOT` shares) of inventory held; 0 = symmetric quotes.
  theta: number;
  /// Half-spread around the mid in USD when flat.
  halfSpread: number;
  /// Fill intensity A·e^{−kδ} per second per side.
  A: number;
  k: number;
  /// Mid volatility in USD per √second.
  sigma: number;
  /// Session length in seconds, stepped by `dt`.
  T: number;
  dt: number;
  sessions: number;
  seed: number;
};

export type SkewResult = {
  /// Inventory in shares: `paths[session][step]`.
  paths: number[][];
  terminal: number[];
  pnl: number[];
  inventorySd: number;
  meanPnl: number;
  pnlSd: number;
};

export const DEFAULT_SKEW: Omit<SkewInput, "theta"> = {
  halfSpread: 0.02,
  A: 0.25,
  k: 30,
  sigma: 0.02,
  T: 60,
  dt: 1,
  sessions: 200,
  seed: SKEW_SEED,
};

const MIN_DISTANCE = 0.001;
const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
const sd = (xs: number[]) => {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length);
};

/// Quote distances from the mid `[bid, ask]` for `lots` of inventory: the bid moves away and the ask closer when long.
export const skewedDistances = (halfSpread: number, theta: number, lots: number): [number, number] => [
  Math.max(MIN_DISTANCE, halfSpread + theta * lots),
  Math.max(MIN_DISTANCE, halfSpread - theta * lots),
];

/// Simulates `sessions` Poisson-fill market makers whose quotes are skewed by `theta` per lot of inventory.
/// Each session reuses the same random numbers for every `theta`, so results are directly comparable.
export function simulateSkew(p: SkewInput): SkewResult {
  const steps = Math.round(p.T / p.dt);
  const paths: number[][] = [];
  const terminal: number[] = [];
  const pnl: number[] = [];
  for (let s = 0; s < p.sessions; s++) {
    const rng = makeRng(p.seed * 100003 + s);
    let mid = 0;
    let lots = 0;
    let cash = 0;
    const path = [0];
    for (let i = 0; i < steps; i++) {
      mid += p.sigma * Math.sqrt(p.dt) * nextNormal(rng);
      const [db, da] = skewedDistances(p.halfSpread, p.theta, lots);
      const buy = rng() < 1 - Math.exp(-fillIntensity(db, p.A, p.k) * p.dt);
      const sell = rng() < 1 - Math.exp(-fillIntensity(da, p.A, p.k) * p.dt);
      if (buy) {
        lots += 1;
        cash -= LOT * (mid - db);
      }
      if (sell) {
        lots -= 1;
        cash += LOT * (mid + da);
      }
      path.push(lots * LOT);
    }
    paths.push(path);
    terminal.push(lots * LOT);
    pnl.push(cash + lots * LOT * mid);
  }
  return { paths, terminal, pnl, inventorySd: sd(terminal), meanPnl: mean(pnl), pnlSd: sd(pnl) };
}

export const LADDER_LOTS = 5;
export const MAX_THETA = 0.005;

/// Skew in USD per lot implied by a reservation marker at `cents` (≤ 0) when holding `LADDER_LOTS` lots.
export const thetaFromReservation = (cents: number) => Math.min(MAX_THETA, Math.max(0, -cents / 100 / LADDER_LOTS));

/// Bid, reservation and ask in cents relative to the mid at `lots` of inventory.
export const ladderRow = (halfSpread: number, theta: number, lots: number) => {
  const shift = -theta * lots * 100;
  return { lots, bid: shift - halfSpread * 100, reservation: shift, ask: shift + halfSpread * 100 };
};
