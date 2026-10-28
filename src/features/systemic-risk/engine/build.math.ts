import { ASSET_IDS, UNIT_PRICES, indexBook, sheetOf } from "./accounting.math";
import type { AssetClass, AssetId, Exposure, ExposureType, FinNetwork, InstKind, Institution } from "./systemic.types";

/// Shares of the funding gap (assets − equity − amounts owed) raised as deposits / short funding / other liabilities.
export type FundingMix = { deposits: number; shortFunding: number; otherLiab: number };

/// An institution's asset side and target leverage; liabilities are solved by `buildNetwork`.
export type BankSpec = {
  id: string;
  kind: InstKind;
  tag: string;
  cash: number;
  loans: number;
  holdings: Partial<Record<AssetId, number>>;
  /// assets ÷ equity (money market funds: assets ÷ share liabilities, e.g. 1.01)
  leverage: number;
  /// Fixes equity in $bn instead of using `leverage` (CCPs).
  equity?: number;
};

export const FUNDING_MIX: Record<InstKind, FundingMix> = {
  dealer: { deposits: 0, shortFunding: 0.5, otherLiab: 0.5 },
  bank: { deposits: 0.6, shortFunding: 0.2, otherLiab: 0.2 },
  regional: { deposits: 0.8, shortFunding: 0.05, otherLiab: 0.15 },
  mmf: { deposits: 1, shortFunding: 0, otherLiab: 0 },
  hedgeFund: { deposits: 0, shortFunding: 0.15, otherLiab: 0.85 },
  insurer: { deposits: 0, shortFunding: 0.1, otherLiab: 0.9 },
  ccp: { deposits: 0, shortFunding: 0, otherLiab: 1 },
};

/// Market depth ($bn of net sales per 1% price move) of the four asset classes.
export const DEFAULT_ASSETS: AssetClass[] = [
  { id: "gov", depth: 400 },
  { id: "corp", depth: 20 },
  { id: "mbs", depth: 15 },
  { id: "equity", depth: 40 },
];

export const COLLATERAL_SHARE: Record<ExposureType, number> = { interbank: 0, repo: 0.7, derivatives: 0.5 };

const r2 = (x: number) => Math.round(x * 100) / 100;

/// An exposure with the type's stylised collateral share (value net of haircuts and close-out costs).
export function makeExposure(id: string, lender: string, borrower: string, type: ExposureType, amount: number): Exposure {
  return { id, lender, borrower, type, amount: r2(amount), collateral: r2(amount * COLLATERAL_SHARE[type]) };
}

/// Builds a network whose liabilities make each institution hit its target leverage: the gap between assets,
/// equity and amounts owed is split by `FUNDING_MIX[kind]`. Leverage rises if the gap would be negative.
export function buildNetwork(specs: BankSpec[], exposures: Exposure[], assets: AssetClass[] = DEFAULT_ASSETS): FinNetwork {
  const book = indexBook(exposures);
  const institutions: Institution[] = specs.map((s) => {
    const holdings = { gov: 0, corp: 0, mbs: 0, equity: 0, ...s.holdings } as Institution["holdings"];
    const base: Institution = {
      id: s.id, kind: s.kind, tag: s.tag, cash: s.cash, loans: s.loans, holdings,
      deposits: 0, shortFunding: 0, otherLiab: 0,
    };
    const owed = book.owed.get(s.id)?.reduce((t, e) => t + e.amount, 0) ?? 0;
    const { assets: a } = sheetOf(base, UNIT_PRICES, book);
    const equity = s.equity ?? (s.kind === "mmf" ? a * (1 - 1 / s.leverage) : a / s.leverage);
    const gap = Math.max(0, a - equity - owed);
    const mix = FUNDING_MIX[s.kind];
    const deposits = r2(gap * mix.deposits);
    const shortFunding = r2(gap * mix.shortFunding);
    return { ...base, deposits, shortFunding, otherLiab: r2(gap - deposits - shortFunding) };
  });
  return { institutions, exposures: exposures.map((e) => ({ ...e })), assets: assets.map((a) => ({ ...a })) };
}

/// Total of the four securities holdings (at par).
export const totalHoldings = (h: Institution["holdings"]) => ASSET_IDS.reduce((s, a) => s + h[a], 0);
