import { asQuotes } from "../../../lib/market/quotes";
import { reduceMm, startMm } from "./book.math";
import { mmMarket } from "./market.math";
import { mmPnl } from "./objectives.math";
import type { MmAction, MmMarket, MmMission, MmPolicyId, MmState } from "./mm.types";

export const MM_POLICIES: readonly MmPolicyId[] = ["join", "wide", "as", "flatten"];

const AS_EVERY = 5;
const FLATTEN_AT = 0.6;
const WIDE = 3;

const quoteAt = (offset: number, mission: MmMission): MmAction => ({
  type: "setQuote",
  quote: { bidOffset: offset, askOffset: offset, size: mission.quoteSize, live: true, auto: true },
});

/// Avellaneda–Stoikov offsets in ticks; σ is scaled to the whole session so that tLeft runs 1 → 0.
function asAction(s: MmState, mission: MmMission): MmAction {
  const sigma = mission.flow.sigmaTicks * Math.sqrt(mission.seconds);
  const q = s.ledger.inventory / mission.quoteSize;
  const tLeft = (mission.seconds - s.t) / mission.seconds;
  const { reservation, halfSpread } = asQuotes({ s: 0, q, gamma: mission.gamma, sigma, k: mission.k, tLeft });
  const quote = {
    bidOffset: Math.max(0.5, halfSpread - reservation),
    askOffset: Math.max(0.5, halfSpread + reservation),
    size: mission.quoteSize,
    live: true,
    auto: true,
  };
  return { type: "setQuote", quote };
}

/// The robot's actions before tick `s.t`.
export function policyActions(id: MmPolicyId, s: MmState, mission: MmMission): MmAction[] {
  switch (id) {
    case "join":
      return s.t === 0 ? [quoteAt(0.5, mission)] : [];
    case "wide":
      return s.t === 0 ? [quoteAt(WIDE, mission)] : [];
    case "as":
      return s.t % AS_EVERY === 0 ? [asAction(s, mission)] : [];
    case "flatten": {
      const out = s.t === 0 ? [quoteAt(0.5, mission)] : [];
      const inv = s.ledger.inventory;
      return Math.abs(inv) > FLATTEN_AT * mission.limit ? [...out, { type: "hedge", size: Math.abs(inv) }] : out;
    }
  }
}

/// Play a whole mission with a robot through the reducer; same mission + seed ⇒ same result.
export function replayMm(mission: MmMission, seed: number, id: MmPolicyId, market: MmMarket = mmMarket(mission, seed)) {
  let s = startMm(mission, seed, market);
  while (!s.settled) {
    for (const a of policyActions(id, s, mission)) s = reduceMm(s, a, mission, market);
    s = reduceMm(s, { type: "step", ticks: 1 }, mission, market);
  }
  return { state: s, pnl: mmPnl(s) };
}
