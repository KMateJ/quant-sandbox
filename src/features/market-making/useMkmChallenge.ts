import { useState } from "react";
import { recordChallenge } from "../../lib/game/challengeScores";
import { INVENTORY_LIMIT, type MmParams, type RoundSummary } from "./marketMaking.types";
import { challengeTarget } from "./theory.math";

const CHALLENGE = "mkm-round";
/// Share of the best theoretical P&L a round must reach (bot at the best spread hits 9 of seeds 1–20).
export const TARGET_SHARE = 0.6;
/// Fixed flow of a challenge round.
export const CHALLENGE_FLOW = { informed: 0.2, imbalance: 0 };

export type ChallengeResult = { pnl: number; target: number; maxAbsInventory: number; hit: boolean };

/// Scores finished challenge rounds and saves each one to the Sandbox record.
export function useMkmChallenge(params: MmParams) {
  const target = challengeTarget(params, TARGET_SHARE);
  const [last, setLast] = useState<ChallengeResult | null>(null);
  const score = (s: RoundSummary) => {
    const hit = s.pnl >= target && s.maxAbsInventory <= INVENTORY_LIMIT;
    recordChallenge(CHALLENGE, hit, Date.now());
    setLast({ pnl: s.pnl, target, maxAbsInventory: s.maxAbsInventory, hit });
  };
  return { id: CHALLENGE, target, last, score, clear: () => setLast(null) };
}

export type MkmChallenge = ReturnType<typeof useMkmChallenge>;
