import type { AssetId, Exposure, Institution } from "./systemic.types";

export const ASSET_IDS: AssetId[] = ["gov", "corp", "mbs", "equity"];
/// Assets that can be pledged at par under a `parLending` facility.
export const BOND_ASSETS: AssetId[] = ["gov", "corp", "mbs"];

export type Prices = Record<AssetId, number>;
export const UNIT_PRICES: Prices = { gov: 1, corp: 1, mbs: 1, equity: 1 };

/// Exposures indexed by who holds the claim (`claims`) and who owes it (`owed`); entries are shared references.
export type Book = { claims: Map<string, Exposure[]>; owed: Map<string, Exposure[]> };

export type Sheet = { assets: number; liabilities: number; equity: number };

/// Indexes `exposures` by lender and borrower.
export function indexBook(exposures: Exposure[]): Book {
  const claims = new Map<string, Exposure[]>();
  const owed = new Map<string, Exposure[]>();
  for (const e of exposures) {
    if (!claims.has(e.lender)) claims.set(e.lender, []);
    if (!owed.has(e.borrower)) owed.set(e.borrower, []);
    claims.get(e.lender)!.push(e);
    owed.get(e.borrower)!.push(e);
  }
  return { claims, owed };
}

const total = (es: Exposure[] | undefined) => (es ? es.reduce((s, e) => s + e.amount, 0) : 0);

/// Market value of an institution's securities at `prices`.
export function holdingsValue(inst: Institution, prices: Prices): number {
  let v = 0;
  for (const a of ASSET_IDS) v += inst.holdings[a] * prices[a];
  return v;
}

/// Balance sheet: assets = cash + loans + securities at `prices` + claims; liabilities = deposits + short funding +
/// other + amounts owed; equity = assets − liabilities.
export function sheetOf(inst: Institution, prices: Prices, book: Book): Sheet {
  const assets = inst.cash + inst.loans + holdingsValue(inst, prices) + total(book.claims.get(inst.id));
  const liabilities = inst.deposits + inst.shortFunding + inst.otherLiab + total(book.owed.get(inst.id));
  return { assets, liabilities, equity: assets - liabilities };
}
