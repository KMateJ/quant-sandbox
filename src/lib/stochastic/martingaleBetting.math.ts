import { makeRng, type Rng } from "../math/random";

/// Betting strategies for a fair coin game. Every one of them picks its stake from the past only,
/// so the wealth stays a martingale: the expected final wealth equals the starting wealth.
export type BettingStrategy = "constant" | "doubling" | "fraction";

export const BETTING_SETUP = {
  start: 100,
  rounds: 100,
  players: 1000,
  /// Base stake for the constant and doubling strategies.
  unit: 1,
  /// Largest number of doublings after consecutive losses (stakes 1, 2, …, 64); then the stake restarts at 1.
  maxDoublings: 6,
  /// Share of current wealth staked by the "fraction" strategy.
  share: 0.05,
} as const;

/// One player: current wealth, the losing streak (for doubling) and the wealth after every round.
export type Player = { wealth: number; streak: number; path: number[] };

/// A player before the first round.
export function newPlayer(start = BETTING_SETUP.start): Player {
  return { wealth: start, streak: 0, path: [start] };
}

/// Stake for the next round, decided from the past only and never more than the current wealth.
export function stakeFor(p: Player, strategy: BettingStrategy): number {
  const { unit, maxDoublings, share } = BETTING_SETUP;
  const wanted =
    strategy === "constant" ? unit :
    strategy === "doubling" ? unit * 2 ** (p.streak % (maxDoublings + 1)) :
    share * p.wealth;
  return Math.min(wanted, p.wealth);
}

/// Plays one round: a fair coin wins or loses the stake.
export function playRound(p: Player, strategy: BettingStrategy, rng: Rng): Player {
  const stake = stakeFor(p, strategy);
  const win = rng() < 0.5;
  const wealth = p.wealth + (win ? stake : -stake);
  return { wealth, streak: win ? 0 : p.streak + 1, path: [...p.path, wealth] };
}

/// Plays `rounds` rounds in a row.
export function playRounds(p: Player, strategy: BettingStrategy, rng: Rng, rounds: number): Player {
  let q = p;
  for (let i = 0; i < rounds; i++) q = playRound(q, strategy, rng);
  return q;
}

/// Final wealth of many independent players, with the summary the figure reads out.
/// `se` is the standard error of the mean, so the readout can show how close to the start a sample of this size can get.
export type CrowdResult = { finals: number[]; mean: number; se: number; shareAhead: number; worst: number; best: number };

/// Simulates `players` players for `rounds` rounds each, from a fixed seed.
export function simulateCrowd(strategy: BettingStrategy, seed: number, players: number = BETTING_SETUP.players, rounds: number = BETTING_SETUP.rounds): CrowdResult {
  const rng = makeRng(seed);
  const finals = new Array<number>(players);
  for (let i = 0; i < players; i++) {
    // Only the final wealth is needed here, so skip the path bookkeeping.
    let p: Player = { wealth: BETTING_SETUP.start, streak: 0, path: [] };
    for (let k = 0; k < rounds; k++) {
      const stake = stakeFor(p, strategy);
      const win = rng() < 0.5;
      p = { wealth: p.wealth + (win ? stake : -stake), streak: win ? 0 : p.streak + 1, path: p.path };
    }
    finals[i] = p.wealth;
  }
  const mean = finals.reduce((a, b) => a + b, 0) / players;
  const variance = finals.reduce((a, w) => a + (w - mean) ** 2, 0) / (players - 1);
  return {
    finals,
    mean,
    se: Math.sqrt(variance / players),
    shareAhead: finals.filter((w) => w > BETTING_SETUP.start).length / players,
    worst: Math.min(...finals),
    best: Math.max(...finals),
  };
}

/// Equal-width histogram of `values` over their own range, with about `bins` bins. When every value is a whole
/// number of the same parity (constant stakes: 100 ± an even number), the width is a whole even number centred
/// on the possible values, so bins don't alternate between holding one and two of them.
export function histogram(values: number[], target = 24): { lo: number; width: number; counts: number[] } {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const lattice = values.every((v) => Number.isInteger(v) && (v - min) % 2 === 0);
  const width = lattice ? 2 * Math.max(1, Math.ceil((max - min) / (2 * target))) : Math.max(1, (max - min + 1) / target);
  const lo = lattice ? min - 1 : Math.floor(min);
  const bins = Math.max(1, Math.ceil((max - lo + (lattice ? 1 : 0)) / width));
  const counts = new Array<number>(bins).fill(0);
  for (const v of values) counts[Math.min(bins - 1, Math.floor((v - lo) / width))] += 1;
  return { lo, width, counts };
}

/// The doubling strategy over at most `rounds` rounds from a stake of 1: chance of losing every round,
/// the loss then, and the expected gain (zero for a fair coin).
export function doublingOutcome(rounds: number) {
  const pLoseAll = 0.5 ** rounds;
  const lossAll = 2 ** rounds - 1;
  return { pLoseAll, lossAll, expectedGain: (1 - pLoseAll) * 1 - pLoseAll * lossAll };
}
