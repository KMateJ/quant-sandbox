import { subSeed } from "../../lib/game/seed";
import { decompose } from "../../lib/market/maker";
import { ROUND_DT, type FillRecord, type MmParams, type RoundSchedule, type RoundState, type RoundSummary } from "./marketMaking.types";
import { fairAt, playBot, roundPnl, roundSchedule } from "./round.math";

/// $ result of one fill once the horizon has passed: half-spread earned plus the side-signed markout.
export const fillOutcome = (f: FillRecord, s: RoundSchedule, lot: number) => (Math.abs(f.price - fairAt(s, f.t)) + f.markout) * (lot / 100);

/// Stats of a (possibly unfinished) round: time-weighted live half-spread, P&L per minute and its split.
export function roundSummary(state: RoundState, s: RoundSchedule, p: MmParams): RoundSummary {
  const live = state.quotes.filter((q) => q.live);
  const avgHalfSpread = live.length ? live.reduce((sum, q) => sum + (q.bid + q.ask) / 2, 0) / live.length : 0;
  const endT = state.step * ROUND_DT;
  const pnl = roundPnl(state, s);
  const informed = state.fills.filter((f) => f.informed);
  return {
    avgHalfSpread,
    pnl,
    pnlPerMin: endT > 0 ? (pnl * 60) / endT : 0,
    fills: state.fills.length,
    informedFills: informed.length,
    informedCost: -informed.reduce((sum, f) => sum + fillOutcome(f, s, p.lot), 0),
    maxAbsInventory: state.maxAbsInventory,
    parts: decompose(state.ledger, (t) => fairAt(s, t) / 100, endT, p.horizon),
  };
}

/// `n` bot rounds quoting ±δ on derived seeds; their summaries, for the cloud on the rounds chart.
export function runBotRounds(p: MmParams, delta: number, seed: number, n = 40): RoundSummary[] {
  const out: RoundSummary[] = [];
  for (let i = 0; i < n; i++) {
    const s = roundSchedule(p, subSeed(seed, i + 1));
    out.push(roundSummary(playBot(s, p, delta), s, p));
  }
  return out;
}
