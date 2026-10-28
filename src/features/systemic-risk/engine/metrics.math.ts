import { UNIT_PRICES, indexBook, sheetOf, type Book, type Prices } from "./accounting.math";
import { DEFAULT_PARAMS } from "./presets.math";
import type { ExposureType, FinNetwork, Institution } from "./systemic.types";

export type BalanceMetrics = {
  assets: number;
  liabilities: number;
  equity: number;
  /// assets ÷ equity (Infinity when equity ≤ 0)
  leverage: number;
  /// equity ÷ assets
  capitalRatio: number;
  /// (cash + government bonds) ÷ (short funding + deposits × depositRunFraction)
  liquidityRatio: number;
};

/// Balance-sheet ratios of `inst` at `prices` (default: par). Pass the book if you already have it.
export function balance(
  inst: Institution,
  net: FinNetwork,
  prices: Prices = UNIT_PRICES,
  depositRunFraction = DEFAULT_PARAMS.depositRunFraction,
  book: Book = indexBook(net.exposures),
): BalanceMetrics {
  const { assets, liabilities, equity } = sheetOf(inst, prices, book);
  const need = inst.shortFunding + inst.deposits * depositRunFraction;
  return {
    assets, liabilities, equity,
    leverage: equity > 0 ? assets / equity : Infinity,
    capitalRatio: assets > 0 ? equity / assets : 0,
    liquidityRatio: need > 0 ? (inst.cash + inst.holdings.gov * prices.gov) / need : Infinity,
  };
}

/// `out` counts claims held (lent), `in` counts amounts owed (borrowed).
export type Degree = { out: number; in: number; outAmount: number; inAmount: number };

/// Per institution: number of exposures it lends (`out`) and borrows (`in`), and their $bn totals.
export function degrees(net: FinNetwork): Record<string, Degree> {
  const d: Record<string, Degree> = {};
  for (const i of net.institutions) d[i.id] = { out: 0, in: 0, outAmount: 0, inAmount: 0 };
  for (const e of net.exposures) {
    d[e.lender].out++;
    d[e.lender].outAmount += e.amount;
    d[e.borrower].in++;
    d[e.borrower].inAmount += e.amount;
  }
  return d;
}

/// Share of the n·(n−1) possible directed lender→borrower pairs that carry an exposure.
export function density(net: FinNetwork): number {
  const n = net.institutions.length;
  const pairs = new Set(net.exposures.filter((e) => e.amount > 0).map((e) => `${e.lender}>${e.borrower}`));
  return n > 1 ? pairs.size / (n * (n - 1)) : 0;
}

/// Lender × borrower matrix of $bn claims (optionally only one exposure type); rows/columns follow `ids`.
export function exposureMatrix(net: FinNetwork, type?: ExposureType): { ids: string[]; matrix: number[][] } {
  const ids = net.institutions.map((i) => i.id);
  const at = new Map(ids.map((id, k) => [id, k]));
  const matrix = ids.map(() => ids.map(() => 0));
  for (const e of net.exposures) if (!type || e.type === type) matrix[at.get(e.lender)!][at.get(e.borrower)!] += e.amount;
  return { ids, matrix };
}

const equitiesOf = (net: FinNetwork): number[] => {
  const book = indexBook(net.exposures);
  return net.institutions.map((i) => sheetOf(i, UNIT_PRICES, book).equity);
};

/// Impact matrix W[i][j] = min(1, loss of i if j defaults ÷ equity of i), with loss = lgd × (claim − collateral).
function impactMatrix(net: FinNetwork, lgd: number): number[][] {
  const ids = net.institutions.map((i) => i.id);
  const at = new Map(ids.map((id, k) => [id, k]));
  const eq = equitiesOf(net);
  const loss = ids.map(() => ids.map(() => 0));
  for (const e of net.exposures) loss[at.get(e.lender)!][at.get(e.borrower)!] += lgd * Math.max(0, e.amount - e.collateral);
  return loss.map((row, i) => row.map((l) => (l > 0 ? (eq[i] > 0 ? Math.min(1, l / eq[i]) : 1) : 0)));
}

/// Eigenvector centrality of the impact network (loss ÷ lender equity, see `impactMatrix`): a borrower is central when important
/// lenders are heavily exposed to it. Power iteration on (I + Wᵀ) (the shift avoids oscillation on rings),
/// 200 iterations, L1-normalised.
export function eigenvectorCentrality(net: FinNetwork, lgd = DEFAULT_PARAMS.lgd): Record<string, number> {
  const w = impactMatrix(net, lgd);
  const n = w.length;
  let x = Array.from({ length: n }, () => 1 / Math.max(1, n));
  for (let it = 0; it < 200; it++) {
    const next = x.map((xj, j) => xj + w.reduce((s, row, i) => s + row[j] * x[i], 0));
    const norm = next.reduce((s, v) => s + v, 0) || 1;
    x = next.map((v) => v / norm);
  }
  return Object.fromEntries(net.institutions.map((inst, k) => [inst.id, x[k]]));
}

/// `h` is the final distress (0…1) of each institution.
export type DebtRankResult = { rank: number; h: Record<string, number> };

/// DebtRank (Battiston et al., 2012). `h0` is the initial distress (0…1) of each institution; every distressed
/// node propagates exactly once, impacts are W[i][j] above, and the rank is Σ hᵢ(final)·vᵢ − Σ hᵢ(0)·vᵢ with
/// v = share of total assets, i.e. the economic value lost excluding the initial shock.
export function debtRank(net: FinNetwork, h0: Record<string, number>, lgd = DEFAULT_PARAMS.lgd): DebtRankResult {
  const w = impactMatrix(net, lgd);
  const n = w.length;
  const book = indexBook(net.exposures);
  const assets = net.institutions.map((i) => sheetOf(i, UNIT_PRICES, book).assets);
  const totalAssets = assets.reduce((s, a) => s + a, 0) || 1;
  const start = net.institutions.map((i) => Math.min(1, Math.max(0, h0[i.id] ?? 0)));
  let h = start.slice();
  // 0 = undistressed, 1 = distressed (propagates now), 2 = inactive (has propagated)
  let state: number[] = h.map((v) => (v > 0 ? 1 : 0));
  for (let round = 0; round <= n && state.includes(1); round++) {
    const next = h.slice();
    for (let j = 0; j < n; j++) {
      if (state[j] !== 1) continue;
      for (let i = 0; i < n; i++) if (w[i][j] > 0) next[i] = Math.min(1, next[i] + w[i][j] * h[j]);
    }
    state = state.map((s, i) => (s === 1 ? 2 : s === 0 && next[i] > 0 ? 1 : s));
    h = next;
  }
  const value = (v: number[]) => v.reduce((s, x, i) => s + x * assets[i], 0) / totalAssets;
  return { rank: value(h) - value(start), h: Object.fromEntries(net.institutions.map((inst, k) => [inst.id, h[k]])) };
}

/// Each institution shocked alone (h0 = 1) and ranked by DebtRank, highest first.
export function systemicRanking(net: FinNetwork, lgd = DEFAULT_PARAMS.lgd): { id: string; debtRank: number }[] {
  return net.institutions
    .map((i) => ({ id: i.id, debtRank: debtRank(net, { [i.id]: 1 }, lgd).rank }))
    .sort((a, b) => b.debtRank - a.debtRank || a.id.localeCompare(b.id));
}
