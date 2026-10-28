/// Stylised institution archetypes (never real firms); pages turn `kind` + `tag` into "Dealer bank A".
export type InstKind = "dealer" | "bank" | "regional" | "mmf" | "hedgeFund" | "insurer" | "ccp";
export type AssetId = "gov" | "corp" | "mbs" | "equity";
export type ExposureType = "interbank" | "repo" | "derivatives";

/// A balance sheet in $bn. Equity is derived: assets (cash + loans + holdings at price + claims) minus liabilities.
export type Institution = {
  id: string;
  kind: InstKind;
  tag: string;
  cash: number;
  loans: number;
  holdings: Record<AssetId, number>;
  deposits: number;
  shortFunding: number;
  otherLiab: number;
};

/// `lender` is owed `amount` by `borrower`; `collateral` is the market value pledged against it (repo, derivatives).
export type Exposure = {
  id: string;
  lender: string;
  borrower: string;
  type: ExposureType;
  amount: number;
  collateral: number;
};

/// `depth` = $bn of net sales that move the price by 1%.
export type AssetClass = { id: AssetId; depth: number };
export type FinNetwork = { institutions: Institution[]; exposures: Exposure[]; assets: AssetClass[] };

export type Channels = { direct: boolean; fireSales: boolean; funding: boolean; ccp: boolean };

export type SimParams = {
  days: number;
  lgd: number;
  distressRatio: number;
  runTrigger: number;
  runFraction: number;
  depositRunFraction: number;
  targetRatio: number;
  priceFloor: number;
  channels: Channels;
  /// Background market (noise, recovery, aftershocks); absent ⇒ a purely deterministic cascade.
  market?: MarketParams;
};

/// `vol` = daily log-price volatility; `recovery` = share of the gap to par closed per day; aftershocks arrive with
/// daily probability `baseRate + stressRate × share of stressed institutions`.
export type MarketParams = { seed: number; vol: Record<AssetId, number>; recovery: number; baseRate: number; stressRate: number };

export type Shock =
  | { kind: "default"; id: string; day?: number }
  | { kind: "asset"; asset: AssetId; drop: number; shape: "instant" | "gradual"; days?: number; day?: number }
  | { kind: "run"; target: string /* id or InstKind */; source: "deposits" | "shortFunding"; fraction: number; day?: number };

export type Intervention =
  | { kind: "capital"; id: string; amount: number; day: number }
  | { kind: "liquidity"; day: number } // stops short-funding runs from that day
  | { kind: "guarantee"; day: number } // stops deposit runs from that day
  | { kind: "parLending"; day: number } // bonds can be pledged at par instead of sold
  | { kind: "assetPurchases"; asset: AssetId; amount: number; day: number };

export type Status = "ok" | "stressed" | "critical" | "failed";
export type ChannelLosses = { direct: number; fireSale: number; funding: number; ccp: number };

export type SimEvent = {
  day: number;
  kind: "shock" | "default" | "fireSale" | "run" | "intervention" | "calm" | "aftershock";
  id?: string;
  asset?: AssetId;
  value?: number;
  /// Aftershocks only: what hit.
  cause?: "jolt" | "rumour" | "writedown";
};

/// End-of-day snapshot. `losses`/`lossesById`/`flows`/`events` are that day's only (not cumulative).
export type DayState = {
  day: number;
  equity: Record<string, number>;
  assets: Record<string, number>;
  status: Record<string, Status>;
  prices: Record<AssetId, number>;
  losses: ChannelLosses;
  lossesById: Record<string, ChannelLosses>;
  flows: { from: string; to: string; amount: number; channel: keyof ChannelLosses }[];
  events: SimEvent[];
};

export type SimResult = {
  days: DayState[];
  defaults: string[];
  totalLoss: number;
  peakPriceDrop: Record<AssetId, number>;
};
