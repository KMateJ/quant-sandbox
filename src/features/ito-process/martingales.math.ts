import { makeRng } from "../../lib/math/random";
import { BETTING_SETUP, stakeFor, type BettingStrategy, type Player } from "../../lib/stochastic/martingaleBetting.math";

/// Strategies of the martingale page: the shared constant and doubling stakes, plus "stop once +1 ahead".
export type MartingaleStrategy = Extract<BettingStrategy, "constant" | "doubling"> | "stop";

export type MartingaleResult = {
  finals: number[];
  /// Mean wealth of the crowd after each round (index 0 is the start).
  meanByRound: number[];
  mean: number;
  se: number;
  /// Share of players with no wealth left at the end.
  ruined: number;
  /// Share of players above the starting wealth at the end.
  ahead: number;
};

/// A fair-coin crowd under one strategy. "stop" bets one unit until wealth reaches start + 1, then sits out;
/// the stopped wealth is still a martingale, so the mean stays at the start while the losers form a left tail.
export function simulateMartingale(strategy: MartingaleStrategy, seed: number, players: number, rounds: number): MartingaleResult {
  const rng = makeRng(seed);
  const { start } = BETTING_SETUP;
  const base: BettingStrategy = strategy === "stop" ? "constant" : strategy;
  const sums = new Float64Array(rounds + 1).fill(start * players);
  const finals = new Array<number>(players);
  for (let i = 0; i < players; i++) {
    let p: Player = { wealth: start, streak: 0, path: [] };
    for (let k = 1; k <= rounds; k++) {
      if (!(strategy === "stop" && p.wealth > start)) {
        const stake = stakeFor(p, base);
        const win = rng() < 0.5;
        p = { wealth: p.wealth + (win ? stake : -stake), streak: win ? 0 : p.streak + 1, path: p.path };
      }
      sums[k] += p.wealth - start;
    }
    finals[i] = p.wealth;
  }
  const mean = finals.reduce((a, b) => a + b, 0) / players;
  const variance = finals.reduce((a, w) => a + (w - mean) ** 2, 0) / (players - 1);
  return {
    finals,
    meanByRound: Array.from(sums, (s) => s / players),
    mean,
    se: Math.sqrt(variance / players),
    ruined: finals.filter((w) => w <= 0).length / players,
    ahead: finals.filter((w) => w > start).length / players,
  };
}
