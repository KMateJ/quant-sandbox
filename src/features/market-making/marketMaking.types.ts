import type { Ledger } from "../../lib/market/maker";
import type { Side } from "../../lib/market/market.types";

/// Customer flow of a quoting round; prices in ¢ relative to the start fair value.
export type MmParams = {
  /// Arrivals per second.
  lambda: number;
  /// Fill decay per ¢: a noise customer accepts a quote up to an Exp(k) premium away from fair.
  k: number;
  /// Share of informed customers.
  informed: number;
  /// Fair-value volatility, ¢/√s.
  sigma: number;
  /// How far ahead informed customers see, s.
  horizon: number;
  /// Noise buy share − 0.5.
  imbalance: number;
  /// Shares per fill.
  lot: number;
};

export const DEFAULT_MM_PARAMS: MmParams = { lambda: 4, k: 0.5, informed: 0, sigma: 1, horizon: 3, imbalance: 0, lot: 100 };

export const ROUND_SECONDS = 60;
export const ROUND_DT = 0.1;
export const ROUND_STEPS = ROUND_SECONDS / ROUND_DT;
/// Challenge rule: |inventory| must stay within this many shares.
export const INVENTORY_LIMIT = 1000;

/// One pre-drawn customer; `buy` is ignored for informed customers, who trade on the future fair value.
export type Arrival = { t: number; informed: boolean; buy: boolean; premium: number };

/// Everything random in a round, drawn before play so any quoting meets the same customers.
export type RoundSchedule = { fair: number[]; arrivals: Arrival[][]; horizonSteps: number };

/// Quotes as ¢ distances from the current fair value: bid = fair − `bid`, ask = fair + `ask`; `live: false` = pulled.
export type Quotes = { bid: number; ask: number; live: boolean };

/// One customer as it played out; `price` is where the customer would trade (¢, absolute).
export type CustomerEvent = { t: number; informed: boolean; buy: boolean; price: number; filled: boolean };

/// One of your fills; `side` is your side; `markout` is the side-signed fair move over the horizon (¢).
export type FillRecord = { t: number; side: Side; price: number; informed: boolean; markout: number };

export type RoundState = {
  step: number;
  ledger: Ledger;
  fills: FillRecord[];
  events: CustomerEvent[];
  /// Quotes per finished step, for the rail and the time-weighted spread.
  quotes: Quotes[];
  maxAbsInventory: number;
};

export type RoundSummary = {
  avgHalfSpread: number;
  pnlPerMin: number;
  pnl: number;
  fills: number;
  informedFills: number;
  informedCost: number;
  maxAbsInventory: number;
  parts: { spread: number; adverse: number; inventory: number; fees: number; total: number };
};

/// A finished round on the "your rounds" chart.
export type RoundResult = RoundSummary & { informed: number; seed: number; bot: boolean };
