import { applyFill, emptyLedger, pnlTotal } from "../../lib/market/maker";
import { makeRng, nextExponential, nextNormal, nextPoisson } from "../../lib/math/random";
import {
  ROUND_DT,
  ROUND_STEPS,
  type CustomerEvent,
  type FillRecord,
  type MmParams,
  type Quotes,
  type RoundSchedule,
  type RoundState,
} from "./marketMaking.types";

/// Pre-draws the fair path (round + informed horizon) and the customers of every step.
export function roundSchedule(p: MmParams, seed: number): RoundSchedule {
  const rng = makeRng(seed);
  const horizonSteps = Math.round(p.horizon / ROUND_DT);
  const fair = [0];
  const sd = p.sigma * Math.sqrt(ROUND_DT);
  for (let i = 0; i < ROUND_STEPS + horizonSteps; i++) fair.push(fair[i] + sd * nextNormal(rng));
  const arrivals = [];
  for (let i = 0; i < ROUND_STEPS; i++) {
    const n = nextPoisson(rng, p.lambda * ROUND_DT);
    const step = [];
    for (let j = 0; j < n; j++) {
      const t = (i + rng()) * ROUND_DT;
      const informed = rng() < p.informed;
      const buy = rng() < 0.5 + p.imbalance;
      step.push({ t, informed, buy, premium: nextExponential(rng, p.k) });
    }
    arrivals.push(step.sort((a, b) => a.t - b.t));
  }
  return { fair, arrivals, horizonSteps };
}

/// A round before its first step.
export function emptyRound(): RoundState {
  return { step: 0, ledger: emptyLedger(), fills: [], events: [], quotes: [], maxAbsInventory: 0 };
}

/// Fair value (¢) at time t, read from the step grid.
export const fairAt = (s: RoundSchedule, t: number) => s.fair[Math.min(s.fair.length - 1, Math.max(0, Math.round(t / ROUND_DT)))];

/// Plays one 0.1 s step with the given quotes: noise customers fill when the quote is within their premium,
/// informed ones when the fair value one horizon ahead is beyond the quote. Money in $ for `lot`-share fills.
export function stepRound(state: RoundState, quotes: Quotes, s: RoundSchedule, p: MmParams): RoundState {
  if (state.step >= ROUND_STEPS) return state;
  const i = state.step;
  const fair = s.fair[i];
  const future = s.fair[i + s.horizonSteps];
  let { ledger, maxAbsInventory } = state;
  const fills: FillRecord[] = [];
  const events: CustomerEvent[] = [];
  for (const a of s.arrivals[i]) {
    const buy = a.informed ? future > fair + quotes.ask : a.buy;
    const sell = a.informed ? future < fair - quotes.bid : !a.buy;
    const wantsQuote = buy ? quotes.ask : quotes.bid;
    const filled = quotes.live && (a.informed ? buy || sell : wantsQuote <= a.premium);
    const isBuy = a.informed ? buy : a.buy;
    events.push({ t: a.t, informed: a.informed, buy: isBuy, price: fair + (isBuy ? 1 : -1) * (a.informed ? Math.abs(future - fair) : a.premium), filled });
    if (!filled) continue;
    const side = isBuy ? "sell" : "buy";
    const price = isBuy ? fair + quotes.ask : fair - quotes.bid;
    ledger = applyFill(ledger, { t: a.t, side, price: price / 100, size: p.lot, mid: fair / 100, fee: 0 });
    maxAbsInventory = Math.max(maxAbsInventory, Math.abs(ledger.inventory));
    fills.push({ t: a.t, side, price, informed: a.informed, markout: (side === "buy" ? 1 : -1) * (future - fair) });
  }
  return {
    step: i + 1,
    ledger,
    fills: fills.length ? [...state.fills, ...fills] : state.fills,
    events: events.length ? [...state.events, ...events] : state.events,
    quotes: [...state.quotes, quotes],
    maxAbsInventory,
  };
}

/// Marked-to-fair P&L in $ after the steps played so far.
export const roundPnl = (state: RoundState, s: RoundSchedule) => pnlTotal(state.ledger, s.fair[state.step] / 100);

/// Plays a full round with a symmetric bot quoting ±δ around fair (never skews).
export function playBot(s: RoundSchedule, p: MmParams, delta: number): RoundState {
  let st = emptyRound();
  const q: Quotes = { bid: delta, ask: delta, live: true };
  while (st.step < ROUND_STEPS) st = stepRound(st, q, s, p);
  return st;
}
